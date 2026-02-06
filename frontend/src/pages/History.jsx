import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(
        collection(db, 'questions'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      setHistory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <header className="p-6 bg-white border-b flex items-center gap-4">
        <button onClick={() => navigate('/home')}><ChevronLeft /></button>
        <h1 className="text-xl font-bold">Past Questions</h1>
      </header>
      
      <div className="p-4 space-y-3">
        {history.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-3 items-start">
              <MessageCircle className="text-purple-500 mt-1" size={18} />
              <div>
                <p className="font-semibold text-gray-900 line-clamp-2">{item.questionText}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.timestamp?.toDate().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;