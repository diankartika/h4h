# 🎯 Integrating Your Kaggle Model with H4H App

## 📊 STEP 1: Export Models from Kaggle

### In your Kaggle notebook, add this cell at the end:

```python
# Export trained models
import pickle
import os

# Create models directory
os.makedirs('/kaggle/working/models', exist_ok=True)

# Save FEVER pipeline
print("💾 Saving FEVER pipeline...")
with open('/kaggle/working/models/fever_pipeline.pkl', 'wb') as f:
    pickle.dump(fever_pipeline, f)
print("✓ FEVER pipeline saved")

# Save TruthfulQA pipeline (if available)
if 'truthful_pipeline' in globals() and truthful_pipeline is not None:
    print("💾 Saving TruthfulQA pipeline...")
    with open('/kaggle/working/models/truthfulqa_pipeline.pkl', 'wb') as f:
        pickle.dump(truthful_pipeline, f)
    print("✓ TruthfulQA pipeline saved")

print("\n✅ Models exported! Download the 'models' folder from Output section.")
```

### Download the models:
1. Run the cell above in Kaggle
2. Go to Output section (right sidebar)
3. Click "models" folder → Download
4. Extract the `.pkl` files

---

## 🐍 STEP 2: Setup Python Backend

### Directory structure:
```
h4h-backend/
├── app.py                    # Flask API (already created)
├── requirements.txt          # Dependencies (already created)
├── models/                   # Your trained models
│   ├── fever_pipeline.pkl    # Download from Kaggle
│   └── truthfulqa_pipeline.pkl  # Download from Kaggle
└── export_models.py          # Helper script (already created)
```

### Install dependencies:
```bash
cd h4h-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab')"
```

### Place your models:
```bash
# Create models directory
mkdir models

# Copy your downloaded .pkl files here
cp /path/to/downloaded/fever_pipeline.pkl models/
cp /path/to/downloaded/truthfulqa_pipeline.pkl models/  # if available
```

### Run the backend:
```bash
python app.py
```

**Expected output:**
```
============================================================
🚀 H4H Annotation API Server
============================================================
FEVER model: ✓ Loaded
TruthfulQA model: ✓ Loaded
============================================================
 * Running on http://0.0.0.0:5000
```

---

## ⚛️ STEP 3: Connect React Frontend

### Add API URL to .env:
```bash
# In h4h-app/.env
VITE_ANNOTATION_API_URL=http://localhost:5000
```

### Test the connection:
```bash
# In terminal, with backend running:
curl http://localhost:5000/health

# Expected response:
# {
#   "status": "healthy",
#   "fever_model": "loaded",
#   "truthfulqa_model": "loaded"
# }
```

### The React app now uses your trained models! 🎉

---

## 🚀 OPTION 2: Deploy Backend (Production)

### A. Deploy to Railway.app (FREE):

1. **Create Railway account:** https://railway.app
2. **Create new project** → Deploy from GitHub
3. **Connect repo** with your backend code
4. **Set environment variables** (none needed!)
5. **Deploy!** Railway auto-detects Python

**Update React .env:**
```bash
VITE_ANNOTATION_API_URL=https://your-app.railway.app
```

### B. Deploy to Render.com (FREE):

1. **Create Render account:** https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. **Deploy!**

**Update React .env:**
```bash
VITE_ANNOTATION_API_URL=https://your-app.onrender.com
```

### C. Deploy to Google Cloud Run (FREE tier):

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
EOF

# Deploy
gcloud run deploy h4h-api \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated
```

---

## 🧪 STEP 4: Test Integration

### Test annotation endpoint:
```bash
curl -X POST http://localhost:5000/annotate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Jakarta is the capital of Indonesia. Vaccines cause autism.",
    "show_probability": true,
    "task": "auto"
  }'
