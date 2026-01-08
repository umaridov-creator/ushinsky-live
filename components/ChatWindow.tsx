import { useState, useEffect, useRef } from 'react';
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
import { Send, User, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  createdAt: any;
}

interface ChatWindowProps {
  contactName: string;
  contactId: string; // Добавили ID контакта для точности
  onBack: () => void;
}

export default function ChatWindow({ contactName, contactId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser || !contactId) return;

    // Сложный фильтр: (Я -> Тебе) ИЛИ (Ты -> Мне)
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
      })) as Message[];
      setMessages(msgs);
      
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [contactId, currentUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Аноним',
        recipientId: contactId,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Ошибка отправки:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Шапка чата */}
      <div className="p-4 border-b flex items-center bg-white sticky top-0 z-10">
        <button onClick={onBack} className="mr-4 p-1 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
          <User className="text-indigo-600" size={20} />
        </div>
        <h2 className="font-bold text-lg">{contactName}</h2>
      </div>

      {/* Список сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                msg.senderId === currentUser?.uid
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-2xl">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Написать сообщение..."
            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
