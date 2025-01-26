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

## Screen Structure

### Authentication Screens
```typescript
// screens/auth/LoginScreen.tsx
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome Back</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={() => {}}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
});
```

### Dashboard Screen
```typescript
// screens/DashboardScreen.tsx
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Dashboard</Text>
        <Text variant="bodyLarge">Your Rewards: 100 coins</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Title title="Health Goals" />
        <Card.Content>
          {/* Health tracking components */}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Recent Activities" />
        <Card.Content>
          {/* Activity feed */}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  card: {
    margin: 16,
  },
});
```

### Health Tracking Screen
```typescript
// screens/HealthScreen.tsx
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';

const HealthScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Health Tracking</Text>
      
      <View style={styles.goalContainer}>
        <Text>Daily Steps</Text>
        <ProgressBar progress={0.7} />
        <Text>7,000 / 10,000 steps</Text>
      </View>
      
      <View style={styles.goalContainer}>
        <Text>Water Intake</Text>
        <ProgressBar progress={0.5} />
        <Text>4 / 8 glasses</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  goalContainer: {
    marginVertical: 12,
  },
});
```

### Social Features Screen
```typescript
// screens/SocialScreen.tsx
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

const SocialScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Social Feed</Text>
      
      <FlatList
        data={[]}
        renderItem={({ item }) => (
          <Card style={styles.post}>
            <Card.Title
              title={item.username}
              left={(props) => <Avatar.Icon {...props} icon="account" />}
            />
            <Card.Content>
              <Text variant="bodyMedium">{item.content}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  post: {
    marginVertical: 8,
  },
});
```

### Rewards Screen
```typescript
// screens/RewardsScreen.tsx
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

const RewardsScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Rewards</Text>
      
      <Card style={styles.rewardCard}>
        <Card.Content>
          <Text variant="titleLarge">Lucky Draw</Text>
          <Text variant="bodyMedium">Try your luck to win rewards!</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Play Now</Button>
        </Card.Actions>
      </Card>
      
      <Card style={styles.rewardCard}>
        <Card.Content>
          <Text variant="titleLarge">Daily Rewards</Text>
          <Text variant="bodyMedium">Complete daily tasks to earn coins</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Claim</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rewardCard: {
    marginVertical: 8,
  },
});
```

## Navigation Setup
```typescript
// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
        <Stack.Screen name="Social" component={SocialScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Theme Configuration
```typescript
// theme/index.ts
import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
  },
};
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

For more detailed implementation guides and troubleshooting, refer to the official documentation of each package used in the project.