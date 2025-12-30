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
  const [name, setName] = useState('');
  const [klass, setKlass] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Загрузка профиля из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ushiniskyUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
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
    const subscription = supabase.channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const register = async () => {
    if (nickname && password) {
      const isFounder = nickname.toLowerCase() === 'умар-99';
      const user = {
        nickname,
        password,
        bio,
        avatar,
        isFounder
      };
      setCurrentUser(user);
      localStorage.setItem('ushiniskyUser', JSON.stringify(user));
    }
  };

  const login = () => {
    // Пока локально, потом добавим проверку по базе
    if (nickname && password) {
      const isFounder = nickname.toLowerCase() === 'умар-99';
      const user = {
        nickname,
        password,
        bio,
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
      fontFamily: 'Arial'
    }}>
      <div style={{ width: '350px', background: '#90ee90', padding: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={avatar} alt="avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '5px solid #006400' }} />
          <h2>{nickname} {currentUser.isFounder ? '👑' : ''}</h2>
        </div>
        <h3>Чаты</h3>
        <p>Группы и личка скоро</p>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: '#90ee90', padding: '20px', textAlign: 'center' }}>
          <h2>Общий чат (тест онлайн)</h2>
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
    </div>
  );
}

export default App;