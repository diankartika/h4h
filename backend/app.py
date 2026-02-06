# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
from nltk.tokenize import sent_tokenize
import nltk

# Download NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

app = Flask(__name__)
CORS(app)  # Enable CORS for React app

# Load trained models
with open('models/fever_pipeline.pkl', 'rb') as f:
    fever_pipeline = pickle.load(f)

try:
    with open('models/truthfulqa_pipeline.pkl', 'rb') as f:
        truthful_pipeline = pickle.load(f)
    TRUTHFULQA_AVAILABLE = True
except FileNotFoundError:
    truthful_pipeline = None
    TRUTHFULQA_AVAILABLE = False
    print("⚠️  TruthfulQA model not found, using FEVER only")


class FootnoteManager:
    """Manages footnotes for uncertainty annotations."""
    
    def __init__(self):
        self.footnotes = []
        self.counter = 0
    
    def reset(self):
        self.footnotes = []
        self.counter = 0
    
    def add_footnote(self, prediction, confidence, uncertainty_type, explanation):
        self.counter += 1
        footnote = {
            'id': self.counter,
            'prediction': prediction,
            'confidence': float(confidence),
            'type': uncertainty_type,
            'explanation': explanation
        }
        self.footnotes.append(footnote)
        return self.counter
    
    def format_footnotes(self):
        return self.footnotes


def detect_task(text):
    """Auto-detect whether text is FEVER-style or TruthfulQA-style."""
    question_starters = ('what', 'why', 'how', 'when', 'where', 'who', 'is', 'are', 
                        'can', 'do', 'does', 'will', 'should', 'could', 'would')
    
    text_lower = text.lower()
    
    if '?' in text or text_lower.startswith(question_starters):
        return "truthfulqa"
    else:
        return "fever"


def insert_marker_before_punctuation(sentence, marker, footnote_id):
    """Insert marker and footnote BEFORE terminal punctuation."""
    terminal_punct = r'([.!?…]+)$'
    
    match = re.search(terminal_punct, sentence)
    
    if match:
        punct = match.group(1)
        base = sentence[:match.start()].rstrip()
        return f"{base} {marker}^({footnote_id}){punct}"
    else:
        return f"{sentence} {marker}^({footnote_id})"


def get_uncertainty_marker(probabilities, predicted_class, task="fever", show_probability=True):
    """Get uncertainty marker based on confidence, prediction, and task."""
    max_prob = probabilities.max()
    
    # Task-specific marker selection
    if task == "fever":
        if predicted_class == "SUPPORTS":
            if max_prob > 0.9:
                marker = "verified"
            elif max_prob > 0.8:
                marker = "factual"
            elif max_prob > 0.7:
                marker = "likely"
            else:
                marker = "plausible"
        
        elif predicted_class == "REFUTES":
            if max_prob > 0.9:
                marker = "contradicted"
            elif max_prob > 0.8:
                marker = "questionable"
            elif max_prob > 0.7:
                marker = "uncertain"
            else:
                marker = "speculative"
        
        else:  # NOT ENOUGH INFO
            if max_prob > 0.85:
                marker = "insufficient-info"
            elif max_prob > 0.7:
                marker = "uncertain"
            else:
                marker = "speculative"
    
    else:  # truthfulqa
        if predicted_class == "Truthful":
            if max_prob > 0.9:
                marker = "verified"
            elif max_prob > 0.8:
                marker = "factual"
            elif max_prob > 0.7:
                marker = "likely"
            else:
                marker = "plausible"
        
        else:  # Untruthful
            if max_prob > 0.9:
                marker = "contradicted"
            elif max_prob > 0.8:
                marker = "unsupported"
            elif max_prob > 0.7:
                marker = "questionable"
            else:
                marker = "speculative"
    
    # Format with or without probability
    if show_probability:
        return f"[{marker}, p={max_prob:.2f}]"
    else:
        return f"[{marker}]"


