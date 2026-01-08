import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, User, Search, Settings, Moon, LogOut, X } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db, auth } from './firebase'; 
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
  
  const [posts, setPosts] = useState<any[]>([]); 
  const [realUsers, setRealUsers] = useState<any[]>([]); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{id: string, name: string} | null>(null);

  // 1. ПОЛУЧАЕМ РЕАЛЬНЫХ ПОЛЬЗОВАТЕЛЕЙ
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

  // 2. ПОЛУЧАЕМ ПОСТЫ ИЗ FIREBASE
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsList);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    setIsLoggedIn(true);
  };

  const handleCreatePost = async ({ text, image }: { text: string, image?: string }) => {
    try {
      await addDoc(collection(db, "posts"), {
        author: user,
        text: text,
        likes: 0,
        image: image || '',
        createdAt: serverTimestamp()
      });
      setIsCreatePostModalOpen(false);
    } catch (e) {
      console.error("Ошибка при создании поста: ", e);
    }
  };

  const filteredStudents = realUsers.filter(s => 
    (s.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`ul-app ${darkMode ? 'dark-mode' : ''}`}>
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
              placeholder="Поиск учеников..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <X size={20} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} style={{cursor: 'pointer'}} />
          </div>
        )}
      </header>

      <main className="ul-main">
        {activeTab === 'feed' && (
          <div className="page feed-page">
            <StoryBar />
            <button className="btn-suggest" onClick={() => setIsCreatePostModalOpen(true)}>
              Предложить новость
            </button>
            {posts.map(post => (
              <div key={post.id} className="feed-card">
                <div className="feed-header">
                  <div className="admin-avatar">{post.author ? post.author[0].toUpperCase() : 'U'}</div>
                  <div>
                    <p className="admin-name">{post.author}</p>
                    <p className="feed-time">Пост в ленте</p>
                  </div>
                </div>
                <div className="feed-content">
                  <p>{post.text}</p>
                  {post.image && <img src={post.image} alt="post" className="post-img" />}
                </div>
                <div className="feed-footer">
                  <button className="like-btn">❤️ {post.likes || 0}</button>
                  <button className="comment-btn">💬 Комментировать</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="page chat-list">
            {selectedChat ? (
              <ChatWindow 
                contactName={selectedChat.name} 
                contactId={selectedChat.id} 
                onBack={() => setSelectedChat(null)} 
              />
            ) : (
              <>
                <h2 style={{marginBottom: '15px', padding: '0 10px'}}>Сообщения</h2>
                {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                  <div key={s.id} className="chat-item" onClick={() => setSelectedChat({id: s.id, name: s.username})}>
                    <div className="chat-avatar">{s.username ? s.username[0].toUpperCase() : '?'}</div>
                    <div className="chat-info">
                      <div className="chat-name">{s.username}</div>
                      <div className="chat-last-msg">Нажми, чтобы написать</div>
                    </div>
                  </div>
                )) : <p style={{textAlign: 'center', color: '#666'}}>Загрузка пользователей...</p>}
              </>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="page profile-page">
            <div className="profile-header">
              <div className="admin-avatar-large">{user[0]?.toUpperCase()}</div>
              <h2>{user}</h2>
              <span className="badge-founder">Ученик</span>
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

      <nav className="ul-navbar">
        <button onClick={() => setActiveTab('feed')} className={activeTab === 'feed' ? 'nav-item active' : 'nav-item'}><Home /><span>Главная</span></button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'nav-item active' : 'nav-item'}><MessageCircle /><span>Чаты</span></button>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'nav-item active' : 'nav-item'}><User /><span>Профиль</span></button>
      </nav>
    </div>
  );
}

export default App;
