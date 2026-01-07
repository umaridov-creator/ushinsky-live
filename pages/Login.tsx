import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { auth, db } from '../firebase'; // Импортируем нашу базу
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegister) {
        // РЕГИСТРАЦИЯ В FIREBASE
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Сохраняем имя пользователя в базу Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          points: 10
        });
        
        onLogin(username);
      } else {
        // ВХОД (если аккаунт уже есть)
        await signInWithEmailAndPassword(auth, email, password);
        onLogin(email.split('@')[0]); // Пока берем часть почты как ник
      }
    } catch (error: any) {
      alert("Ошибка: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <LogIn color="white" size={40} />
        </div>
        <h2>{isRegister ? 'Регистрация' : 'Вход в UL'}</h2>
        <p style={{marginBottom: '20px', color: '#666'}}>Ushinskiy Live — твоя школа онлайн</p>
        
        <div className="input-group">
          <User size={20} color="#007bff" />
          <input 
            placeholder="Email (например: user@mail.com)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {isRegister && (
          <div className="input-group">
            <User size={20} color="#007bff" />
            <input 
              placeholder="Придумай никнейм" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div className="input-group">
          <Lock size={20} color="#007bff" />
          <input 
            type="password"
            placeholder="Пароль (мин. 6 знаков)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleAuth}>
          {isRegister ? 'Создать аккаунт' : 'Войти'}
        </button>

        <p 
          onClick={() => setIsRegister(!isRegister)} 
          style={{marginTop: '15px', cursor: 'pointer', color: '#007bff', fontSize: '14px'}}
        >
          {isRegister ? 'Уже есть аккаунт? Войди' : 'Нет аккаунта? Зарегистрируйся'}
        </p>
      </div>
    </div>
  );
};

export default Login;