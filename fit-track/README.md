# FitTrack - Standalone CRA Version

A beautiful, luxury fitness tracking application built with Create React App. Features stunning gradient designs, comprehensive workout logging, and localStorage-based data persistence.

## ✨ Features

- **Beautiful UI**: Luxury gradient themes with glass morphism effects
- **Workout Logging**: Add workouts with exercise type, duration, calories, and intensity
- **Progress Tracking**: Visual progress charts and fitness statistics
- **Exercise Library**: Pre-built exercise database with calorie calculations
- **Goal Setting**: Set and track daily/weekly fitness goals
- **Dark/Light Theme**: Elegant theme switching with smooth transitions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Local Storage**: All data persists in your browser's localStorage

## 🚀 Quick Start

1. **Download** this folder to your computer
2. **Open terminal** in the project folder
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the app**:
   ```bash
   npm start
   ```
5. **Open your browser** to `http://localhost:3000`

## 🎯 Usage

1. **Add Workouts**: Click "Add Workout" to log your exercise sessions
2. **View Progress**: Check your weekly progress charts and statistics
3. **Browse Exercises**: Explore the exercise library for workout ideas
4. **Set Goals**: Create fitness goals and track your progress
5. **Switch Themes**: Toggle between light and dark modes

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Create React App** for build tooling
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **React Query** for state management
- **React Hook Form** for form handling
- **Zod** for data validation
- **Local Storage** for data persistence

## 📱 Components

- Dashboard with real-time statistics
- Add Workout Form with date/time selection
- Recent Activities with beautiful cards
- Weekly Progress charts
- Exercise Library browser
- Fitness Goals tracker
- Theme toggle
- Responsive navigation

## 🎨 Design System

- **Gradients**: Custom CSS gradient variables
- **Typography**: Inter font family
- **Colors**: HSL-based color system
- **Animations**: Smooth transitions and micro-interactions
- **Glass Effects**: Modern backdrop-filter effects
- **Scrollbars**: Custom styled scrollbars

## 💾 Data Management

All workout data, goals, and preferences are stored in your browser's localStorage:
- Workouts with exercise details
- User fitness goals
- Theme preferences
- Exercise library data

## 🚨 Troubleshooting

If you encounter any issues:

1. **Dependencies not installing**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **App not starting**:
   - Ensure you have Node.js installed (v16 or higher)
   - Check if port 3000 is available

3. **Styling issues**:
   - Clear browser cache
   - Refresh the page

## 🔧 Development

To modify the app:
- Components are in `src/components/`
- Pages are in `src/pages/`
- Styles are in `src/index.css`
- Data management in `src/data/`

## 📄 License

This project is for personal use and learning purposes.

---

Enjoy tracking your fitness journey with FitTrack! 🏃‍♂️💪