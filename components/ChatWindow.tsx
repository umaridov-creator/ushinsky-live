import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import { db, auth } from '../firebase'; // Наша база и вход
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

interface ChatWindowProps {
  contactName: string;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contactName, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. ПОЛУЧАЕМ СООБЩЕНИЯ В РЕАЛЬНОМ ВРЕМЕНИ
  useEffect(() => {
    // Создаем запрос к папке "messages", сортируем по времени
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      
      // Прокрутка вниз при новом сообщении
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, []);

  // 2. ОТПРАВКА СООБЩЕНИЯ В FIREBASE
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: auth.currentUser?.uid, // ID того, кто пишет
        senderName: auth.currentUser?.displayName || 'Аноним', 
        recipientName: contactName, // Кому пишем
        createdAt: serverTimestamp() // Точное время сервера
      });
      setNewMessage('');
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    }
  };

  return (
    <div className="chat-window-overlay">
      <div className="chat-window">
        {/* Шапка чата */}
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

        {/* Поле с сообщениями */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-bubble ${msg.senderId === auth.currentUser?.uid ? 'sent' : 'received'}`}
            >
              <p>{msg.text}</p>
              <span className="message-time">
                {msg.createdAt?.toDate() ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
              </span>
            </div>
          ))}
          <div ref={scrollRef} /> 
        </div>

        {/* Ввод сообщения */}
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