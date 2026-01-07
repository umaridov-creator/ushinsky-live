import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, User, Search, Settings, Moon, LogOut, X } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; // Добавили инструменты Firebase
import { db } from './firebase'; // Подключили твою базу
import './App.css';
import StoryBar from './components/StoryBar';
import GeminiBot from './components/GeminiBot';
import Login from './pages/Login';
import ChatWindow from './components/ChatWindow';
import CreatePostModal from './components/CreatePostModal';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // СОСТОЯНИЯ ДЛЯ ДАННЫХ ИЗ FIREBASE
  const [posts, setPosts] = useState<any[]>([]); // Посты теперь будут тут
  const [realUsers, setRealUsers] = useState<any[]>([]); // Тут будут реальные ученики
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // 1. ПОЛУЧАЕМ РЕАЛЬНЫХ ПОЛЬЗОВАТЕЛЕЙ ИЗ БАЗЫ
  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRealUsers(usersList);
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  // 2. ПОЛУЧАЕМ ПОСТЫ (ЗАГЛУШКА, ПОКА НЕ ПОДКЛЮЧИЛИ FIREBASE К ПОСТАМ)
  useEffect(() => {
    // В будущем тут будет код для загрузки постов из Firebase
    setPosts([
      { id: 1, author: 'Админ', text: 'База данных подключена! 🔥', likes: 15, image: '' },
    ]);
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    setIsLoggedIn(true);
  };

  const handleCreatePost = ({ text, image }: { text: string, image?: string }) => {
    const newPost = {
      id: Date.now(),
      author: user,
      text: text,
      likes: 0,
      image: image || ''
    };
    setPosts([newPost, ...posts]);
  };

  // Фильтр по реальным пользователям из базы
  const filteredStudents = realUsers.filter(s => 
    (s.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`ul-app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Шапка */}
      <header className="ul-header">
        {!isSearchOpen ? (
          <>
            <div className="logo">UL</div>
            <div className="app-title">Ushinskiy Live</div>
            <div className="header-icons" onClick={() => setIsSearchOpen(true)}>
              <Search size={22} style={{ cursor: 'pointer' }} />
            </div>
          </>
        ) : (
          <div className="search-bar-active">
            <input 
              autoFocus
              placeholder="Поиск реальных учеников..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <X size={20} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} style={{cursor: 'pointer'}} />
          </div>
        )}
      </header>

      <main className="ul-main">
        {/* Вкладка: ГЛАВНАЯ */}
        {activeTab === 'feed' && (
          <div className="page feed-page">
            <StoryBar />
            <button className="btn-suggest" onClick={() => setIsCreatePostModalOpen(true)}>
              Предложить новость
            </button>
            {posts.map(post => (
              <div key={post.id} className="feed-card">
                <div className="feed-header">
                  <div className="admin-avatar">{post.author[0]}</div>
                  <div>
                    <p className="admin-name">{post.author}</p>
                    <p className="feed-time">Только что</p>
                  </div>
                </div>
                <div className="feed-content">
                  <p>{post.text}</p>
                  {post.image && <img src={post.image} alt="post" className="post-img" />}
                </div>
                <div className="feed-footer">
                  <button className="like-btn">❤️ {post.likes}</button>
                  <button className="comment-btn">💬 Комментировать</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Вкладка: ЧАТЫ (ТЕПЕРЬ ТУТ РЕАЛЬНЫЕ ЛЮДИ) */}
        {activeTab === 'chat' && (
          <div className="page chat-list">
            <h2 style={{marginBottom: '15px'}}>Сообщения</h2>
            {selectedChat && (
              <ChatWindow contactName={selectedChat} onBack={() => setSelectedChat(null)} />
            )}
            
            {filteredStudents.length > 0 ? filteredStudents.map((s) => (
              <div key={s.id} className="chat-item" onClick={() => setSelectedChat(s.username)}>
                <div className="chat-avatar">{s.username ? s.username[0].toUpperCase() : '?'}</div>
                <div className="chat-info">
                  <div className="chat-name">{s.username}</div>
                  <div className="chat-last-msg">В сети</div>
                </div>
              </div>
            )) : <p style={{textAlign: 'center', color: '#666'}}>Никто еще не зарегистрировался...</p>}
          </div>
        )}

        {/* Вкладка: ПРОФИЛЬ */}
        {activeTab === 'profile' && (
          <div className="page profile-page">
            <div className="profile-header">
              <div className="admin-avatar-large">{user[0]?.toUpperCase()}</div>
              <h2>{user}</h2>
              <span className="badge-founder">Основатель</span>
            </div>
            <div className="profile-stats">
              <div className="stat-card">
                <span className="stat-num">{posts.filter(p => p.author === user).length}</span>
                <span className="stat-label">Постов</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">🔥 10</span>
                <span className="stat-label">Очков</span>
              </div>
            </div>
            <div className="profile-menu">
              <button className="menu-item"><Settings size={18} /> <span>Настройки</span></button>
              <button className="menu-item" onClick={() => setDarkMode(!darkMode)}>
                <Moon size={18} /> <span>{darkMode ? 'Светлая тема' : 'Тёмная тема'}</span>
              </button>
              <button onClick={() => setIsLoggedIn(false)} className="menu-item logout"><LogOut size={18} /> <span>Выйти</span></button>
            </div>
          </div>
        )}
      </main>

      <GeminiBot />

      {isCreatePostModalOpen && (
        <CreatePostModal 
          onClose={() => setIsCreatePostModalOpen(false)} 
          onCreatePost={handleCreatePost} 
        />
      )}

      {/* Навигация */}
      <nav className="ul-navbar">
        <button onClick={() => setActiveTab('feed')} className={activeTab === 'feed' ? 'nav-item active' : 'nav-item'}><Home /><span>Главная</span></button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'nav-item active' : 'nav-item'}><MessageCircle /><span>Чаты</span></button>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'nav-item active' : 'nav-item'}><User /><span>Профиль</span></button>
      </nav>
    </div>
  );
}

export default App;