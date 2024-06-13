import React from 'react';
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
                <Header />
                {/* <KakaoMap /> */}
            </div>

        </div>
    );
}

export default App;
