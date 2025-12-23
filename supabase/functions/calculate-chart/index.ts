import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Free Astrology API endpoint
const ASTRO_API_URL = "https://json.freeastrologyapi.com/planets";

interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  latitude: number;
  longitude: number;
  timezone: number;
}

interface PlanetPosition {
  name: string;
  symbol: string;
  degree: number;
  sign: string;
  signNumber: number;
  isRetrograde: boolean;
}

const planetSymbols: Record<string, string> = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluto': '♇',
  'Ascendant': 'Asc',
};

const signNames = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, time, latitude, longitude, timezone } = await req.json() as BirthData;

    console.log("Calculating chart for:", { date, time, latitude, longitude, timezone });

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    // Call the Free Astrology API
    const response = await fetch(ASTRO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        month,
        date: day,
        hours: hour,
        minutes: minute,
        seconds: 0,
        latitude,
        longitude,
        timezone,
        settings: {
          observation_point: "topocentric",
          ayanamsha: "tropical"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astrology API error:", response.status, errorText);
      
      // Fallback: calculate approximate positions using basic astronomy
      const planets = calculateApproximatePositions(year, month, day, hour, minute);
      
      return new Response(JSON.stringify({ 
        planets,
        sunSign: planets.find(p => p.name === 'Sun')?.sign || 'Unknown',
        moonSign: planets.find(p => p.name === 'Moon')?.sign || 'Unknown',
        ascendant: planets.find(p => p.name === 'Ascendant')?.sign || 'Unknown',
        source: 'approximate'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log("API response:", JSON.stringify(data).substring(0, 500));

    // Parse the API response
    const planets: PlanetPosition[] = [];
    
    if (data.output && Array.isArray(data.output)) {
      for (const item of data.output) {
        const planetName = item.planet?.en || item.planet;
        if (planetName && planetSymbols[planetName]) {
          planets.push({
            name: planetName,
            symbol: planetSymbols[planetName],
            degree: item.fullDegree || 0,
            sign: item.zodiac_sign?.name?.en || signNames[(item.zodiac_sign?.number || 1) - 1] || 'Unknown',
            signNumber: item.zodiac_sign?.number || 1,
            isRetrograde: item.isRetro === 'true' || item.isRetro === true,
          });
        }
      }
    }

    // If API didn't return data, use approximate calculation
    if (planets.length === 0) {
      const approxPlanets = calculateApproximatePositions(year, month, day, hour, minute);
      return new Response(JSON.stringify({ 
        planets: approxPlanets,
        sunSign: approxPlanets.find(p => p.name === 'Sun')?.sign || 'Unknown',
        moonSign: approxPlanets.find(p => p.name === 'Moon')?.sign || 'Unknown',
        ascendant: approxPlanets.find(p => p.name === 'Ascendant')?.sign || 'Unknown',
        source: 'approximate'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      planets,
      sunSign: planets.find(p => p.name === 'Sun')?.sign || 'Unknown',
      moonSign: planets.find(p => p.name === 'Moon')?.sign || 'Unknown',
      ascendant: planets.find(p => p.name === 'Ascendant')?.sign || 'Unknown',
      source: 'api'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error calculating chart:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Fallback: Basic astronomical calculations for approximate planetary positions
function calculateApproximatePositions(year: number, month: number, day: number, hour: number, minute: number): PlanetPosition[] {
  // Calculate Julian Day Number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (hour + minute / 60) / 24 - 0.5;
  
  // Days since J2000.0 (January 1, 2000, 12:00 TT)
  const d = jd - 2451545.0;

  // Mean longitude of the Sun (in degrees)
  const sunMeanLong = (280.4606184 + 0.9856473662 * d) % 360;
  const sunAnomaly = (357.5291092 + 0.9856002585 * d) % 360;
  const sunAnomalyRad = sunAnomaly * Math.PI / 180;
  const sunEclipticLong = (sunMeanLong + 1.9148 * Math.sin(sunAnomalyRad) + 0.02 * Math.sin(2 * sunAnomalyRad)) % 360;

  // Moon (approximate - orbital period ~27.3 days)
  const moonMeanLong = (218.316 + 13.176396 * d) % 360;
  const moonAnomaly = (134.963 + 13.064993 * d) % 360;
  const moonAnomalyRad = moonAnomaly * Math.PI / 180;
  const moonEclipticLong = (moonMeanLong + 6.289 * Math.sin(moonAnomalyRad)) % 360;

  // Mercury (orbital period ~88 days)
  const mercuryLong = (252.251 + 4.09233 * d) % 360;
  
  // Venus (orbital period ~225 days)
  const venusLong = (181.979 + 1.60213 * d) % 360;
  
  // Mars (orbital period ~687 days)
  const marsLong = (355.433 + 0.52403 * d) % 360;
  
  // Jupiter (orbital period ~12 years)
  const jupiterLong = (34.351 + 0.08309 * d) % 360;
  
  // Saturn (orbital period ~29 years)
  const saturnLong = (50.077 + 0.03350 * d) % 360;

  const getSignFromDegree = (degree: number): { sign: string; signNumber: number } => {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const signNumber = Math.floor(normalizedDegree / 30) + 1;
    return { sign: signNames[signNumber - 1], signNumber };
  };

  const createPlanet = (name: string, degree: number, isRetro = false): PlanetPosition => {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const { sign, signNumber } = getSignFromDegree(normalizedDegree);
    return {
      name,
      symbol: planetSymbols[name] || '?',
      degree: normalizedDegree,
      sign,
      signNumber,
      isRetrograde: isRetro,
    };
  };

  return [
    createPlanet('Sun', sunEclipticLong),
    createPlanet('Moon', moonEclipticLong),
    createPlanet('Mercury', mercuryLong),
    createPlanet('Venus', venusLong),
    createPlanet('Mars', marsLong),
    createPlanet('Jupiter', jupiterLong),
    createPlanet('Saturn', saturnLong),
    createPlanet('Ascendant', sunEclipticLong + 90), // Simplified ascendant estimate
  ];
}
