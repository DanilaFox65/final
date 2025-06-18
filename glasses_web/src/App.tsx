
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './store';
import { login, logout, register } from './store/authSlice';

import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Header } from './components/Header';
import { fetchServices, Service } from './api/service';
import { LoginPage } from './pages/LoginPage';
import { DraftOrderPage } from './pages/DraftOrderPage';
import { UserOrdersPage } from './pages/UserOrdersPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPanel } from './pages/AdminPanel';

interface LayoutProps {
  user: any;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, role: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, token, login, logout }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [services, setServices] = useState<Service[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadServices = async (name: string, price: string) => {
    try {
      const data = await fetchServices(name, price);
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить услуги');
      console.error(err);
    }
  };

  useEffect(() => {
    if (isHome) {
      loadServices(filterName, filterPrice);
    }
  }, [isHome]);

  const handleFilterChange = (name: string, value: string) => {
    if (name === 'filter_name') {
      setFilterName(value);
    } else if (name === 'filter_price') {
      setFilterPrice(value.replace(/[^\d]/g, ''));
    }
  };

  const handleFilterSubmit = () => {
    loadServices(filterName, filterPrice);
  };

  return (
    <div className="app">
      <Header
  title="Каталог очков"
  showFilters={isHome}
  filterName={filterName}
  filterPrice={filterPrice}
  onFilterChange={handleFilterChange}
  onFilterSubmit={handleFilterSubmit}
/>


      <Breadcrumbs />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              services={services}
              setServices={setServices}
              error={error}
              user={user}
              token={token}
            />
          }
        />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/register" element={<RegisterPage login={login} />} />
        <Route path="/draft" element={<DraftOrderPage />} />
        <Route path="/orders" element={<UserOrdersPage token={token} />} />
        <Route path="/admin" element={<AdminPanel token={token} />} />
      </Routes>
    </div>
  );
};

const LayoutWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();

  
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);


  const handleLogin = async (username: string, password: string): Promise<void> => {
    await dispatch(login({ username, password }));
  };

 
  const handleLogout = (): void => {
    dispatch(logout());
  };

  const handleRegister = (username: string, password: string, role: string): void => {
    dispatch(register({ username, password, role }));
  };

  return (
    <Layout
      token={token}
      user={user}
      login={handleLogin}
      logout={handleLogout}
      register={handleRegister}
    />
  );
};

export const App = () => (
  <Provider store={store}>
    <Router>
      <LayoutWrapper />
    </Router>
  </Provider>
);
