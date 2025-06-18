import { Glasses } from '../types/types';

interface GlassesDetailProps {
    service: Glasses;
}

export const GlassesDetail = ({ service }: GlassesDetailProps) => {
    return (
        <div className="glasses-detail">
            <img src={service.image} alt={service.name} />
            <div className="details">
                <h2>{service.name}</h2>
                <p>Цена: {service.price} руб.</p>
                <p>Описание: {service.description}</p>
                <p>Цвет: {service.color}</p>
                <p>Размер: {service.size}</p>
                {service.date && <p>Дата производства: {service.date}</p>}
            </div>
        </div>
    );
};