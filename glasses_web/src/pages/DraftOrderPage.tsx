import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchDraftOrder,
  deleteServiceFromOrder,
  submitDraftOrder,
  clearDraftOrder,
} from '../store/draftOrderSlice';
import { useNavigate } from 'react-router-dom';

export const DraftOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  
  const token = useSelector((state: RootState) => state.auth.token);
  const { orderData, loading, error, submitted } = useSelector(
    (state: RootState) => state.draftOrder
  );

  
  useEffect(() => {
    if (token) dispatch(fetchDraftOrder());
  }, [token, dispatch]);

  
  useEffect(() => {
    if (submitted) {
      navigate('/');
      dispatch(clearDraftOrder());          
    }
  }, [submitted, navigate, dispatch]);

  
  const handleRemoveService = async (orderId: number, serviceId: number) => {
    await dispatch(deleteServiceFromOrder({ orderId, serviceId }));
    dispatch(fetchDraftOrder());            
  };

  const handleSubmitOrder = () => {
    if (orderData?.order) {
      dispatch(submitDraftOrder({ orderId: orderData.order.id }));
    }
  };

  
  if (!token) return <p>Пожалуйста, авторизуйтесь, чтобы увидеть черновик заявки.</p>;
  if (loading)   return <p>Загрузка...</p>;
  if (!orderData?.order) return <p>Нет данных о черновике заявки.</p>;

  
  return (
    <div className="draft-order-container">
      <h2 className="draft-order-title">
        Черновик заявки #{orderData.order.id}
      </h2>

      <div className="draft-order-card">
        <p className="draft-status">Статус: {orderData.order.status}</p>

        <div className="draft-services-section">
          <h3 className="draft-services-title">Услуги:</h3>

          {orderData.services.length === 0 ? (
            <p className="draft-empty-message">Нет добавленных услуг.</p>
          ) : (
            <ul className="draft-services-list">
              {orderData.services.map((s) => (
                <li key={s.service.id} className="draft-service-item">
                  <img
                    src={s.service.image}
                    alt={s.service.name}
                    className="draft-service-image"
                  />
                  <div className="draft-service-info">
                    <h4 className="draft-service-name">{s.service.name}</h4>
                    <p className="draft-service-price">
                      Цена: {s.service.price} руб.
                    </p>
                  </div>
                  <button
                    className="draft-remove-button"
                    onClick={() =>
                      handleRemoveService(orderData.order!.id, s.service.id)
                    }
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          )}

          {error && <p className="draft-error-message">{error}</p>}

          {orderData.services.length > 0 && (
            <button
              className="draft-submit-button"
              onClick={handleSubmitOrder}
            >
              Отправить заявку
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
