import React, { useState } from 'react';
import { faUser, faKey, faCalendarDays, faVenusMars, faHomeUser, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';



function Signup({ closeSignUp ,closeModal }) {
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


        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_id" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faUser} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="text" id="user_id" name="user_id" value={inputValues.user_id}
                        onChange={handleInputChange}
                        placeholder='아이디'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>
                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_pw" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faKey} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="password" id="user_pw" name="user_pw" value={inputValues.user_pw}
                        onChange={handleInputChange}
                        placeholder='비밀번호'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>

                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_name" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faUser} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="text" id="user_name" name="user_name" value={inputValues.user_name}
                        onChange={handleInputChange}
                        placeholder='이름'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>

                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_birthdate" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="date" id="user_birthdate" name="user_birthdate" value={inputValues.user_birthdate}
                        onChange={handleInputChange}
                        placeholder='생년월일'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>

                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_gender" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faVenusMars} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="text" id="user_gender" name="user_gender" value={inputValues.user_gender}
                        onChange={handleInputChange}
                        placeholder='성별'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>

                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_loc" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faHomeUser} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="text" id="user_loc" name="user_loc" value={inputValues.user_loc}
                        onChange={handleInputChange}
                        placeholder='주소'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>

                <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                    <label htmlFor="user_phone" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faMobileScreenButton} style={{ color: "#A7E6FF" }} />
                    </label>
                    <input type="text" id="user_phone" name="user_phone" value={inputValues.user_phone}
                        onChange={handleInputChange}
                        placeholder='연락처'
                        style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                    />
                </div>

                <button type="submit" style={{ width: "100%", height: "40px", background: "none", backgroundColor: "#A7E6FF", border: "1px solid #A7E6FF" }}>회원가입</button>
            </form>
            <div style={{ display: "flex", justifyContent: "end", width: "100%", height: "30px" }}>
                <button onClick={closeSignUp} style={{ border: "none", background: "none", cursor: "pointer", color: "blue", textDecoration: "underline" }}>돌아가기</button>
            </div>
        </div>
    );
}

export default Signup;
