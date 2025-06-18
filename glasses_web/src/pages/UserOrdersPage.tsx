import { useEffect, useState } from 'react';
import { getUserOrders } from '../api/orderService'; 
import { useNavigate } from 'react-router-dom';

interface UserOrdersPageProps {
  token: string | null; 
}

export const UserOrdersPage = ({ token }: UserOrdersPageProps) => {
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
   
    if (!token) {
      setError('Вы не авторизованы');
      navigate('/login');
      setLoading(false);
      return;
    }

    
    getUserOrders(token)
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message || 'Ошибка при загрузке заказов');
        } else {
          setError('Неизвестная ошибка при загрузке заказов');
        }
        setLoading(false);
      });
  }, [token, navigate]); 

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="user-orders-container">
      <h2 className="user-orders-title">Мои заказы</h2>

      {error && <p className="user-error-message">{error}</p>}

      {orders.length === 0 ? (
        <p className="user-empty-message">У вас нет заказов.</p>
      ) : (
        orders.map((order: any) => (
          <div key={order.order.id} className="user-order-card">
            <div className="user-order-header">
              <h3 className="user-order-id">Заказ #{order.order.id}</h3>
              <span className={`user-order-status status-${order.order.status.toLowerCase()}`}>
                {order.order.status}
              </span>
            </div>
            
            <div className="user-services-section">
              <h4 className="user-services-title">Услуги:</h4>
              <ul className="user-services-list">
                {order.services.map((service: any) => (
                  <li key={service.id} className="user-service-item">
                    <img 
                      src={service.service.image} 
                      alt={service.service.name} 
                      className="user-service-image" 
                    />
                    <div className="user-service-info">
                      <h5 className="user-service-name">{service.service.name}</h5>
                      <p className="user-service-price">Цена: {service.service.price} руб.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
