import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, User, Search, Settings, Moon, LogOut, X, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'; 
import { db } from './firebase'; 
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

  // 1. ПОЛУЧАЕМ ПОЛЬЗОВАТЕЛЕЙ
  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        setRealUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  // 2. ПОЛУЧАЕМ ПОСТЫ ИЗ FIREBASE
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async ({ text, image }: { text: string, image?: string }) => {
    try {
      await addDoc(collection(db, "posts"), {
        author: user,
        text: text,
        likes: 0,
        image: image || '',
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Ошибка:", e);
    }
  };

  const deletePost = async (postId: string) => {
    if (window.confirm("Удалить этот пост?")) {
      await deleteDoc(doc(db, "posts", postId));
    }
  };

  if (!isLoggedIn) return <Login onLogin={(name) => { setUser(name); setIsLoggedIn(true); }} />;

  return (
    <div className={`ul-app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="ul-header">
        {!isSearchOpen ? (
          <>
            <div className="logo">UL</div>
            <div className="app-title">Ushinskiy Live</div>
            <Search size={22} onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer' }} />
          </>
        ) : (
          <div className="search-bar-active">
            <input autoFocus placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <X size={20} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} />
          </div>
        )}
      </header>

      <main className="ul-main">
        {activeTab === 'feed' && (
          <div className="page feed-page">
            <StoryBar />
            <button className="btn-suggest" onClick={() => setIsCreatePostModalOpen(true)}>Предложить новость</button>
            {posts.map(post => (
              <div key={post.id} className="feed-card">
                <div className="feed-header">
                  <div className="flex-row">
                    <div className="admin-avatar">{post.author ? post.author[0].toUpperCase() : 'U'}</div>
                    <div>
                      <p className="admin-name">{post.author}</p>
                      <p className="feed-time">Ушинский Лайв</p>
                    </div>
                  </div>
                  {(post.author === user || user === 'Админ') && (
                    <Trash2 size={18} className="delete-icon" onClick={() => deletePost(post.id)} />
                  )}
                </div>
                <div className="feed-content">
                  <p>{post.text}</p>
                  {post.image && <img src={post.image} alt="post" className="post-img" />}
                </div>
                <div className="feed-footer">
                  <button className="like-btn">❤️ {post.likes || 0}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="page chat-list">
            {selectedChat ? (
              <ChatWindow contactName={selectedChat.name} contactId={selectedChat.id} onBack={() => setSelectedChat(null)} />
            ) : (
              realUsers.map(u => (
                <div key={u.id} className="chat-item" onClick={() => setSelectedChat({id: u.id, name: u.username})}>
                  <div className="chat-avatar">{u.username?.[0].toUpperCase()}</div>
                  <div className="chat-info"><div className="chat-name">{u.username}</div></div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="page profile-page">
            <div className="profile-header">
              <div className="admin-avatar-large">{user[0]?.toUpperCase()}</div>
              <h2>{user}</h2>
            </div>
            <div className="profile-menu">
              <button className="menu-item" onClick={() => setDarkMode(!darkMode)}><Moon size={18} /> Темы</button>
              <button className="menu-item logout" onClick={() => setIsLoggedIn(false)}><LogOut size={18} /> Выйти</button>
            </div>
          </div>
        )}
      </main>

      <GeminiBot />

      {isCreatePostModalOpen && <CreatePostModal onClose={() => setIsCreatePostModalOpen(false)} onCreatePost={handleCreatePost} />}

      <nav className="ul-navbar">
        <button onClick={() => setActiveTab('feed')} className={activeTab === 'feed' ? 'active' : ''}><Home /></button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}><MessageCircle /></button>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}><User /></button>
      </nav>
    </div>
  );
}

export default App;
