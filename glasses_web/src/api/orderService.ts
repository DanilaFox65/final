const API_BASE_URL = 'http://127.0.0.1:8000';

export const addServiceToDraft = async (serviceId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/draft/add-service/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ service_id: serviceId }),  
  });

  if (!response.ok) {
    throw new Error('Ошибка добавления услуги в черновик');
  }

  return await response.json(); 
};

export const getOrders = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения заказов');
  }

  return await response.json(); 
};

export const getOrderDetails = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения деталей заказа');
  }

  return await response.json(); 
};

export const updateOrderStatus = async (orderId: number, status: string, token: string | null) => {
  const response = await fetch(`/api/orders/${orderId}/status/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Ошибка обновления');
};

export const submitOrder = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/submit/`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка отправки заказа');
  }

  return await response.json(); 
};

export const completeOrder = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/complete/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка завершения заказа');
  }

  return await response.json(); 
};

export const deleteOrder = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/delete/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка удаления заказа');
  }

  return await response.json(); 
};

export const removeServiceFromOrder = async (
  orderId: number,
  serviceId: number,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/remove-service/${serviceId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok || response.status === 204) {
    throw new Error('Не удалось удалить услугу из заказа');
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Ошибка при обработке ответа сервера');
  }
};


export const getDraftOrder = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/draft/`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить черновик');
  }

  return await response.json(); 
};

export const getUserOrders = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/my/`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения пользовательских заказов');
  }

  return await response.json();
};

export const changeOrderStatus = async (id: number, action: 'completed' | 'rejected', token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/complete/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    throw new Error('Ошибка смены статуса');
  }

  return await response.json(); 
};

export const getAllOrders = async (token: string | null) => {
  const response = await fetch('/api/orders/all/', {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Ошибка загрузки');
  return response.json();
};

