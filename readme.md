# HealthConnect

A minimal MERN telemedicine app with AI chatbot.

## Setup

### Backend
```bash
cd backend
npm install
# Edit .env — set MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Default URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Gemini API Key
Get a free key at https://aistudio.google.com/app/apikey and set it in `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

## Notes
- 7 dummy doctors are auto-seeded on first backend start (if no doctors exist in DB).
- The floating 💬 button (bottom-right) opens the AI health chatbot.
- Uploaded files are stored in `backend/uploads/`.
