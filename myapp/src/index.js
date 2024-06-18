import './index.css'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analysispage from './Component/Analysispage';
import Header from './Component/Header';
import KakaoMap from './Component/KakaoMap';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
        <div className="App">
                <div style={{ display: "flex" }}>
                        <BrowserRouter>
                                <Header />
                                <Routes>
                                        <Route path="/" element={<KakaoMap />} />
                                        <Route path="/Analysispage" element={<Analysispage />} />
                                </Routes>
                        </BrowserRouter>
                </div>
        </div>
);

