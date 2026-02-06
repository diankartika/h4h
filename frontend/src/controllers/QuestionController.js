// src/controllers/QuestionController.js
import { generateAnswer } from '../services/gemini';
import { annotateText } from '../services/annotation';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const askH4H = async (questionText) => {
  try {
    // 1. Generate Raw Answer from Gemini
    const rawAnswer = await generateAnswer(questionText);

    // 2. Get Annotations from your Flask Backend
    const annotationResult = await annotateText(rawAnswer);

    // 3. Save to Firestore (History)
    const questionRef = collection(db, "questions");
    const docData = {
      userId: auth.currentUser?.uid,
      questionText,
      rawAnswer,
      annotatedText: annotationResult.annotated_text,
      footnotes: annotationResult.footnotes,
      taskDetected: annotationResult.task_detected,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(questionRef, docData);

    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error("Workflow failed:", error);
    throw error;
  }
};