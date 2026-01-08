import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import { db, auth } from '../firebase'; 
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  or,
  and
} from 'firebase/firestore';

interface ChatWindowProps {
  contactName: string;
  contactId: string; // Добавили ID контакта
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contactName, contactId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  // 1. ПОЛУЧАЕМ СООБЩЕНИЯ С ФИЛЬТРОМ ПРИВАТНОСТИ
  useEffect(() => {
    if (!currentUser || !contactId) return;

    // Фильтр: (Я пишу тебе) ИЛИ (Ты пишешь мне)
    const q = query(
      collection(db, "messages"),
      or(
        and(
          where("senderId", "==", currentUser.uid),
          where("recipientId", "==", contactId)
        ),
        and(
          where("senderId", "==", contactId),
          where("recipientId", "==", currentUser.uid)
        )
      ),
      orderBy("createdAt", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [contactId, currentUser]);

  // 2. ОТПРАВКА СООБЩЕНИЯ
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Пользователь', 
        recipientId: contactId, // Теперь отправляем ID получателя
        recipientName: contactName,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    }
  };

  return (
    <div className="chat-window-overlay">
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-left">
            <button onClick={onBack} className="back-btn"><ArrowLeft size={24} /></button>
            <div className="chat-avatar-small">{contactName[0]}</div>
            <div className="chat-user-info">
              <span className="chat-user-name">{contactName}</span>
              <span className="chat-user-status">в сети</span>
            </div>
          </div>
          <MoreVertical size={20} color="#666" />
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-bubble ${msg.senderId === currentUser?.uid ? 'sent' : 'received'}`}
            >
              <p>{msg.text}</p>
              <span className="message-time">
                {msg.createdAt?.toDate() ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
              </span>
            </div>
          ))}
          <div ref={scrollRef} /> 
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Сообщение..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn" onClick={handleSendMessage}>
            <Send size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
