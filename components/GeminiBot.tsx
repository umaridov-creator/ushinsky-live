import React, { useState } from 'react';
import { Send, X, Bot } from 'lucide-react';

const GeminiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Салам, Умар! Я на связи. Что проверим?', isAi: true }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.toLowerCase();
    const newMsgs = [...messages, { text: input, isAi: false }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      let botResponse = "Я пока только учусь, но скоро буду знать всё о нашей школе!";
      
      if (userMsg.includes("привет")) botResponse = "Салам, Основатель! Готов кодить дальше?";
      if (userMsg.includes("кто ты")) botResponse = "Я — Gemini, твой личный ИИ-помощник в Ushinskiy Live.";
      if (userMsg.includes("проект")) botResponse = "Наш проект будет лучшим в столице, я уверен!";
      if (userMsg.includes("сторис")) botResponse = "Я поправил сторис! Проверь, стали ли они круглыми?";

      setMessages([...newMsgs, { text: botResponse, isAi: true }]);
    }, 800);
  };

  return (
    <>
      {/* Если чат закрыт, показываем только кнопку */}
      {!isOpen && (
        <div className="gemini-bot-btn" onClick={() => setIsOpen(true)}>
          <Bot size={35} color="white" />
        </div>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className="gemini-chat-window">
          <div style={{background: '#007bff', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', borderRadius: '20px 20px 0 0'}}>
            <span>Gemini AI</span>
            <X onClick={() => setIsOpen(false)} style={{cursor: 'pointer'}} />
          </div>
          <div style={{flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
            {messages.map((m, i) => (
              <div key={i} className={m.isAi ? "msg-ai" : "msg-user"}>{m.text}</div>
            ))}
          </div>
          <div style={{padding: '10px', display: 'flex', gap: '5px', borderTop: '1px solid #ddd'}}>
            <input 
              style={{flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid #ddd'}}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Пиши сюда..."
            />
            <button onClick={handleSend} style={{background: '#007bff', color: 'white', border: 'none', borderRadius: '10px', padding: '0 10px'}}><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiBot;