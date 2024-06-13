import React from 'react';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './SignUp';
import Dashboard from './Dashboard';
import KakaoMapPage from './pages/KakaoMap';
import Newspage from './Newspage';
import PrivateRoute from './PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/KakaoMap" element={<KakaoMapPage/>} />
                    <Route path="/Newspage" element={
                        <PrivateRoute>
                            <Newspage />
                        </PrivateRoute>
                    } />
                </Routes>
                <Link to='/Home'>HOME</Link>
                <br></br>
                <Link to='/Login'>로그인</Link>
                <br></br>
                <Link to='/SignUp'>회원가입</Link>
                <br></br>
                <Link to='/Dashboard'>대시보드</Link>
                <br></br>
                <Link to='/KakaoMap'>카카오맵</Link>
                <br></br>
                <Link to='/Newspage'>뉴스페이지</Link>
            </div>
        </BrowserRouter>
    );
}

export default App;
