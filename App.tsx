import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import PushNotification from 'react-native-push-notification';

const NewYearCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const backgroundColor = useRef(new Animated.Value(0)).current;
// Calculate time left until New Year 2025
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newYear = new Date('2025-01-01T00:00:00');
      const difference = newYear.getTime() - now.getTime();

      if (difference <= 0) {
        setShowFireworks(true);
        setTimeLeft('');
        clearInterval(interval);

        // Trigger Push Notification when countdown ends
        displayNotification();
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animated background color transitions
  useEffect(() => {
    Animated.loop(
      Animated.sequence([ 
        Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColor, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF5733', '#33CFFF'], // Colors will transition between these two
  });

  // Display Push Notification when countdown ends
  const displayNotification = () => {
    PushNotification.localNotification({
      title: '🎉 Happy New Year 2025!',
      message: 'May this year bring joy and prosperity to you and your loved ones!',
      playSound: true,
      soundName: 'default', // Sound when notification appears
      vibrate: true,
      vibration: 300, // Vibration length (in ms)
    });
  };

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: interpolatedBackgroundColor }]}
    >
      {!showFireworks ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>Countdown to New Year 2025:</Text>
          <Text style={styles.timer}>{timeLeft}</Text>
        </View>
      ) : (
        <View style={styles.fireworksContainer}>
          <Text style={styles.happyNewYearText}>🎉 Happy New Year 2025! 🎆</Text>
          <Text style={styles.wishText}>
            May this year bring the best out of you and may you and the people around you prosper and become happier.
          </Text>
          <ConfettiCannon
            count={200}
            origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  timer: {
    fontSize: 36,
    color: '#ffcc00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  fireworksContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  happyNewYearText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    marginBottom: 20,
  },
  wishText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default NewYearCountdown;
