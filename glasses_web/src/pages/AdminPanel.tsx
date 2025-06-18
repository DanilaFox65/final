import { useEffect, useState } from 'react';
import { getAllOrders } from '../api/orderService'; 
import { changeOrderStatus } from '../api/orderService'; 

interface AdminPanelProps {
  token: string | null;
}

interface ServiceItem {
  id: number;
  service: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface User {
  id: number;
  username: string;
}

interface Order {
  id: number;
  status: string;
  user: User | null;
  services?: ServiceItem[];
}

export const AdminPanel = ({ token }: AdminPanelProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(token);
      const normalizedOrders: Order[] = data.map((item: any) => ({
        ...item.order,
        user: item.user || null,
        services: item.services || [],
      }));
      setOrders(normalizedOrders);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: 'completed' | 'rejected') => {
    try {
      await changeOrderStatus(orderId, newStatus, token!);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      setError('Ошибка при обновлении статуса заказа');
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Панель администратора</h2>
      {error && <p className="admin-error">{error}</p>}

      {orders.length === 0 ? (
        <p className="admin-empty">Нет доступных заказов.</p>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-header">
                <h3 className="admin-order-title">Заказ #{order.id}</h3>
                <span className={`admin-order-status admin-status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <p className="admin-order-user">
                <strong>Пользователь:</strong> {order.user?.username ?? 'Неизвестно'}
              </p>

              {order.status === 'formed' && (
                <div className="admin-order-actions">
                  <button
                    className="admin-action-button admin-action-complete"
                    onClick={() => handleStatusChange(order.id, 'completed')}
                  >
                    Завершить
                  </button>
                  <button
                    className="admin-action-button admin-action-reject"
                    onClick={() => handleStatusChange(order.id, 'rejected')}
                  >
                    Отклонить
                  </button>
                </div>
              )}

              {order.services && order.services.length > 0 ? (
                <>
                  <h4 className="admin-services-title">Услуги:</h4>
                  <ul className="admin-services-list">
                    {order.services.map((item) => (
                      <li key={item.id} className="admin-service-item">
                        <img
                          src={item.service.image}
                          alt={item.service.name}
                          className="admin-service-image"
                        />
                        <div className="admin-service-info">
                          <span className="admin-service-name">{item.service.name}</span>
                          <span className="admin-service-price">{item.service.price} руб.</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="admin-no-services">Услуги не добавлены к заказу.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

