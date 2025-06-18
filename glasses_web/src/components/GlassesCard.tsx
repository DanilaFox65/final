import { useState } from 'react';
import { Glasses } from '../types/types';
import { Link } from 'react-router-dom';
import { addServiceToDraft } from '../api/orderService';

interface GlassesCardProps {
  service: Glasses;
  user: { username: string; role: string } | null;
  token: string | null;
}

export const GlassesCard = ({ service, user, token }: GlassesCardProps) => {
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToDraft = () => {
    if (token) {
      addServiceToDraft(service.id, token)
        .then(response => {
          setMessage('Услуга добавлена в черновик');
          
          setTimeout(() => setMessage(null), 3000);
          console.log('Услуга добавлена в черновик:', response);
        })
        .catch(error => {
          setMessage('Ошибка при добавлении в черновик');
          setTimeout(() => setMessage(null), 3000);
          console.error('Ошибка при добавлении в черновик:', error);
        });
    } else {
      setMessage('Пользователь не авторизован. Необходим токен.');
      setTimeout(() => setMessage(null), 3000);
      console.log('Пользователь не авторизован. Необходим токен.');
    }
  };

  const isUserAuthorized = user && token;

  return (
    <div className="glasses-card">
      <img src={service.image} alt={service.name} />
      <h2>{service.name}</h2>
      <p>Цена: {service.price} руб.</p>

      <div className="card-actions">
        <Link to={`/detail/${service.id}`} className="btn-detail">
          Подробнее
        </Link>

        {isUserAuthorized && (
          <button className="btn-add-to-draft" onClick={handleAddToDraft}>
            Добавить в корзину
          </button>
        )}
      </div>

      
      {message && <div className="notification">{message}</div>}
    </div>
  );
};
