import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SignUp from './SignUp';
import Swal from "sweetalert2";


const Login = ({ closeModal }) => {
    const [credentials, setCredentials] = useState({ user_id: '', user_pw: '' });
    const [cookies, setCookie] = useCookies(['user_id']);
    const [isSignUp, setIsSignUp] = useState(false);  // 회원가입 상태 관리

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
                Swal.fire({
                    title: '로그인이 성공했습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                }).then(() => {
                    // 확인 버튼을 클릭 후 싥행할 로직
                    setCookie('user_id', result[0].user_id, { path: '/' });
                    closeModal();
                });
            } else {
                Swal.fire({
                    title: '로그인에 실패했습니다.',
                    text: '아이디와 비밀번호를 확인해주세요',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        } catch (error) {
            Swal.fire({
                title: '로그인에 실패했습니다.',
                text: '아이디와 비밀번호를 확인해주세요',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    };

    return (
        <div className='loginInput' style={{ minHeight: "480px", display: "flex", justifyContent: "center", width: "100%", margin: "5px", padding: "5px", border: "1px solid black" }}>
            <div style={{ minHeight: "475px", display: "flex", flexDirection: "column", width: "80%", height: "50vh", padding: "5px", border: "1px solid blue" }}>
                <div style={{ display: "flex", width: "100%", height: "20%", border: "1px solid red" }}>
                    <img src='/images/ITLOGO.png' style={{ flex: "0 0 30%", height: "auto" }} alt="ITrend Logo"></img>
                    {/* 여기 이미지 태그로 바꾸기 */}
                    <img src='/images/ITLOGO2.png' style={{ flex: 1}} alt='ITrend Text'></img>
                </div>
                {!isSignUp ? (

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <form onSubmit={handleSubmit}>

                            <div style={{ display: "flex", border: "1px solid #A7E6FF", height: "40px" }}>
                                <label htmlFor="user_id" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <FontAwesomeIcon icon={faUser} style={{ color: "#A7E6FF" }} />
                                </label>
                                <input type="text" id="user_id" name="user_id" value={credentials.user_id}
                                    onChange={handleInputChange}
                                    autoComplete='user_id'
                                    placeholder='아이디'
                                    style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                                />
                            </div>
                            <div style={{ display: "flex", border: "1px solid #A7E6FF", borderTop: "none", height: "40px" }}>
                                <label htmlFor="user_pw" style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <FontAwesomeIcon icon={faKey} style={{ color: "#A7E6FF" }} />
                                </label>
                                <input type="password" id="user_pw" name="user_pw" value={credentials.user_pw}
                                    onChange={handleInputChange}
                                    autoComplete='current-password'
                                    placeholder='비밀번호'
                                    style={{ flex: 1, border: "none", borderLeft: "1px solid #A7E6FF" }}
                                />
                            </div>
                            <button type="submit" style={{ width: "100%", height: "40px", background: "none", backgroundColor: "#A7E6FF", border: "1px solid #A7E6FF" }}>Login</button>

                        </form>
                        <div style={{ display: "flex", justifyContent: "end", width: "100%", height: "30px" }}>
                            <button style={{ border: "none", background: "none", cursor: "pointer", color: "blue", textDecoration: "underline" }} type="button" onClick={() => setIsSignUp(true)}>회원가입</button>
                        </div>
                    </div>
                ) : (
                    <SignUp closeModal={closeModal} closeSignUp={() => setIsSignUp(false)} />  // 회원가입 컴포넌트 렌더링
                )}
            </div>
        </div>
    );
};

export default Login;
