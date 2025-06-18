const API_BASE_URL = 'http://127.0.0.1:8000';

export const register = async (username: string, password: string, role: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, role }),
  });

  if (!response.ok) {
    throw new Error('Ошибка регистрации');
  }

  return await response.json(); 
};

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || 'Ошибка входа';
    throw new Error(message); // <<< ВАЖНО!
  }

  const data = await response.json();
  return {
    token: data.token,
    username: data.username,
    role: data.role,
  };
};


export const logout = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка выхода');
  }

  return await response.json(); 
};

export const getProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения профиля');
  }

  return await response.json(); 
};