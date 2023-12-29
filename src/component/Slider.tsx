import React, {memo, useEffect} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface SliderProps {
  interval: number;
  currentPosition: number;
  totalDuration: number;
  sliderWidth: number;
  primaryColor: string;
  secondaryColor: string;
  type: 'horizontal' | 'vertical';
  thumbStyle: StyleProp<ViewStyle>;
  sliderStyle: StyleProp<ViewStyle>;
  onPositionUpdate: (position: number) => void;
}

function Slider({
  currentPosition,
  totalDuration,
  sliderWidth,
  primaryColor,
  secondaryColor,
  thumbStyle,
  sliderStyle,
  onPositionUpdate,
}: SliderProps) {
  const unitX = sliderWidth / totalDuration;

  const thumbPosition = useSharedValue(currentPosition * unitX);
  const lastDropPosition = useSharedValue(0);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value) {
      thumbPosition.value = currentPosition * unitX;
      lastDropPosition.value = currentPosition * unitX;
    }
  }, [currentPosition, unitX, thumbPosition, isDragging, lastDropPosition]);

  const updatePosition = (position: number) => {
    if (!position) {
      lastDropPosition.value = 0;
      return onPositionUpdate(0);
    }

    return onPositionUpdate(Math.round(position / unitX));
  };

  const gestureHandler = Gesture.Pan()
    .minPointers(1)
    .onUpdate(e => {
      const position = lastDropPosition.value + e.translationX;
      isDragging.value = true;

      thumbPosition.value =
        position < 0 ? 0 : position > sliderWidth ? sliderWidth : position;
    })
    .onFinalize(e => {
      const position = e.translationX + lastDropPosition.value;
      isDragging.value = false;

      if (position < 0) {
        return runOnJS(updatePosition)(0);
      }

      if (position > sliderWidth) {
        return runOnJS(updatePosition)(sliderWidth);
      }

      return runOnJS(updatePosition)(position);
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{rotate: '90deg'}],
  }));

  const animatedSliderStyle = useAnimatedStyle(() => ({
    transform: [{translateX: thumbPosition.value}],
    width: sliderWidth - thumbPosition.value,
  }));

  return (
    <View
      style={[
        styles.sliderContainer,
        sliderStyle,
        {backgroundColor: primaryColor},
      ]}>
      <Animated.View
        style={[
          styles.sliderFront,
          sliderStyle,
          animatedSliderStyle,
          {width: sliderWidth, backgroundColor: secondaryColor},
        ]}>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View
            style={[styles.thumb, thumbStyle, animatedThumbStyle]}
          />
        </GestureDetector>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#ff0088',
    borderRadius: 2,
  },
  sliderFront: {
    height: 4,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  thumb: {
    height: 16,
    width: 16,
    borderRadius: 8,
    position: 'absolute',
    backgroundColor: '#fff',
    left: 0,
    top: -6,
  },
});

const RNSlider = memo(Slider);
export default RNSlider;
