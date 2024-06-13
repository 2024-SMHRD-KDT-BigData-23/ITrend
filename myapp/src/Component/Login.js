import React, { useState } from 'react';

function Login() {
    const [credentials, setCredentials] = useState({ user_id: '', user_pw: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        };

        try {
            const response = await fetch('http://localhost:8080/api/login_process', requestOptions);
            const result = await response.text();
            console.log(result)
            if (result === "success") {
                alert("로그인이 성공했습니다.");
                window.location.href = '/Dashboard'
            } else {
                alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요");
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h2>로그인 페이지</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                            <td><label>아이디:</label></td>
                            <td><input type="text" name="user_id" value={credentials.user_id} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>비밀번호:</label></td>
                            <td><input type="password" name="user_pw" value={credentials.user_pw} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td colSpan={2} align='right'><button type="submit">로그인</button></td>
                        </tr>
                    </table>
                </form>

            </div>
        </div >
    );
}

export default Login;
