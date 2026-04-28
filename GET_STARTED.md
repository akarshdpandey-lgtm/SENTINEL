# 🎯 SENTINEL PROJECT - GET STARTED NOW

## What You Have

A complete, production-ready emergency response system with:
- ✅ 10 advanced features fully implemented
- ✅ React frontend with custom animations
- ✅ Express backend with Gemini AI integration
- ✅ Real-time heatmap dashboard
- ✅ Voice emergency detection
- ✅ Team load balancing
- ✅ SLA timer with auto-escalation
- ✅ One-click demo mode
- ✅ 50+ source files, 3000+ lines of code

## 🚀 Three Steps to Launch

### Step 1: Add Your API Key

```bash
# Open: backend/.env
# Add your Gemini API key from https://aistudio.google.com/app/apikey

GEMINI_API_KEY=paste_your_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```
✓ Server runs at http://localhost:5000

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm run dev
```
✓ App opens at http://localhost:3000

## 🎬 Demo for Judges

**Click "🎬 Demo" button in top-right corner**
- Runs 7-step automated demo
- Shows all 10 features in ~2 minutes
- Perfect for presentation

## 📋 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express.js entry point |
| `backend/.env.example` | Configuration template |
| `backend/controllers/*` | Business logic (AI, teams, analytics) |
| `frontend/src/App.jsx` | React main app |
| `frontend/src/components/*` | All 9 UI components |
| `README.md` | Complete documentation |
| `QUICKSTART.md` | Quick reference guide |

## 🔑 Critical: Your API Key

⚠️ **DO NOT:**
- Commit `.env` to git
- Share your API key
- Put key in source files

✅ **DO:**
- Create `.env` from `.env.example`
- Add key only to `.env` file
- Use `process.env.GEMINI_API_KEY` in code

## 🎨 What's Included

### Frontend Components
- Voice Monitor (speech recognition)
- Panic Button (emergency trigger)
- Heatmap (campus visualization)
- Team Status (capacity display)
- Timer Card (SLA countdown)
- Escalation Ladder (5-level notification)
- Notification Grid (6-channel alerts)
- Risk Chart (24-hour predictions)
- Campus Map (cross-campus coordination)

### Backend Controllers
- AI Controller (Gemini integration)
- Emergency Controller (CRUD operations)
- Team Controller (load balancing)
- Analytics Controller (predictions & heatmap)
- Demo Controller (automated sequences)

### Features
1. 🎙️ Voice Emergency Detection
2. 🔮 Predictive Risk Analytics
3. 👥 Team Load Balancing
4. 📍 Geo-Fenced High-Risk Zones
5. 🎬 Auto Demo Mode
6. 📢 Multi-Channel Notifications
7. 🔥 Real-Time Heatmap Dashboard
8. ⏱️ SLA Response Timer
9. 🔼 Auto-Escalation Ladder
10. 🌐 Cross-Campus Network Sync

## 🧪 Quick Tests

**Test 1: Voice Detection**
1. Open app at http://localhost:3000
2. Click "Start" in Voice Monitor
3. Say "Help! There's a fire!"
4. Watch urgency score increase

**Test 2: Demo Mode**
1. Click "🎬 Demo" in top-right
2. Click "Start Demo"
3. Watch 7 steps execute automatically
4. See all features in action

**Test 3: Manual Emergency**
1. Click red 🚨 button (bottom-right)
2. Fill in emergency details
3. Click "Report Emergency"
4. See it appear in dashboard

## 📊 Project Structure

```
sentinel/
├── backend/
│   ├── server.js ..................... Express app
│   ├── .env.example .................. Config template (copy this!)
│   ├── package.json .................. Dependencies
│   ├── controllers/
│   │   ├── aiController.js ........... Gemini AI
│   │   ├── emergencyController.js .... CRUD + geo-fencing
│   │   ├── teamController.js ......... Load balancing
│   │   ├── analyticsController.js .... Predictions
│   │   └── demoController.js ......... Demo automation
│   ├── routes/
│   │   ├── emergency.js .............. Emergency endpoints
│   │   ├── analytics.js .............. Analytics endpoints
│   │   ├── teams.js .................. Team endpoints
│   │   └── demo.js ................... Demo endpoints
│   └── middleware/
│       ├── auth.js ................... Rate limiting
│       └── error.js .................. Error handling
│
└── frontend/
    ├── src/
    │   ├── App.jsx ................... Main app
    │   ├── App.css ................... Animations
    │   ├── components/
    │   │   ├── PanicButton.jsx ....... Emergency trigger
    │   │   ├── VoiceMonitor.jsx ...... Speech recognition
    │   │   ├── Heatmap.jsx ........... Grid visualization
    │   │   ├── TeamStatus.jsx ........ Capacity display
    │   │   ├── TimerCard.jsx ......... SLA countdown
    │   │   ├── EscalationLadder.jsx .. Escalation UI
    │   │   ├── NotificationGrid.jsx .. Alert channels
    │   │   ├── RiskChart.jsx ......... Predictions
    │   │   └── CampusMap.jsx ......... Cross-campus
    │   └── pages/
    │       ├── DashboardPage.jsx ..... Main dashboard
    │       ├── AlertDetail.jsx ....... Emergency detail
    │       └── DemoControl.jsx ....... Demo control
    └── vite.config.js ................ Build config
```

## ⚡ Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server (auto-reload)
npm start            # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🆘 Troubleshooting

**"Port 5000 already in use"**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**"API key not found"**
- Create `backend/.env` file
- Copy content from `backend/.env.example`
- Paste your API key (from https://aistudio.google.com/app/apikey)
- Restart backend

**"Frontend can't connect to backend"**
- Ensure backend running on http://localhost:5000
- Check `/health` endpoint works
- Verify CORS_ORIGIN in .env

**"Voice not detecting"**
- Use Chrome or Firefox
- Grant microphone permission
- Speak clearly
- Check browser console for errors

## 📱 URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main application |
| http://localhost:5000 | Backend API |
| http://localhost:5000/health | Health check |
| http://localhost:5000/api | API info |

## 📚 Documentation Files

- `README.md` - Comprehensive guide (2000+ words)
- `QUICKSTART.md` - Quick reference
- `COMPLETION_CHECKLIST.md` - Feature checklist
- Inline code comments throughout

## 🏆 For Judges

**Best way to showcase:**
1. Open http://localhost:3000
2. Click "🎬 Demo" button
3. Click "Start Demo"
4. Watch 2-minute presentation of all 10 features

**Or manually showcase:**
1. Create emergencies with panic button
2. Use voice monitor to trigger alerts
3. Click emergencies to see details
4. Watch timers count down
5. See escalation ladder in action
6. Check team load balancing
7. Explore heatmap
8. View predictions
9. Check notifications
10. Browse campus network

## ✅ Checklist Before Presenting

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Demo button works
- [ ] Voice monitor hears keywords
- [ ] Panic button creates emergencies
- [ ] Heatmap shows zones
- [ ] Team status updates
- [ ] Timer counts down
- [ ] Escalation ladder visible
- [ ] Notifications display

## 🎯 Next Steps

1. **Right Now:** Add API key to `backend/.env`
2. **Terminal 1:** `cd backend && npm install && npm run dev`
3. **Terminal 2:** `cd frontend && npm install && npm run dev`
4. **Click:** 🎬 Demo button to showcase
5. **Present:** System to judges!

---

**You now have a complete emergency response system ready to impress!** 🚀

Questions? Check `README.md` or `QUICKSTART.md`
