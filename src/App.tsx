import { useState } from 'react';

interface User {
  name: string;
  klass: string;
  nickname: string;
  bio: string;
  avatar: string;
  isFounder: boolean;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [klass, setKlass] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  const [tab, setTab] = useState('home');
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [stories, setStories] = useState<string[]>([]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
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
      setStories(['Привет от Основателя!']);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const userTag = currentUser.nickname + (currentUser.isFounder ? ' 👑' : '');
      setMessages([...messages, userTag + ': ' + newMessage]);
      setNewMessage('');
    }
  };

  const addStory = () => {
    const text = prompt('Текст сторис');
    if (text) {
      setStories([...stories, text]);
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
        <h1 style={{ fontSize: '5rem', color: '#00d4ff', textShadow: '0 0 20px #00d4ff' }}>
          Ushinisky Live
        </h1>
        <p style={{ fontSize: '2rem', margin: '20px 0 40px' }}>
          Школьный мессенджер Куляба
        </p>
        
        <input placeholder="Имя (Умар)" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', border: '2px solid #00d4ff', background: '#1a1a2e', color: 'white', fontSize: '1.4rem' }} />
        <input placeholder="Класс (10А)" value={klass} onChange={(e) => setKlass(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', border: '2px solid #00d4ff', background: '#1a1a2e', color: 'white', fontSize: '1.4rem' }} />
        <input placeholder="Никнейм (@umarrrr.ul)" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', border: '2px solid #00d4ff', background: '#1a1a2e', color: 'white', fontSize: '1.4rem' }} />
        <input placeholder="Био (о себе)" value={bio} onChange={(e) => setBio(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', border: '2px solid #00d4ff', background: '#1a1a2e', color: 'white', fontSize: '1.4rem' }} />
        
        <div style={{ margin: '30px 0' }}>
          <label style={{ cursor: 'pointer', padding: '15px 40px', background: '#00d4ff', borderRadius: '20px', fontSize: '1.4rem' }}>
            Загрузить аватарку
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </label>
          {avatar && avatar !== 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' && (
            <img src={avatar} alt="avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', marginTop: '20px', border: '5px solid #00d4ff' }} />
          )}
        </div>
        
        <button onClick={login} style={{ padding: '25px 100px', background: '#00d4ff', color: 'black', border: 'none', borderRadius: '30px', fontSize: '1.8rem', fontWeight: 'bold' }}>
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
      {tab === 'home' && (
        <div style={{ flex: 1 }}>
          <div style={{ padding: '20px', background: '#1a1a2e', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <h3>Сторис</h3>
            <div style={{ display: 'inline-flex' }}>
              <div style={{ textAlign: 'center', marginRight: '20px', cursor: 'pointer' }} onClick={addStory}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#333', border: '3px dashed #00d4ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}>
                  +
                </div>
                <p>Твоя</p>
              </div>
              {stories.map((story, i) => (
                <div key={i} style={{ textAlign: 'center', marginRight: '20px' }}>
                  <img src={avatar} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #00d4ff' }} />
                  <p>{story}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <h2>Лента</h2>
            <p style={{ textAlign: 'center', color: '#aaa' }}>Пока пусто</p>
          </div>
        </div>
      )}

      {tab === 'chats' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ padding: '20px', background: '#1a1a2e', textAlign: 'center' }}>Чаты</h2>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#14142a' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                padding: '15px',
                background: msg.includes(currentUser.nickname) ? '#00d4ff' : '#2a2a40',
                color: msg.includes(currentUser.nickname) ? 'black' : 'white',
                borderRadius: '20px',
                margin: '15px 0',
                maxWidth: '70%',
                alignSelf: msg.includes(currentUser.nickname) ? 'flex-end' : 'flex-start'
              }}>
                {msg}
              </div>
            ))}
          </div>
          <div style={{ padding: '20px', background: '#1a1a2e', display: 'flex' }}>
            <input placeholder="Сообщение..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, padding: '18px', borderRadius: '25px', background: '#2a2a40', border: 'none', color: 'white' }} />
            <button onClick={sendMessage} style={{ padding: '18px 35px', background: '#00d4ff', color: 'black', border: 'none', borderRadius: '25px', marginLeft: '15px' }}>
              Отправить
            </button>
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <img src={avatar} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%', border: '5px solid #00d4ff' }} />
          <h1 style={{ color: '#ffd700' }}>
            {nickname} {currentUser.isFounder ? '👑' : ''}
          </h1>
          <p>{bio || 'Био пусто'}</p>
          <button onClick={() => {
            const newNick = prompt('Новый ник', nickname);
            if (newNick) setNickname(newNick);
          }} style={{ padding: '15px', background: '#333', borderRadius: '10px', margin: '10px' }}>
            Изменить ник
          </button>
          <button onClick={() => {
            const newBio = prompt('Новое био', bio);
            if (newBio !== null) setBio(newBio);
          }} style={{ padding: '15px', background: '#333', borderRadius: '10px', margin: '10px' }}>
            Изменить био
          </button>
          <label style={{ padding: '15px', background: '#333', borderRadius: '10px', margin: '10px', cursor: 'pointer' }}>
            Изменить аватарку
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </label>
        </div>
      )}

      <div style={{ background: '#1a1a2e', display: 'flex', justifyContent: 'space-around', padding: '15px' }}>
        <button onClick={() => setTab('home')} style={{ background: 'none', border: 'none', color: tab === 'home' ? '#00d4ff' : '#aaa', fontSize: '2rem' }}>
          🏠
        </button>
        <button onClick={() => setTab('chats')} style={{ background: 'none', border: 'none', color: tab === 'chats' ? '#00d4ff' : '#aaa', fontSize: '2rem' }}>
          💬
        </button>
        <button onClick={() => setTab('profile')} style={{ background: 'none', border: 'none', color: tab === 'profile' ? '#00d4ff' : '#aaa', fontSize: '2rem' }}>
          👤
        </button>
      </div>
    </div>
  );
}

export default App;