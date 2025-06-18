import { GlassesCard } from '../components/GlassesCard';
import { deleteService as apiDeleteService, Service } from '../api/service';

interface HomePageProps {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    error: string | null;
    user: any; 
    token: string | null; 
}

export const HomePage = ({ services, setServices, error, user, token }: HomePageProps) => {
    const handleDelete = async (id: number) => {
        try {
            await apiDeleteService(id);
            setServices(services.filter(service => service.id !== id));
        } catch (err) {
            console.error(`Ошибка удаления услуги ${id}:`, err);
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <main>
            <div className="glasses-list">
                {services.length > 0 ? (
                    services.map(service => (
                        <GlassesCard
                            key={service.id}
                            service={service}
                            user={user} 
                            token={token} 
                        />
                    ))
                ) : (
                    <p>Ничего не найдено.</p>
                )}
            </div>
        </main>
    );
};



