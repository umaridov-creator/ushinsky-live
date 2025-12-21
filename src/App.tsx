import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXU1vrMR4fovnV04v91kEyklD0fM4JeFw",
  authDomain: "ushinskiy-live.firebaseapp.com",
  projectId: "ushinskiy-live",
  storageBucket: "ushinskiy-live.firebasestorage.app",
  messagingSenderId: "690668800256",
  appId: "1:690668800256:web:e52009016a9a925adbcbe5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState('');
  const [klass, setKlass] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

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
      const isFounder = name.toLowerCase() === 'умар' && klass === '10А';
      setCurrentUser({
        name,
        klass,
        nickname,
        bio,
        avatar,
        isFounder
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() && currentUser) {
      const userTag = currentUser.nickname + (currentUser.isFounder ? ' 👑' : '');
      await addDoc(collection(db, 'messages'), {
        text: userTag + ': ' + newMessage,
        timestamp: new Date()
      });
      setNewMessage('');
    }
  };

  if (!currentUser) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0f0f1a, #1a0033)',
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
      flexDirection: 'column',
      fontFamily: 'Arial'
    }}>
      <header style={{ background: '#1a1a2e', padding: '20px', textAlign: 'center' }}>
        <img src={avatar} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #00d4ff' }} />
        <h1 style={{ color: '#ffd700' }}>
          {nickname} {currentUser.isFounder ? '👑' : ''}
        </h1>
        <p>{bio || 'Био пусто'}</p>
        <h2 style={{ color: '#00d4ff' }}>Чат «Вся школа»</h2>
      </header>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#14142a'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '15px',
            background: msg.text.includes(currentUser.nickname) ? '#00d4ff' : '#2a2a40',
            color: msg.text.includes(currentUser.nickname) ? 'black' : 'white',
            borderRadius: '20px',
            margin: '15px 0',
            maxWidth: '70%',
            alignSelf: msg.text.includes(currentUser.nickname) ? 'flex-end' : 'flex-start'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div style={{ padding: '20px', background: '#1a1a2e', display: 'flex' }}>
        <input placeholder="Напиши сообщение..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, padding: '18px', borderRadius: '25px', background: '#2a2a40', border: 'none', color: 'white' }} />
        <button onClick={sendMessage} style={{ padding: '18px 35px', background: '#00d4ff', color: 'black', border: 'none', borderRadius: '25px', marginLeft: '15px' }}>
          Отправить
        </button>
      </div>
    </div>
  );
}

export default App;