// components/DrawingOrchestrator.tsx

import React, { useEffect, useState } from 'react';
import { Path, Svg } from 'react-native-svg';
import { OrchestratorInstruction, PathInstruction } from '../core/JsonToPathParser';
import { useTutorSpeech } from '../hooks/useTutorSpeech';
import { AnimatedSVGPath } from './AnimatedSVGPath';

interface DrawingOrchestratorProps {
  instructions: OrchestratorInstruction[];
  viewBox: string | null;
  trigger: number;
}

export const DrawingOrchestrator: React.FC<DrawingOrchestratorProps> = ({ instructions, viewBox, trigger }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { speak, stop } = useTutorSpeech();

  // --- THE FIX IS IN THIS useEffect HOOK ---
  useEffect(() => {
    // 1. Stop any previous speech.
    stop();
    // 2. Reset the current index to ensure a clean start.
    setCurrentIndex(-1);

    // 3. Manually kick off the sequence with the first instruction.
    // We check for instructions.length > 0 to avoid errors on initial load.
    if (instructions && instructions.length > 0) {
      handleNextStep(0);
    }
  }, [trigger, instructions]); // <-- Added `instructions` to dependency array

  const handleAnimationComplete = () => {
    handleNextStep(currentIndex + 1);
  };

  const handleNextStep = (nextIndex: number) => {
    if (nextIndex >= instructions.length) {
      setCurrentIndex(instructions.length);
      return; 
    }
    
    const nextInstruction = instructions[nextIndex];

    if (!nextInstruction) {
        handleNextStep(nextIndex + 1);
        return;
    }

    // This logic is correct and remains the same.
    switch (nextInstruction.type) {
      case 'pause':
        setTimeout(() => {
          handleNextStep(nextIndex + 1);
        }, nextInstruction.duration);
        break;
      
      case 'speak':
        speak(nextInstruction.text);
        handleNextStep(nextIndex + 1);
        break;

      default:
        // This is a drawing instruction. Set it as the current one to be animated.
        setCurrentIndex(nextIndex);
        break;
    }
  };

  return (
    <Svg width="100%" height="100%" viewBox={viewBox || undefined}>
      
      {/* 1. Instantly render paths that have *already* been drawn */}
      {instructions.slice(0, currentIndex).map((inst, index) => {
        if (inst && 'd' in inst) {
          const { d, stroke = '#FFFFFF', fill = 'none', strokeWidth = 4 } = inst as PathInstruction;
          return (
            <Path 
              key={`drawn-${index}`} 
              d={d} 
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round" 
              fill={fill}
            />
          );
        }
        return null;
      })}
      
      {/* 2. Render the ONE path that is currently animating */}
      {currentIndex < instructions.length && instructions[currentIndex] && 'd' in instructions[currentIndex] && (
        <AnimatedSVGPath
          key={`animating-${trigger}-${currentIndex}`}
          instruction={instructions[currentIndex] as PathInstruction}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </Svg>
  );
};