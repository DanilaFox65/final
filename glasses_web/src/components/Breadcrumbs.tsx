import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
    const location = useLocation();

    
    const isDetailPage = location.pathname.startsWith('/detail/');
    const isDraftPage = location.pathname.startsWith('/draft');
    const isOrdersPage = location.pathname.startsWith('/orders');
    const isLoginPage = location.pathname.startsWith('/login');
    const isRegisterPage = location.pathname.startsWith('/register');
    

    return (
        <nav className="breadcrumbs">
            <Link to="/">Главная</Link>
            
            {isDetailPage && (
                <>
                    {' / '}
                    <span>Описание</span>
                </>
            )}

            {isDraftPage && (
                <>
                    {' / '}
                    <span>Корзина</span>
                </>
            )}

            {isOrdersPage && (
                <>
                    {' / '}
                    <span>Мои заказы</span>
                </>
            )}

            {isLoginPage && (
                <>
                    {' / '}
                    <span>Войти</span>
                </>
            )}

            {isRegisterPage && (
                <>
                    {' / '}
                    <span>Регистрация</span>
                </>
            )}


        </nav>
    );
};


