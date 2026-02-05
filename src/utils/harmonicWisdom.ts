// Rich harmonic wisdom and musical interpretation utilities

export const elementInfo: Record<string, { symbol: string; note: string; sound: string; color: string }> = {
  Fire: { 
    symbol: '△', 
    note: 'C', 
    sound: 'Fast vibrations, initiating energy', 
    color: 'warm red-orange tones' 
  },
  Earth: { 
    symbol: '▽', 
    note: 'F', 
    sound: 'Slow, steady vibrations, stabilizing', 
    color: 'grounded green-brown tones' 
  },
  Air: { 
    symbol: '◇', 
    note: 'G', 
    sound: 'Light, rapid oscillations, connecting', 
    color: 'bright yellow-blue tones' 
  },
  Water: { 
    symbol: '○', 
    note: 'E♭', 
    sound: 'Flowing, emotional vibrations, receptive', 
    color: 'cool blue-violet tones' 
  },
};

export const qualityInfo: Record<string, { action: string; rhythm: string }> = {
  Cardinal: { 
    action: 'Initiating', 
    rhythm: 'Strong downbeat, beginning of measure' 
  },
  Fixed: { 
    action: 'Sustaining', 
    rhythm: 'Long sustained note, holding the tone' 
  },
  Mutable: { 
    action: 'Transitioning', 
    rhythm: 'Syncopated, bridge between movements' 
  },
};

export const aspectMusicalData: Record<string, {
  type: string;
  feel: string;
  music: string;
  energy: string;
  resolve: string;
  isConsonant: boolean;
  isDissonant: boolean;
}> = {
  Conjunction: {
    type: 'Unison',
    feel: 'Unity & Amplification',
    music: 'two voices singing the same note',
    energy: 'Pure consonance—energies merge and amplify each other. Like an octave, this creates unity and power.',
    resolve: 'Already in perfect harmony. Use this unified energy intentionally.',
    isConsonant: true,
    isDissonant: false,
  },
  Sextile: {
    type: 'Major Third',
    feel: 'Harmonious & Flowing',
    music: 'a pleasant major chord',
    energy: 'Consonant and supportive. Like notes that naturally complement each other, creating opportunity and ease.',
    resolve: 'Natural harmony. These energies want to collaborate—simply allow them to flow together.',
    isConsonant: true,
    isDissonant: false,
  },
  Square: {
    type: 'Tritone (Devil\'s Interval)',
    feel: 'Tension & Dynamic Friction',
    music: 'a dissonant clash demanding resolution',
    energy: 'Maximum dissonance. Like the tritone that medieval musicians called "diabolus in musica," this creates uncomfortable tension. But here\'s the secret: dissonance drives evolution. We don\'t avoid dissonance—we learn from it.',
    resolve: 'Find the middle path. A square yearns for resolution. Conscious action transforms friction into growth. Lean into the discomfort—it\'s pushing you to harmonize at a higher octave.',
    isConsonant: false,
    isDissonant: true,
  },
  Trine: {
    type: 'Perfect Fifth',
    feel: 'Effortless Flow & Grace',
    music: 'the most consonant interval after unison',
    energy: 'Divine consonance. Like the perfect fifth that forms the basis of all harmony, this creates natural talent and ease.',
    resolve: 'Already beautifully resolved. These energies flow naturally—trust and follow their lead.',
    isConsonant: true,
    isDissonant: false,
  },
  Opposition: {
    type: 'Octave Polarity',
    feel: 'Mirror Tension',
    music: 'the same note in different registers',
    energy: 'Polarized consonance. Like an octave, these are the same note at opposite ends—creating both tension and recognition. We crave resolution because we sense the underlying unity.',
    resolve: 'Integration through awareness. These opposing forces want to become conscious partners. Find the balance point to harmonize the polarity.',
    isConsonant: false,
    isDissonant: true,
  },
};

export const houseWisdom: Record<number, { area: string; octave: string; wisdom: string }> = {
  1: { area: 'Self & Identity', octave: 'Root Note', wisdom: 'This is your fundamental frequency—the keynote of your entire symphony.' },
  2: { area: 'Resources & Values', octave: 'Second', wisdom: 'The harmonic that grounds your material reality and what you find valuable.' },
  3: { area: 'Communication & Mind', octave: 'Third', wisdom: 'The melody of your thoughts and how you express your inner music.' },
  4: { area: 'Home & Roots', octave: 'Fourth', wisdom: 'Your bass line—the foundational rhythm that supports everything above.' },
  5: { area: 'Creativity & Joy', octave: 'Fifth', wisdom: 'The perfect fifth—pure creative expression and authentic playfulness.' },
  6: { area: 'Service & Health', octave: 'Sixth', wisdom: 'The tuning process—where you refine and harmonize your daily rhythms.' },
  7: { area: 'Relationships', octave: 'Seventh', wisdom: 'The leading tone—seeking resolution through partnership and union.' },
  8: { area: 'Transformation', octave: 'Octave', wisdom: 'The death and rebirth of the note—transformation into a higher frequency.' },
  9: { area: 'Wisdom & Expansion', octave: 'Ninth', wisdom: 'Extended harmony—reaching beyond the octave into philosophical resonance.' },
  10: { area: 'Career & Legacy', octave: 'Tenth', wisdom: 'Your public performance—the song you sing for the world to hear.' },
  11: { area: 'Community & Vision', octave: 'Eleventh', wisdom: 'Collective harmony—the orchestra of your tribe and future vision.' },
  12: { area: 'Spirituality & Unity', octave: 'Twelfth', wisdom: 'The cosmic sustain—where all notes dissolve back into infinite silence.' },
};

