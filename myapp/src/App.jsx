import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analysispage from './Analysispage';
import Header from './Component/Header';
import KakaoMap from './Component/KakaoMap';

function App() {
    return (

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
}

export default App;