```

**Expected response:**
```json
{
  "annotated_text": "Jakarta is the capital of Indonesia [verified, p=0.92]^(1). Vaccines cause autism [contradicted, p=0.94]^(2).",
  "footnotes": [
    {
      "id": 1,
      "prediction": "SUPPORTS",
      "confidence": 0.92,
      "type": "evidential",
      "explanation": "High confidence — strong supporting evidence with minimal conflicts"
    },
    {
      "id": 2,
      "prediction": "REFUTES",
      "confidence": 0.94,
      "type": "evidential",
      "explanation": "High confidence — clear contradictory evidence"
    }
  ],
  "task_detected": "fever"
}
```

---

## 📱 STEP 5: Use in React App

### Example usage in MainHome.jsx:
```jsx
import { annotateText } from '../services/annotation';
import { generateAnswer } from '../services/gemini';

const handleSubmitQuestion = async (question) => {
  try {
    // 1. Generate answer from Gemini
    const rawAnswer = await generateAnswer(question);
    
    // 2. Annotate with your trained model
    const annotated = await annotateText(rawAnswer, true, 'auto');
    
    // 3. Display to user
    setAnnotatedAnswer(annotated.annotated_text);
    setFootnotes(annotated.footnotes);
    
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎯 ARCHITECTURE OVERVIEW

```
User Question
    ↓
React Frontend (h4h-app)
    ↓
Gemini API (generate raw answer)
    ↓
Python Backend (your trained model)
    ↓
Annotated Answer + Footnotes
    ↓
Display to User
```

---

## ⚡ PERFORMANCE NOTES

**Model loading time:**
- First request: ~2-3 seconds (model loads into memory)
- Subsequent requests: ~100-300ms

**Optimization tips:**
1. Keep backend running (don't restart)
2. Use gunicorn with workers: `gunicorn -w 4 app:app`
3. Cache predictions for identical text
4. Use async if scaling

---

## 🐛 TROUBLESHOOTING

### "Module 'sklearn' not found"
```bash
pip install scikit-learn==1.6.1
```

### "Can't unpickle model"
- Make sure scikit-learn versions match between Kaggle and backend
- Re-export models with matching version

### "CORS error"
- Backend already has CORS enabled (`flask-cors`)
- Check `VITE_ANNOTATION_API_URL` is correct

### "Model file not found"
```bash
# Check models exist:
ls -lh models/

# Should show:
# fever_pipeline.pkl
# truthfulqa_pipeline.pkl (optional)
```

---

## 📊 MODEL FILES SIZE

Expected file sizes:
- `fever_pipeline.pkl`: ~50-150 MB (TF-IDF + LogReg)
- `truthfulqa_pipeline.pkl`: ~50-100 MB

If larger, you might want to optimize:
```python
# In Kaggle, before exporting:
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000)),  # Reduce features
    ('clf', LogisticRegression())
])
```

---

## ✅ CHECKLIST

Backend Setup:
- [ ] Python 3.11+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Models downloaded from Kaggle
- [ ] Models placed in `models/` directory
- [ ] Backend running (`python app.py`)
- [ ] Health check passes (`curl localhost:5000/health`)

Frontend Integration:
- [ ] `VITE_ANNOTATION_API_URL` in `.env`
- [ ] `src/services/annotation.js` created
- [ ] Test annotation works

Deployment (Optional):
- [ ] Backend deployed to Railway/Render/GCP
- [ ] Frontend `.env` updated with production URL
- [ ] Test production endpoint

---

## 🎉 YOU'RE DONE!

Your trained model from Kaggle is now powering your beautiful React app!

**Full flow:**
1. ✅ User asks question
2. ✅ Gemini generates answer
3. ✅ Your model annotates with markers
4. ✅ User sees beautiful colored markers
5. ✅ Footnotes explain confidence levels

**This is production-ready!** 🚀

---

## 📝 NEXT STEPS

1. Test with 5-10 sample questions
2. Check all marker colors display correctly
3. Verify footnotes are accurate
4. Deploy backend to cloud
5. Start user study!

**Need help with deployment?** Let me know! 💪