def generate_explanation(prediction, confidence, task):
    """Generate human-readable explanation for footnote."""
    
    if task == "fever":
        if prediction == "SUPPORTS":
            if confidence > 0.8:
                return "High confidence — strong supporting evidence with minimal conflicts"
            else:
                return "Moderate confidence — some supporting evidence detected"
        
        elif prediction == "REFUTES":
            if confidence > 0.8:
                return "High confidence — clear contradictory evidence"
            else:
                return "Moderate confidence — some contradictory evidence detected"
        
        else:  # NOT ENOUGH INFO
            return "Insufficient evidence — cannot verify claim reliably"
    
    else:  # truthfulqa
        if prediction == "Truthful":
            if confidence > 0.8:
                return "High confidence — factually accurate, well-established"
            else:
                return "Moderate confidence — likely truthful but with some uncertainty"
        
        else:  # Untruthful
            if confidence > 0.8:
                return "High confidence — known misconception or misinformation"
            else:
                return "Moderate confidence — likely untruthful but requires verification"


def annotate_answer(raw_answer, show_probability=True, task="auto"):
    """
    Annotate LLM answer with uncertainty markers + footnotes.
    
    Args:
        raw_answer: Raw text from LLM
        show_probability: Show p-values
        task: "fever", "truthfulqa", or "auto" (detect)
    
    Returns:
        Dict with annotated_text and footnotes
    """
    footnote_mgr = FootnoteManager()
    
    # Auto-detect task if needed
    if task == "auto":
        task = detect_task(raw_answer)
    
    # Select appropriate pipeline
    if task == "truthfulqa" and truthful_pipeline is not None:
        pipeline = truthful_pipeline
    else:
        pipeline = fever_pipeline
        task = "fever"
    
    # Tokenize into sentences
    sentences = sent_tokenize(raw_answer)
    annotated_sentences = []
    
    for sentence in sentences:
        try:
            # Skip empty sentences
            if not sentence.strip():
                continue
            
            # Get prediction
            pred = pipeline.predict([sentence])[0]
            proba = pipeline.predict_proba([sentence])[0]
            confidence = proba.max()
            
            # Get uncertainty marker
            marker = get_uncertainty_marker(proba, pred, task, show_probability)
            
            # Generate explanation
            uncertainty_type = "evidential" if task == "fever" else "epistemic"
            explanation = generate_explanation(pred, confidence, task)
            
            # Add footnote
            fn_id = footnote_mgr.add_footnote(pred, confidence, uncertainty_type, explanation)
            
            # Insert marker BEFORE punctuation
            annotated = insert_marker_before_punctuation(sentence, marker, fn_id)
            annotated_sentences.append(annotated)
            
        except Exception as e:
            print(f"Warning: Could not classify sentence: {e}")
            annotated_sentences.append(f"{sentence} [?]^(0)")
    
    # Combine sentences
    annotated_text = " ".join(annotated_sentences)
    
    return {
        'annotated_text': annotated_text,
        'footnotes': footnote_mgr.format_footnotes(),
        'task_detected': task
    }


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'fever_model': 'loaded',
        'truthfulqa_model': 'loaded' if TRUTHFULQA_AVAILABLE else 'not available'
    })


@app.route('/annotate', methods=['POST'])
def annotate():
    """
    Annotate text with uncertainty markers.
    
    Request body:
    {
        "text": "string",
        "show_probability": true/false,
        "task": "auto" | "fever" | "truthfulqa"
    }
    
    Response:
    {
        "annotated_text": "string with markers",
        "footnotes": [...],
        "task_detected": "fever" | "truthfulqa"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing "text" field'}), 400
        
        text = data['text']
        show_probability = data.get('show_probability', True)
        task = data.get('task', 'auto')
        
        # Annotate
        result = annotate_answer(text, show_probability, task)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("="*60)
    print("🚀 H4H Annotation API Server")
    print("="*60)
    print(f"FEVER model: ✓ Loaded")
    print(f"TruthfulQA model: {'✓ Loaded' if TRUTHFULQA_AVAILABLE else '✗ Not available'}")
    print("="*60)
    
    app.run(host='0.0.0.0', port=5001, debug=True)
