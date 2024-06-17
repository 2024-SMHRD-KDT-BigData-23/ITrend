import React, { useState } from 'react';
import { faUser, faKey, faCalendarDays, faVenusMars, faHomeUser, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function Signup({ closeSignUp, closeModal }) {
    const [inputValues, setInputValues] = useState({
        user_id: '',
        user_pw: '',
        user_name: '',
        user_birthdate: '',
        user_gender: '',
        user_loc: '',
        user_phone: ''
    });
    const navigate = useNavigate(); // useNavigate 훅 사용

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
            Swal.fire({
                title: '회원가입이 성공했습니다.',
                icon: 'success',
                confirmButtonText: '확인'
            }).then(() => {
                // 확인 버튼을 클릭 후 싥행할 로직
                navigate('/'); // 경로 변경
                closeModal();
            });

            console.log(response);
        } catch (error) {
            Swal.fire({
                title: '회원가입에 실패했습니다.',
                text: '정보를 확인해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    };

    return (
        <div className='signUpContainer'>
            <form onSubmit={handleSubmit}>
                <div className='inputGroup'>
                    <label htmlFor="user_id" className='labelContainer'>
                        <FontAwesomeIcon icon={faUser} className='icon' />
                    </label>
                    <input
                        type="text"
                        id="user_id"
                        name="user_id"
                        value={inputValues.user_id}
                        onChange={handleInputChange}
                        placeholder='아이디'
                        className='inputField'
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor="user_pw" className='labelContainer'>
                        <FontAwesomeIcon icon={faKey} className='icon' />
                    </label>
                    <input
                        type="password"
                        id="user_pw"
                        name="user_pw"
                        value={inputValues.user_pw}
                        onChange={handleInputChange}
                        placeholder='비밀번호'
                        className='inputField'
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor="user_name" className='labelContainer'>
                        <FontAwesomeIcon icon={faUser} className='icon' />
                    </label>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        value={inputValues.user_name}
                        onChange={handleInputChange}
                        placeholder='이름'
                        className='inputField'
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor="user_birthdate" className='labelContainer'>
                        <FontAwesomeIcon icon={faCalendarDays} className='icon' />
                    </label>
                    <input
                        type="date"
                        id="user_birthdate"
                        name="user_birthdate"
                        value={inputValues.user_birthdate}
                        onChange={handleInputChange}
                        placeholder='생년월일'
                        className='inputField'
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor="user_gender" className='labelContainer'>
                        <FontAwesomeIcon icon={faVenusMars} className='icon' />
                    </label>
                    <input
                        type="text"
                        id="user_gender"
                        name="user_gender"
                        value={inputValues.user_gender}
                        onChange={handleInputChange}
                        placeholder='성별'
                        className='inputField'
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor="user_loc" className='labelContainer'>
                        <FontAwesomeIcon icon={faHomeUser} className='icon' />
                    </label>
                    <input
                        type="text"
                        id="user_loc"
                        name="user_loc"
                        value={inputValues.user_loc}
                        onChange={handleInputChange}
                        placeholder='주소'
                        className='inputField'
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor="user_phone" className='labelContainer'>
                        <FontAwesomeIcon icon={faMobileScreenButton} className='icon' />
                    </label>
                    <input
                        type="text"
                        id="user_phone"
                        name="user_phone"
                        value={inputValues.user_phone}
                        onChange={handleInputChange}
                        placeholder='연락처'
                        className='inputField'
                    />
                </div>
                <button type="submit" className='submitButton'>회원가입</button>
            </form>
            <div className='backButtonContainer'>
                <button onClick={closeSignUp} className='backButton'>돌아가기</button>
            </div>
        </div>
    );
}

export default Signup;
