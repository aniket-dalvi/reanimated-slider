import React, {useEffect} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface SliderProp {
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

export default function Slider(props: SliderProp) {
  const unitX = props.sliderWidth / props.totalDuration;

  const thumbPosition = useSharedValue(props.currentPosition * unitX);
  const lastDropPosition = useSharedValue(0);

  useEffect(() => {
    thumbPosition.value = props.currentPosition * unitX;
  }, [props.currentPosition, unitX, thumbPosition]);

  const gestureHandler = Gesture.Pan()
    .minPointers(1)
    .onUpdate(e => {
      const position = lastDropPosition.value + e.translationX;

      if (position < 0) {
        thumbPosition.value = 0;
      } else if (position > props.sliderWidth) {
        thumbPosition.value = props.sliderWidth;
      } else {
        const thumbAt = position / unitX;

        runOnJS(props.onPositionUpdate)(Math.round(thumbAt));
      }
    })
    .onFinalize(e => {
      if (e.x < 0) {
        lastDropPosition.value = 0;
      } else {
        lastDropPosition.value = e.x;
      }
    });

  const animatedThumbStyle = useAnimatedStyle(
    () => ({
      transform: [{rotate: '90deg'}],
    }),
    [thumbPosition.value],
  );

  const animatedSliderStyle = useAnimatedStyle(
    () => ({
      transform: [{translateX: thumbPosition.value}],
      width: props.sliderWidth - thumbPosition.value,
    }),
    [thumbPosition.value],
  );

  return (
    <View
      style={[
        styles.sliderContainer,
        props.sliderStyle,
        {
          backgroundColor: props.primaryColor,
        },
      ]}>
      <Animated.View
        style={[
          styles.sliderFront,
          props.sliderStyle,
          animatedSliderStyle,
          {width: props.sliderWidth, backgroundColor: props.secondaryColor},
        ]}>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View
            style={[styles.thumb, props.thumbStyle, animatedThumbStyle]}
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
