import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brmpknatwqbkpjgyhmxl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybXBrbmF0d3Fia3BqZ3lobXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNjQzNzAsImV4cCI6MjA4MjY0MDM3MH0.X_QZ4LMxIP1D7XqC_AoEjyKHFiCAJUT8QZrryd45hb0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: number;
  text: string;
  sender: string;
  created_at: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Загрузка профиля из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ushiniskyUser');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      setAvatar(user.avatar || avatar);
    }
  }, []);

  // Загрузка сообщений из Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // Реалтайм подписка
    supabase.channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();
  }, []);

  const register = () => {
    if (nickname && password) {
      const isFounder = nickname.toLowerCase() === 'умар-99';
      const user = {
        nickname,
        password,
        avatar,
        isFounder
      };
      setCurrentUser(user);
      localStorage.setItem('ushiniskyUser', JSON.stringify(user));
    }
  };

  const login = () => {
    if (nickname && password) {
      const isFounder = nickname.toLowerCase() === 'умар-99';
      const user = {
        nickname,
        password,
        avatar,
        isFounder
      };
      setCurrentUser(user);
      localStorage.setItem('ushiniskyUser', JSON.stringify(user));
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() && currentUser) {
      const userTag = currentUser.nickname + (currentUser.isFounder ? ' 👑' : '');
      await supabase.from('messages').insert({ text: userTag + ': ' + newMessage, sender: currentUser.nickname });
      setNewMessage('');
    }
  };

  if (!currentUser) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f5f5dc, #90ee90)',
        color: 'black',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial'
      }}>
        <h1 style={{ fontSize: '5rem', color: '#006400' }}>Ushinisky Live</h1>
        <input placeholder="Никнейм (@umar-99)" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', border: '2px solid #006400', background: '#f5f5dc', color: 'black' }} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '18px', width: '380px', margin: '12px', borderRadius: '20px', border: '2px solid #006400', background: '#f5f5dc', color: 'black' }} />
        <button onClick={login} style={{ padding: '25px 100px', background: '#90ee90', color: 'black', border: 'none', borderRadius: '30px' }}>
          Войти
        </button>
        <button onClick={register} style={{ padding: '25px 100px', background: '#90ee90', color: 'black', border: 'none', borderRadius: '30px', marginTop: '20px' }}>
          Регистрация
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f5f5dc',
      color: 'black',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial'
    }}>
      <header style={{ background: '#90ee90', padding: '20px', textAlign: 'center' }}>
        <img src={avatar} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #006400' }} />
        <h1 style={{ color: '#006400' }}>
          {nickname} {currentUser.isFounder ? ' 👑' : ''}
        </h1>
        <h2>Общий чат (онлайн)</h2>
      </header>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '15px',
            background: msg.sender === currentUser.nickname ? '#006400' : '#90ee90',
            color: msg.sender === currentUser.nickname ? 'white' : 'black',
            borderRadius: '20px',
            margin: '15px 0',
            maxWidth: '70%',
            alignSelf: msg.sender === currentUser.nickname ? 'flex-end' : 'flex-start'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div style={{ padding: '20px', background: '#90ee90', display: 'flex' }}>
        <input placeholder="Сообщение..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, padding: '18px', borderRadius: '25px', background: '#f5f5dc', border: 'none', color: 'black' }} />
        <button onClick={sendMessage} style={{ padding: '18px 35px', background: '#006400', color: 'white', border: 'none', borderRadius: '25px', marginLeft: '15px' }}>
          Отправить
        </button>
      </div>
    </div>
  );
}

export default App;