export const getFrequencyCategory = (frequency: number): { category: string; resonance: string } => {
  if (frequency < 300) {
    return { category: 'Low', resonance: 'grounding, foundational' };
  } else if (frequency < 500) {
    return { category: 'Mid', resonance: 'balancing, bridging' };
  } else {
    return { category: 'High', resonance: 'elevating, transcendent' };
  }
};

export const getOrbPrecision = (orb: number): { label: string; intensity: string } => {
  if (orb < 1) {
    return { 
      label: 'Exact', 
      intensity: 'Maximum power—this aspect is singing at full volume!' 
    };
  } else if (orb < 3) {
    return { 
      label: 'Tight', 
      intensity: 'Strong resonance—clearly felt' 
    };
  } else if (orb < 6) {
    return { 
      label: 'Moderate', 
      intensity: 'Present but softer—background melody' 
    };
  } else {
    return { 
      label: 'Wide', 
      intensity: 'Subtle influence—barely audible overtone' 
    };
  }
};

export interface HarmonicAnalysis {
  consonance: number;
  tension: number;
  complexity: number;
  elements: Record<string, number>;
}

export const calculateHarmonicAnalysis = (
  aspects: Array<{ aspectType: { name: string }; orb: number }>,
  planets: Array<{ signData: { element?: string } | null }>
): HarmonicAnalysis => {
  let consonanceScore = 0;
  let tensionScore = 0;
  const consonantAspects = ['Conjunction', 'Sextile', 'Trine'];
  const dissonantAspects = ['Square', 'Opposition'];

  aspects.forEach(aspect => {
    const orbFactor = 1 - (aspect.orb / 10);
    if (consonantAspects.includes(aspect.aspectType.name)) {
      consonanceScore += orbFactor;
    }
    if (dissonantAspects.includes(aspect.aspectType.name)) {
      tensionScore += orbFactor;
    }
  });

  const totalAspects = aspects.length || 1;
  const complexityScore = totalAspects + (planets.length / 2);

  const elementCounts: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  planets.forEach(planet => {
    const element = planet.signData?.element;
    if (element && elementCounts[element] !== undefined) {
      elementCounts[element] += 1;
    }
  });

  return {
    consonance: Math.min(consonanceScore * 20, 100),
    tension: Math.min(tensionScore * 25, 100),
    complexity: Math.min(complexityScore * 8, 100),
    elements: elementCounts,
  };
};

export const getResolutionGuidance = (analysis: HarmonicAnalysis): string[] => {
  const guidance: string[] = [];

  if (analysis.tension > 50) {
    guidance.push('High tension detected. This chart has significant dissonant aspects creating evolutionary pressure. Embrace this friction—it\'s the universe asking you to grow.');
  }

  if (analysis.consonance > 60) {
    guidance.push('Harmonious flow dominates. Natural talents and ease abound. The challenge is to not become complacent—sometimes we need dissonance to evolve.');
  }

  if (analysis.complexity > 70) {
    guidance.push('Complex symphony. This is a rich, multi-layered chart. Focus on one chord at a time, allowing each harmonic relationship to teach its unique lesson.');
  }

  const dominantElement = Object.entries(analysis.elements).sort((a, b) => b[1] - a[1])[0];
  if (dominantElement && dominantElement[1] > 0) {
    const elemGuidance: Record<string, string> = {
      Fire: 'Fire frequencies sing loudly—fast, initiating, bold. Ground this energy through earth practices to avoid burnout.',
      Earth: 'Earth tones resonate—slow, steady, building. Introduce air and fire to prevent stagnation.',
      Air: 'Air frequencies vibrate—mental, connecting, communicating. Balance with water to avoid living only in your head.',
      Water: 'Water frequencies flow—emotional, receptive, intuitive. Ground with earth to avoid being overwhelmed.',
    };
    guidance.push(elemGuidance[dominantElement[0]] || '');
  }

  return guidance.filter(g => g);
};
