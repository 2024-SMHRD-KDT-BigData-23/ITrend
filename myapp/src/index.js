import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 여기에 실제 경로를 사용하십시오
import './index.css'; // 필요한 경우 다른 스타일 파일들을 import 합니다.

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);