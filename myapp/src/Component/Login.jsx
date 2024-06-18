import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SignUp from './SignUp';
import Swal from "sweetalert2";
import './Login.css';

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
            const response = await axios.post('http://localhost:8080/api/login_process', credentials);
            const result = response.data;
            if (result[0].user_id != null) {
                Swal.fire({
                    title: '로그인이 성공했습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                }).then(() => {
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
        <div className='loginInput'>
            <div className='loginContainer'>
                <div className='logoContainer'>
                    <img src='/images/ITLOGO.png' className='logoImage' alt="ITrend Logo"></img>
                    <img src='/images/ITLOGO2.png' className='logoImage2' alt="Text Logo"></img>
                </div>
                {!isSignUp ? (
                    <div className='formContainer'>
                        <form onSubmit={handleSubmit}>
                            <div className='inputGroup'>
                                <label htmlFor="user_id" className='labelContainer'>
                                    <FontAwesomeIcon icon={faUser} className='icon' />
                                </label>
                                <input
                                    type="text"
                                    id="user_id"
                                    name="user_id"
                                    value={credentials.user_id}
                                    onChange={handleInputChange}
                                    autoComplete='user_id'
                                    placeholder='아이디'
                                    className='inputField'
                                />
                            </div>
                            <div className='inputGroup inputGroupTop'>
                                <label htmlFor="user_pw" className='labelContainer'>
                                    <FontAwesomeIcon icon={faKey} className='icon' />
                                </label>
                                <input
                                    type="password"
                                    id="user_pw"
                                    name="user_pw"
                                    value={credentials.user_pw}
                                    onChange={handleInputChange}
                                    autoComplete='current-password'
                                    placeholder='비밀번호'
                                    className='inputField'
                                />
                            </div>
                            <button type="submit" className='submitButton'>Login</button>
                        </form>
                        <div className='backButtonContainer'>
                            <button type="button" className='SignUpButton' onClick={() => setIsSignUp(true)}>회원가입</button>
                        </div>
                    </div>
                ) : (
                    <SignUp closeModal={closeModal} closeSignUp={() => setIsSignUp(false)} />
                )}
            </div>
        </div>
    );
};

export default Login;
