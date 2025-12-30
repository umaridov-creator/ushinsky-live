import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [klass, setKlass] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  const [selectedUser, setSelectedUser] = useState(null); // for private chat, null = general
  const [messages, setMessages] = useState({ general: [] });
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const login = () => {
    if (name && klass && nickname) {
      const user = {
        id: 'current',
        name,
        klass,
        nickname,
        bio,
        avatar,
        isFounder: name.toLowerCase() === 'умар' && klass === '10А'
      };
      setCurrentUser(user);
      setUsers([user]); // пока локально, потом добавим других
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const chatId = selectedUser ? selectedUser.id : 'general';
      const msg = {
        text: newMessage,
        sender: currentUser.nickname,
        avatar: currentUser.avatar
      };
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), msg]
      }));
      setNewMessage('');
    }
  };

  if (!currentUser) {
    return (
      <div style={{
        background: '#0f0f1a',
        color: 'white',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial'
      }}>
        <h1 style={{ fontSize: '5rem', color: '#00d4ff' }}>Ushinisky Live</h1>
        <input placeholder="Имя (Умар)" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', background: '#1a1a2e', border: 'none', color: 'white' }} />
        <input placeholder="Класс (10А)" value={klass} onChange={(e) => setKlass(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', background: '#1a1a2e', border: 'none', color: 'white' }} />
        <input placeholder="Никнейм (@umarrrr.ul)" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', background: '#1a1a2e', border: 'none', color: 'white' }} />
        <input placeholder="Био (о себе)" value={bio} onChange={(e) => setBio(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', background: '#1a1a2e', border: 'none', color: 'white' }} />
        
        <div style={{ margin: '30px 0' }}>
          <label style={{ cursor: 'pointer', padding: '15px 40px', background: '#00d4ff', borderRadius: '20px' }}>
            Загрузить аватарку
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </label>
          {avatar && avatar !== 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' && (
            <img src={avatar} alt="avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', marginTop: '20px', border: '5px solid #00d4ff' }} />
          )}
        </div>
        
        <button onClick={login} style={{ padding: '25px 100px', background: '#00d4ff', color: 'black', border: 'none', borderRadius: '30px' }}>
          Войти как Основатель
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0f0f1a',
      color: 'white',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      fontFamily: 'Arial'
    }}>
      <div style={{ width: '350px', background: '#1a1a2e', padding: '20px', borderRight: '1px solid #333' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={avatar} alt="avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '5px solid #00d4ff' }} />
          <h2 style={{ color: '#ffd700' }}>
            {nickname} {currentUser.isFounder ? '👑' : ''}
          </h2>
          <p>{bio || 'Био пусто'}</p>
        </div>
        
        <div style={{ cursor: 'pointer', padding: '15px', background: selectedUser === null ? '#00d4ff' : '#2a2a40', borderRadius: '15px', marginBottom: '10px', textAlign: 'center' }} onClick={() => setSelectedUser(null)}>
          Чат «Вся школа»
        </div>
        
        {/* Здесь будут другие пользователи — пока только ты */}
        <p style={{ textAlign: 'center', color: '#aaa' }}>Скоро здесь будут все из школы</p>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: '#1a1a2e', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#00d4ff' }}>
            {selectedUser ? 'Личка с ' + selectedUser.nickname : 'Чат «Вся школа»'}
          </h2>
        </header>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#14142a' }}>
          {(messages[selectedUser ? selectedUser.id : 'general'] || []).map((msg, i) => (
            <div key={i} style={{
              padding: '15px',
              background: msg.sender === currentUser.nickname ? '#00d4ff' : '#2a2a40',
              color: msg.sender === currentUser.nickname ? 'black' : 'white',
              borderRadius: '20px',
              margin: '15px 0',
              maxWidth: '70%',
              alignSelf: msg.sender === currentUser.nickname ? 'flex-end' : 'flex-start'
            }}>
              <strong>{msg.sender}</strong>: {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: '20px', background: '#1a1a2e', display: 'flex' }}>
          <input placeholder="Сообщение..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, padding: '18px', borderRadius: '25px', background: '#2a2a40', border: 'none', color: 'white' }} />
          <button onClick={sendMessage} style={{ padding: '18px 35px', background: '#00d4ff', color: 'black', border: 'none', borderRadius: '25px', marginLeft: '15px' }}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;