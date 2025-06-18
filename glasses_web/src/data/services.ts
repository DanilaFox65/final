import { Glasses } from '../types/types';

export const services: Glasses[] = [
    {
        id: 1,
        name: 'Модель 1',
        price: 5000,
        image: 'glasses1.jpg',
        description: 'Стильные очки для повседневного использования.',
        color: ['черный', 'коричневый', 'синий'],
        size: '50-20-145',
        date: '2023-01-15'
    },
    {
        id: 2,
        name: 'Модель 2',
        price: 7000,
        image: 'glasses2.jpg',
        description: 'Очки с защитой от ультрафиолета.',
        color: ['черный', 'серый'],
        size: '52-22-150',
        date: '2023-02-20'
    }
];