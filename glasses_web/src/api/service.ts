import tempImage from '../styles/image/glasses1.jpg';
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Service {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  color: string;
  size: string;
  date?: string;
  is_active?: boolean;
}


const mockServices: Service[] = [
  {
    id: 1,
    name: 'Очки солнцезащитные',
    price: 1990,
    image: tempImage, 
    description: 'Классические тёмные очки',
    color: 'чёрный',
    size: 'M',
  },
  {
    id: 2,
    name: 'Очки для чтения',
    price: 1290,
    image: tempImage, 
    description: 'Для чтения вблизи',
    color: 'серый',
    size: 'L',
  }
];


export const fetchServices = async (
  filterName?: string,
  filterPrice?: string
): Promise<Service[]> => {
  try {
    const params = new URLSearchParams();
    if (filterName) params.append('filter_name', filterName);
    if (filterPrice) params.append('filter_price', filterPrice);

    const response = await fetch(`${API_BASE_URL}/api/services/?${params.toString()}`);

    if (!response.ok) throw new Error('Ошибка при получении данных');

    const data = await response.json();

    return data.map((service: any) => ({
      ...service,
      color: Array.isArray(service.color)
        ? service.color
        : typeof service.color === 'string'
        ? service.color.split(',')
        : [],
    }));
  } catch (error) {
    console.warn('Ошибка при fetch списка. Используем mock-данные:', error);
    return mockServices;
  }
};


export const fetchServiceDetails = async (id: number): Promise<Service> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}/`);
    if (!response.ok) throw new Error('Ошибка при получении услуги');
    return await response.json();
  } catch (error) {
    console.warn(`Ошибка при получении услуги ${id}:`, error);
    const fallback = mockServices.find(service => service.id === id);
    if (fallback) {
      console.warn('Используем mock-данные для услуги');
      return fallback;
    } else {
      throw new Error(`Нет mock-данных для услуги с id=${id}`);
    }
  }
};


export const createService = async (
  serviceData: Omit<Service, 'id'>
): Promise<Service> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) throw new Error('Ошибка при создании услуги');
    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании услуги:', error);
    throw error;
  }
};


export const deleteService = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Ошибка при удалении услуги');
  } catch (error) {
    console.error(`Ошибка при удалении услуги ${id}:`, error);
    throw error;
  }
};

