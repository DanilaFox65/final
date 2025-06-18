import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlassesDetail } from '../components/GlassesDetail';
import { fetchServiceDetails, Service } from '../api/service';

export const DetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadService = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error('ID не указан');

                const data = await fetchServiceDetails(parseInt(id));
                const normalizedService: Service = {
                    ...data,
                    color: data.color || '',
                    description: data.description || 'Нет описания',
                    size: data.size || 'Не указан',
                    date: data.date || 'Не указана',
                };
                setService(normalizedService);
                setError(null);
            } catch {
                setError('Не удалось загрузить данные услуги');
            } finally {
                setLoading(false);
            }
        };

        loadService();
    }, [id]);

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Попробовать снова</button>
            </div>
        );
    }

    if (!service) {
        return (
            <div>
                <p>Услуга не найдена</p>
                <a href="/">Вернуться в каталог</a>
            </div>
        );
    }

    return (
        <main>
            <GlassesDetail service={service} />
        </main>
    );
};

