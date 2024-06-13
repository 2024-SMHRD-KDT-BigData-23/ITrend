import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import Newspage from './Newspage';
import PrivateRoute from './PrivateRoute';
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
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/KakaoMap" element={<KakaoMap />} />
                        <Route path="/Newspage" element={
                            <PrivateRoute>
                                <Newspage />
                            </PrivateRoute>
                        } />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>

    );
}

export default App;
