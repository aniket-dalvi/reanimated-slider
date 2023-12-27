import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Slider} from './component';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const THUMB = 16;

export default function App() {
  const {width} = useWindowDimensions();

  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timer < 30) {
      timerRef.current = setInterval(() => setTimer(timer + 1), 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [timer]);

  const config: any = {
    interval: 1000,
    currentPosition: timer,
    totalDuration: 30,
    sliderWidth: width - 40,
    primaryColor: '#ff0066',
    secondaryColor: '#fff',
    thumbStyle: {
      height: THUMB,
      width: THUMB,
      borderRadius: THUMB / 2,
    },
    sliderStyle: {
      height: 2.5,
    },
    onPositionUpdate: (position: number) => setTimer(position),
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.label}>{timer}</Text>
        <Slider {...config} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  label: {color: '#fff', marginBottom: 20},
});
