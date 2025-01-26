# Reward Hub Mobile Setup Guide

## Overview
This guide details how to implement the Reward Hub features in React Native using Expo. The mobile version maintains feature parity with the web version while utilizing mobile-native capabilities.

## Initial Setup

```bash
# Create new Expo project
npx create-expo-app RewardHubMobile

# Navigate to project directory
cd RewardHubMobile

# Install core dependencies
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install @tanstack/react-query
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-paper
```

## Project Structure
```
src/
├── components/     # Reusable UI components
│   ├── auth/      # Authentication components
│   ├── health/    # Health tracking components
│   └── social/    # Social feature components
├── navigation/    # Navigation configuration
├── screens/       # Screen components
├── hooks/        # Custom hooks
├── utils/        # Utility functions
└── types/        # TypeScript types
```

## Core Features Implementation

### 1. Authentication

```typescript
// screens/LoginScreen.tsx
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Implementation for login
    await AsyncStorage.setItem('user', JSON.stringify({ email }));
  };
};
```

### 2. Health Tracking

```typescript
// components/health/StepCounter.tsx
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

const StepCounter = () => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription;
    
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        subscription = Pedometer.watchStepCount(result => {
          setSteps(result.steps);
        });
      }
    };

    subscribe();
    return () => subscription && subscription.remove();
  }, []);
};
```

### 3. Social Features

```typescript
// components/social/PostCreation.tsx
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const PostCreation = () => {
  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      // Camera implementation
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
  };
};
```

### 4. Rewards System

```typescript
// components/rewards/LuckyDraw.tsx
import { Animated, Easing } from 'react-native';

const LuckyDraw = () => {
  const spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const startSpin = () => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };
};
```

## Additional Mobile Features

### Push Notifications
```typescript
import * as Notifications from 'expo-notifications';

const setupNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    // Store token for later use
  }
};
```

### Local Storage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};
```

### Navigation Setup
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
        <Stack.Screen name="Social" component={SocialScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Styling Guide
Instead of Tailwind CSS, use React Native's StyleSheet:

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
```

## Required Dependencies
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "@tanstack/react-query": "^4.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-paper": "^5.x",
    "expo": "~48.0.0",
    "expo-camera": "~13.2.1",
    "expo-sensors": "~12.1.1",
    "expo-notifications": "~0.18.1",
    "expo-image-picker": "~14.1.1"
  }
}
```

## Development Tips
1. Use Expo Go for rapid development and testing
2. Test on both iOS and Android regularly
3. Consider platform-specific differences in UI components
4. Implement proper error handling for native features
5. Use React Native Paper components for consistent UI
6. Implement proper permissions handling for device features

## Common Issues and Solutions
1. iOS vs Android styling differences
2. Handling different screen sizes
3. Permission management
4. Deep linking setup
5. Push notification configuration

For more detailed implementation guides and troubleshooting, refer to the official documentation of each package used in the project.