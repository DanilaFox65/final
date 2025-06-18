
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout as logoutThunk, logoutLocal } from '../store/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showFilters?: boolean;
  filterName?: string;
  filterPrice?: string;
  onFilterChange?: (name: string, value: string) => void;
  onFilterSubmit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showFilters = false,
  filterName = '',
  filterPrice = '',
  onFilterChange,
  onFilterSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);

  const showBackButton = location.pathname !== '/';

const handleAuthClick = () => {
  if (user) {
    dispatch(logoutLocal());
    dispatch(logoutThunk());
  } else {
    navigate('/login');
  }
};


  return (
    <header className="header">
      <div className="header-content">
        <div className="left-controls">
          {user && (
            <>
              <Link to="/orders" className="orders-button">
                Мои заказы
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-button">
                  Админ панель
                </Link>
              )}
            </>
          )}
        </div>

        <h1>{title}</h1>

        {showFilters ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onFilterSubmit?.();
            }}
          >
            <input
              type="text"
              name="filter_name"
              placeholder="Поиск по названию"
              value={filterName}
              onChange={(e) => onFilterChange?.('filter_name', e.target.value)}
            />
            <input
              type="number"
              name="filter_price"
              placeholder="Максимальная цена"
              value={filterPrice}
              onChange={(e) => onFilterChange?.('filter_price', e.target.value)}
            />
            <button type="submit">Найти</button>
          </form>
        ) : (
          showBackButton && (
            <Link to="/" className="back-button">
              Вернуться в каталог
            </Link>
          )
        )}

        <div className="auth-controls">
          <button className="auth-button" onClick={handleAuthClick}>
            {user ? 'Выйти' : 'Войти'}
          </button>

          {user && (
            <Link to="/draft" className="draft-button">
              Моя корзина
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
