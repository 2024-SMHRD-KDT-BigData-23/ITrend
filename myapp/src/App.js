import React from 'react';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import './App.css';
import Login from './Component/Login';
import Signup from './Component/SignUp';
import KakaoMap from './Component/KakaoMap';
import Header from './Component/Header';




function App() {
    return (

        <div className="Container">
            <div style={{ display: 'flex' }}>
                <Header />

                <KakaoMap />
            </div >
            {/* <BrowserRouter>
                <div>
                <table border={1}>
                        <tr>
                            <td><Link to='/Home'>HOME</Link></td>
                            <td><Link to='/Login'>로그인</Link></td>
                            <td><Link to='/SignUp'>회원가입</Link></td>
                            <td><Link to='/Dashboard'>대시보드</Link></td>
                            <td><Link to='/KakaoMap'>카카오맵</Link></td>
                        </tr>
                    </table>
                </div>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/KakaoMap" element={<KakaoMap />} />
                </Routes>
            </BrowserRouter > */}
        </div >
    );
}

export default App;