// components/AnimatedSVGPath.tsx

import React, { useEffect } from 'react';
import Animated, { Easing, runOnJS, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { svgPathProperties } from 'svg-path-properties';
import { PathInstruction } from '../core/JsonToPathParser'; // Import the new instruction type

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * The props now accept a full PathInstruction object, which includes not only
 * the path data 'd' but also optional styling like fill and stroke color.
 */
interface AnimatedSVGPathProps {
  instruction: PathInstruction;
  onAnimationComplete?: () => void;
}

// A constant to control the drawing speed. A lower number is faster.
const ANIMATION_SPEED_FACTOR = 3;

export const AnimatedSVGPath: React.FC<AnimatedSVGPathProps> = ({ instruction, onAnimationComplete }) => {
  // Destructure the instruction object, providing default values for styling.
  // This ensures that simple lines/text render correctly with a white stroke and no fill.
  const { d, stroke = '#FFFFFF', fill = 'none', strokeWidth = 4 } = instruction;

  // This logic remains the same: calculate the path length for the animation.
  const properties = new svgPathProperties(d);
  const length = properties.getTotalLength();
  const progress = useSharedValue(0);

  // The animation effect hook. It triggers whenever the path data 'd' changes.
  useEffect(() => {
    progress.value = 0; // Reset progress for the new path
    const duration = Math.max(150, length * ANIMATION_SPEED_FACTOR);
    
    // Animate progress from 0 to 1 over the calculated duration.
    progress.value = withTiming(1, { duration, easing: Easing.linear }, (isFinished) => {
      // When the animation completes, call the onAnimationComplete callback.
      if (isFinished && onAnimationComplete) {
        runOnJS(onAnimationComplete)();
      }
    });
  }, [d, onAnimationComplete, progress]); // Dependency array ensures this runs when the path changes.

  // useAnimatedProps connects the reanimated shared value to the SVG component's props.
  const animatedProps = useAnimatedProps(() => ({
    // This creates the "drawing" effect by animating the stroke dash offset.
    strokeDashoffset: length - length * progress.value,
  }));

  // The rendered component now uses the destructured styling properties.
  return (
    <AnimatedPath
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill={fill}
      strokeDasharray={`${length} ${length}`}
      animatedProps={animatedProps}
    />
  );
};