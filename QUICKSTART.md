# SENTINEL - QUICK SETUP GUIDE

## 🚀 One-Command Setup (Copy-Paste)

### Terminal 1 - Backend
```bash
cd backend && npm install && npm run dev
```

### Terminal 2 - Frontend  
```bash
cd frontend && npm install && npm run dev
```

## ⚠️ BEFORE YOU RUN:

### Step 1: Get Your API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (shown only once!)

### Step 2: Add to backend/.env
```
GEMINI_API_KEY=paste_your_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## ✅ What You Get

- ✨ Voice emergency detection (speak "help fire" to trigger)
- 🤖 AI-powered analysis via Gemini
- 📊 Predictive 24-hour risk forecast
- 👥 Automatic team load balancing
- 🔥 Interactive heatmap dashboard
- ⏱️ SLA timer with auto-escalation
- 🎬 One-click demo mode for judges
- 🌐 Cross-campus coordination system
- 📢 Multi-channel notifications
- 🔼 Automatic escalation ladder

## 🎬 Demo Mode

1. Open http://localhost:3000
2. Click "🎬 Demo" button
3. Click "Start Demo"
4. Watch all 10 features in action (~2 min)

## 📁 Key Files

**Backend:**
- `server.js` - Express server
- `controllers/*` - Business logic
- `.env` - Your API key goes here (create from .env.example)

**Frontend:**
- `App.jsx` - Main router
- `components/*` - React components
- `pages/*` - Full page views

## 🔗 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health

## ⚡ Common Commands

```bash
# Backend
npm run dev         # Start with auto-reload
npm start          # Start production

# Frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Kill process on port
lsof -i :5000 && kill -9 <PID>
```

**API key not found?**
- Check `backend/.env` file exists
- Verify your key is correctly pasted
- No extra spaces or quotes

**Voice not working?**
- Use Chrome or Firefox
- Grant microphone permission
- Speak clearly
- Check console for errors

**Frontend can't reach backend?**
- Ensure backend is running on :5000
- Check CORS_ORIGIN in .env

## 🎯 Testing Checklist

- [ ] Backend starts on http://localhost:5000
- [ ] Frontend opens http://localhost:3000
- [ ] Demo button works (runs 7 steps)
- [ ] Panic button creates emergency
- [ ] Voice recognition hears keywords
- [ ] Heatmap colors show zones
- [ ] Team status shows capacity
- [ ] Timer counts down to SLA
- [ ] Escalation ladder visible
- [ ] Notifications show in grid

## 🏆 For Judges

Click "🎬 Demo" in top-right corner to see entire system in 2 minutes!

---

**Ready? Let's go!** 🚀
