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
            <div>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                            <td><label>아이디: </label></td>
                            <td><input type="text" name="user_id" value={inputValues.user_id} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>비밀번호: </label></td>
                            <td><input type="password" name="user_pw" value={inputValues.user_pw} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>이름:</label></td>
                            <td><input type="text" name="user_name" value={inputValues.user_name} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>생년월일:</label></td>
                            <td><input type="date" name="user_birthdate" value={inputValues.user_birthdate} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>성별:</label></td>
                            <td><input type="text" name="user_gender" value={inputValues.user_gender} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>주소:</label></td>
                            <td><input type="text" name="user_loc" value={inputValues.user_loc} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>연락처:</label></td>
                            <td><input type="text" name="user_phone" value={inputValues.user_phone} onChange={handleInputChange} /></td>

                        </tr>
                        <tr>
                            <td colSpan={2} align='right'><button type="submit">회원가입</button></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div >
    );
}

export default Signup;
