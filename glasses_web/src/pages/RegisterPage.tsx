import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';

interface RegisterPageProps {
  login: (username: string, password: string) => Promise<void>;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ login }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      setError('Все поля обязательны для заполнения');
      setLoading(false);
      return;
    }

    try {
      
      await register(username, password, 'client');
      await login(username, password); 
      navigate('/');
    } catch {
      setError('Ошибка регистрации');
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};