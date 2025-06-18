import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import './index.css';
import './styles/home.css';
import './styles/detail.css';
import './styles/breadcrumbs.css';
import './styles/header.css'
import './styles/login.css'
import './styles/DraftOrderPage.css'
import './styles/UserOrdersPage.css'
import './styles/adminpanel.css'
import './styles/LoginPage.css'
import './styles/RegisterPage.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);