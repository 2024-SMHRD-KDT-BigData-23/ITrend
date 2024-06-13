import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const LoginForm = ({ closeModal }) => {
    const [credentials, setCredentials] = useState({ user_id: '', user_pw: '' });
    const [cookies, setCookie] = useCookies(['user_id']);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(credentials);
            const response = await axios.post('http://localhost:8080/api/login_process', credentials);
            const result = response.data;
            console.log(result[0].user_id);
            if (result[0].user_id != null) {
                alert("로그인이 성공했습니다.");
                setCookie('user_id', result[0].user_id, { path: '/' });
            } else {
                alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요");
            }
        } catch (error) {
            alert("될줄알았어??????????ㅋㅋㅋㅋㅋㅋㅋㅋㅋ");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="user_id">Username:</label>
                    <input
                        type="text"
                        id="user_id"
                        name="user_id"
                        value={credentials.user_id}
                        onChange={handleInputChange}
                        autoComplete='user_id'
                    />
                </div>
                <div>
                    <label htmlFor="user_pw">Password:</label>
                    <input
                        type="password"
                        id="user_pw"
                        name="user_pw"
                        value={credentials.user_pw}
                        onChange={handleInputChange}
                        autoComplete='current-password'
                    />
                </div>
                <button type="submit">Login</button>

            </form>
            <button onClick={closeModal}>닫기</button>
        </div >


    );
};

export default LoginForm;
