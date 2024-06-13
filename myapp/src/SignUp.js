import React, { useState } from 'react';

function Signup() {
    const [inputValues, setInputValues] = useState({
        user_id: '',
        user_pw: '',
        user_name: '',
        user_birthdate: '',
        user_gender: '',
        user_loc: '',
        user_phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputValues)
        };

        try {
            const response = await fetch('http://localhost:8080/api/signup_process', requestOptions);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div>
            <h2>회원가입 페이지</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    아이디:
                    <input type="text" name="user_id" value={inputValues.user_id} onChange={handleInputChange} />
                </label>
                <label>
                    비밀번호:
                    <input type="password" name="user_pw" value={inputValues.user_pw} onChange={handleInputChange} />
                </label>
                <label>
                    이름:
                    <input type="text" name="user_name" value={inputValues.user_name} onChange={handleInputChange} />
                </label>
                <label>
                    생년월일:
                    <input type="date" name="user_birthdate" value={inputValues.user_birthdate} onChange={handleInputChange} />
                </label>
                <label>
                    성별:
                    <input type="text" name="user_gender" value={inputValues.user_gender} onChange={handleInputChange} />
                </label>
                <label>
                    주소:
                    <input type="text" name="user_loc" value={inputValues.user_loc} onChange={handleInputChange} />
                </label>
                <label>
                    연락처:
                    <input type="text" name="user_phone" value={inputValues.user_phone} onChange={handleInputChange} />
                </label>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Signup;
