# Reward Hub Application

## Overview
Reward Hub is a comprehensive application available for both web and mobile platforms that combines health tracking, social features, and a rewards system. Users can track their health goals, earn rewards through various activities, and engage with a social community.

## Web Version (Current)
The web version is built with React + TypeScript and uses Vite for build tooling. See below for web-specific setup and features.

### Web Tech Stack
- React + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Query for data management
- React Router for navigation

### Web Installation
```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd reward-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

## Mobile Version (React Native)
The mobile version provides the same core features using React Native. Below is the guide for setting up and implementing the mobile version.

### Mobile Tech Stack
- React Native
- Expo (recommended)
- React Navigation for routing
- React Query for data management
- AsyncStorage for local storage
- React Native Paper for UI components

### Mobile Setup
```sh
# Create new Expo project
npx create-expo-app RewardHubMobile

# Navigate to project
cd RewardHubMobile

# Install dependencies
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install @tanstack/react-query
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-paper
```

### Feature Implementation Guide

#### 1. Health Tracking
```typescript
// Mobile implementation using React Native sensors
import { Accelerometer } from 'expo-sensors';

const PedometerComponent = () => {
  // Implementation details for step counting
};
```

#### 2. Social Features
```typescript
// Using React Native specific components
import { FlatList, Image } from 'react-native';

const SocialFeed = () => {
  // Implementation for social feed
};
```

#### 3. Reward System
```typescript
// Using AsyncStorage for local data
import AsyncStorage from '@react-native-async-storage/async-storage';

const RewardSystem = () => {
  // Implementation for rewards
};
```

### Key Differences from Web Version

1. **Navigation**
   - Web: React Router
   - Mobile: React Navigation
   ```typescript
   import { NavigationContainer } from '@react-navigation/native';
   import { createNativeStackNavigator } from '@react-navigation/native-stack';
   ```

2. **Storage**
   - Web: localStorage
   - Mobile: AsyncStorage
   ```typescript
   // Instead of localStorage.setItem
   await AsyncStorage.setItem('key', value);
   ```

3. **UI Components**
   - Web: HTML elements + shadcn/ui
   - Mobile: React Native components + React Native Paper
   ```typescript
   // Web
   <button onClick={handleClick}>Click me</button>
   
   // Mobile
   <TouchableOpacity onPress={handlePress}>
     <Text>Click me</Text>
   </TouchableOpacity>
   ```

4. **Styling**
   - Web: Tailwind CSS
   - Mobile: StyleSheet
   ```typescript
   // Instead of Tailwind classes
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       padding: 20,
     },
   });
   ```

### Mobile-Specific Features

1. **Push Notifications**
   ```typescript
   import * as Notifications from 'expo-notifications';
   ```

2. **Device Sensors**
   ```typescript
   import { Pedometer } from 'expo-sensors';
   ```

3. **Camera Integration**
   ```typescript
   import { Camera } from 'expo-camera';
   ```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please open an issue in the repository or contact the development team.

## Acknowledgments
- Thanks to all contributors who have helped shape this project
- Built with [Lovable](https://lovable.dev)