// hooks/useTutorSpeech.ts

import * as Speech from 'expo-speech';
import { useEffect } from 'react';

export const useTutorSpeech = () => {
  // Stop any speaking when the component using this hook unmounts
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = (text: string) => {
    // A simple regex to "clean" LaTeX-like commands for better pronunciation.
    // This is a basic implementation and can be expanded.
    const speakableText = text
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '$1 divided by $2')
      .replace(/\^/g, ' to the power of ')
      .replace(/_/g, ' sub ') // For subscripts
      .replace(/\\sqrt{([^}]+)}/g, 'the square root of $1')
      .replace(/\\/g, ''); // Remove any other backslashes

    Speech.speak(speakableText, {
      language: 'en-US',
      // You can experiment with pitch and rate
      // pitch: 1.0,
      // rate: 0.9,
    });
  };

  const stop = () => {
    Speech.stop();
  };

  return { speak, stop };
};