import { useState, useCallback } from 'react';
import type { BirthData, ChartData, CosmicReading } from '@/types/astrology';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Musical modes associated with each zodiac sign
const signModes: Record<string, string> = {
  'Aries': 'A Phrygian',
  'Taurus': 'F Ionian',
  'Gemini': 'G Mixolydian',
  'Cancer': 'A Aeolian',
  'Leo': 'D Lydian',
  'Virgo': 'D Dorian',
  'Libra': 'Bb Ionian',
  'Scorpio': 'B Locrian',
  'Sagittarius': 'E Mixolydian',
  'Capricorn': 'C Dorian',
  'Aquarius': 'F# Lydian',
  'Pisces': 'E Phrygian',
};

interface GeocodingResult {
  latitude: number;
  longitude: number;
  timezone: number;
}

// Geocode location using a free service
async function geocodeLocation(location: string): Promise<GeocodingResult> {
  // Using Nominatim (OpenStreetMap) for geocoding - free and no API key required
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
    {
      headers: {
        'User-Agent': 'QuantumMelodies/1.0'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to geocode location');
  }

  const results = await response.json();
  
  if (results.length === 0) {
    // Default to a common location if geocoding fails
    console.warn('Location not found, using default coordinates');
    return { latitude: 40.7128, longitude: -74.0060, timezone: -5 }; // NYC
  }

  const { lat, lon } = results[0];
  
  // Estimate timezone from longitude (rough approximation)
  const timezone = Math.round(parseFloat(lon) / 15);
  
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    timezone,
  };
}

export function useCosmicReading() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<CosmicReading | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'geocoding' | 'calculating' | 'generating' | 'complete'>('idle');

  const generateReading = useCallback(async (birthData: BirthData) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setStage('geocoding');

    try {
      // Step 1: Geocode the location
      setProgress(10);
      const { latitude, longitude, timezone } = await geocodeLocation(birthData.location);
      
      const enrichedBirthData: BirthData = {
        ...birthData,
        latitude,
        longitude,
        timezone,
      };

      // Step 2: Calculate birth chart
      setStage('calculating');
      setProgress(30);
      
      const chartResponse = await fetch(`${SUPABASE_URL}/functions/v1/calculate-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: birthData.date,
          time: birthData.time,
          latitude,
          longitude,
          timezone,
        }),
      });

      if (!chartResponse.ok) {
        const errorData = await chartResponse.json();
        throw new Error(errorData.error || 'Failed to calculate birth chart');
      }

      const chart: ChartData = await chartResponse.json();
      setChartData(chart);
      setProgress(50);

      // Step 3: Generate music
      setStage('generating');
      setProgress(60);

      const musicResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sunSign: chart.sunSign,
          moonSign: chart.moonSign,
          ascendant: chart.ascendant,
          name: birthData.name,
        }),
      });

      if (!musicResponse.ok) {
        const contentType = musicResponse.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const errorData = await musicResponse.json();
          throw new Error(errorData.error || 'Failed to generate music');
        }
        throw new Error('Failed to generate music');
      }

      // Get audio blob and create URL
      const audioBlob = await musicResponse.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setProgress(100);

      // Get musical mode
      const musicalMode = signModes[chart.sunSign] || 'D Dorian';

      const cosmicReading: CosmicReading = {
        birthData: enrichedBirthData,
        chartData: chart,
        audioUrl: url,
        musicalMode,
      };

      setReading(cosmicReading);
      setStage('complete');

      return cosmicReading;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Cosmic reading error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setReading(null);
    setChartData(null);
    setProgress(0);
    setStage('idle');
    
    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

  return {
    loading,
    error,
    reading,
    chartData,
    audioUrl,
    progress,
    stage,
    generateReading,
    reset,
  };
}
