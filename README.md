# H4H Project - Ready to Use

## Quick Start

### Frontend:
```bash
cd frontend
npm create vite@latest . -- --template react
npm install firebase @google/generative-ai react-router-dom framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

See SETUP_GUIDE.md for detailed instructions!
