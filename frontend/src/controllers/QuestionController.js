// src/controllers/QuestionController.js
import { generateAnswer } from '../services/gemini';
import { annotateText } from '../services/annotation';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const askH4H = async (questionText) => {
  try {
    console.log('🎯 askH4H started for:', questionText);
    
    // Check auth
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    console.log('✅ User authenticated:', auth.currentUser.uid);

    // 1. Generate Raw Answer from Gemini
    console.log('📡 Calling Gemini...');
    const rawAnswer = await generateAnswer(questionText);
    console.log('✅ Gemini response:', rawAnswer.substring(0, 100) + '...');

    // 2. Get Annotations from your Flask Backend
    console.log('📡 Calling annotation API...');
    const annotationResult = await annotateText(rawAnswer);
    console.log('✅ Annotation result:', annotationResult);

    // 3. Save to Firestore (History)
    const questionRef = collection(db, "questions");
    const docData = {
      userId: auth.currentUser.uid,
      questionText,
      rawAnswer,
      annotatedText: annotationResult.annotated_text,
      footnotes: annotationResult.footnotes,
      taskDetected: annotationResult.task_detected,
      timestamp: serverTimestamp(),
    };

    console.log('💾 Saving to Firestore...');
    const docRef = await addDoc(questionRef, docData);
    console.log('✅ Saved with ID:', docRef.id);

    // Return the actual data for display (NOT docData which has serverTimestamp)
    return {
      id: docRef.id,
      annotatedText: annotationResult.annotated_text,  // ← FIX: Return actual text
      footnotes: annotationResult.footnotes,
      taskDetected: annotationResult.task_detected
    };
  } catch (error) {
    console.error("❌ Workflow failed:", error);
    throw error;
  }
};