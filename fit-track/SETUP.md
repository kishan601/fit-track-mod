# FitTrack - Setup Instructions

## Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Quick Setup

1. **Extract/Download** this folder to your desired location
2. **Open terminal** in the `fittrack-standalone-cra` folder
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the application**:
   ```bash
   npm start
   ```
5. **Open browser** to `http://localhost:3000`

## Features Included
✅ Beautiful luxury gradient UI  
✅ Workout logging with date/time  
✅ Progress tracking charts  
✅ Exercise library  
✅ Fitness goals  
✅ Dark/Light theme toggle  
✅ Responsive design  
✅ localStorage persistence  

## Troubleshooting

### Port Already in Use
If port 3000 is busy, the app will automatically use another port (3001, 3002, etc.)

### Dependencies Won't Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
npm run build
```

### Clear Browser Data
If you see stale data, clear localStorage:
1. Open browser dev tools (F12)
2. Go to Application/Storage tab
3. Click "localStorage" 
4. Delete all FitTrack entries

## File Structure
```
fittrack-standalone-cra/
├── public/           # Static assets
├── src/
│   ├── components/   # UI components
│   ├── data/         # localStorage management
│   ├── hooks/        # React hooks
│   ├── lib/          # Utilities
│   ├── pages/        # App pages
│   └── shared/       # Types & schemas
├── package.json      # Dependencies
└── README.md         # Full documentation
```

## What's Different from Regular CRA

This project includes:
- Pre-built UI component library (Radix UI + shadcn)
- TailwindCSS with custom gradient system
- React Query for state management  
- Complete fitness tracking functionality
- No backend required - uses localStorage

## Development

To customize:
- Edit components in `src/components/`
- Modify styles in `src/index.css`
- Update data logic in `src/data/mockStorage.ts`

Enjoy your fitness tracking app! 🏃‍♂️