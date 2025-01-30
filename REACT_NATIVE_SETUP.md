# Reward Hub - Mobile Architecture Guide

## System Architecture

### Frontend (React Native + Expo)
- **Tech Stack**
  - React Native with Expo
  - React Query for data management
  - React Native Paper for UI components
  - AsyncStorage for local storage
  - React Navigation for routing

### Backend (NestJS)
- **Tech Stack**
  - NestJS framework
  - TypeORM for database operations
  - PostgreSQL database
  - JWT for authentication
  - Passport for auth strategies

### Database (PostgreSQL)
- **Key Entities**
  ```sql
  -- Users table
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR,
    reward_points INTEGER DEFAULT 0,
    creator_level VARCHAR DEFAULT 'beginner',
    total_views INTEGER DEFAULT 0
  );

  -- Earnings table
  CREATE TABLE earnings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2),
    source VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    is_paid BOOLEAN DEFAULT false
  );

  -- Tickets table
  CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id VARCHAR,
    purchase_date TIMESTAMP DEFAULT NOW()
  );
  ```

## Core Features

### 1. Authentication System
- JWT-based authentication
- Login/Signup flows
- Token management with AsyncStorage
- Protected route handling

### 2. Reward System
- Point accumulation based on activities
- Real-time balance updates
- Transaction history
- Reward level progression (beginner → gold)

### 3. Lucky Draw Feature
- Monthly events with prize pools
- Ticket purchase using coins/cash
- Real-time ticket management
- Winner selection mechanism

### 4. Health Tracking
- Step counting using device sensors
- Activity goals and progress
- Health metrics dashboard
- Achievement system

### 5. Social Features
- User profiles
- Activity sharing
- Social interactions (likes, comments)
- Content engagement rewards

### 6. Earnings System
- View earning statistics
- Track pending payouts
- Earnings history
- Payment processing

## API Integration

### Authentication Endpoints
```typescript
POST /auth/login
POST /auth/register
GET /auth/profile
```

### Rewards Endpoints
```typescript
GET /rewards/balance
GET /rewards/history
POST /rewards/engagement
```

### Earnings Endpoints
```typescript
GET /earnings
GET /earnings/pending
GET /earnings/status
POST /earnings/toggle
```

## Mobile-Specific Implementation

### Navigation Structure
```typescript
const Stack = createNativeStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="Auth" component={AuthNavigator} />
  <Stack.Screen name="Main" component={MainNavigator} />
  <Stack.Screen name="LuckyDraw" component={LuckyDrawScreen} />
  <Stack.Screen name="Health" component={HealthScreen} />
  <Stack.Screen name="Social" component={SocialScreen} />
  <Stack.Screen name="Earnings" component={EarningsScreen} />
</Stack.Navigator>
```

### Data Management
- React Query for API calls and caching
- AsyncStorage for local data persistence
- Real-time updates using WebSocket (optional)

### Native Features
- Push notifications for events
- Device sensors for health tracking
- Camera integration for content
- Biometric authentication

## Getting Started

1. **Environment Setup**
```bash
npx create-expo-app RewardHubMobile
cd RewardHubMobile
npm install
```

2. **Install Dependencies**
```bash
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install @tanstack/react-query
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-paper
```

3. **Run Development Server**
```bash
npx expo start
```

For detailed component implementations and screen layouts, refer to the source code in the repository.