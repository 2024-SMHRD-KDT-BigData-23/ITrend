import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';
import Login from './Login';
import './Header.css';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
    const isAuthenticated = !!cookies['user_id']; // 쿠키가 있는지 확인하여 인증 상태 설정

    const openModal = () => {
        if (isAuthenticated) {
            Swal.fire({
                title: '정말로 로그아웃하시겠습니까?',
                text: "다시 되돌릴 수 없습니다. 신중하세요.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '로그아웃',
                cancelButtonText: '취소',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    removeCookie('user_id');
                    Swal.fire(
                        '로그아웃 되었습니다.',
                        '성공적으로 로그아웃되었습니다.',
                        'success'
                    );
                }
            });
        } else {
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div>
            <header id='header' className='mainHeader'>
                <h1>
                    <a href='#'>
                        <img src='/images/ITLOGO.png' alt='ITrend' />
                    </a>
                </h1>
                <nav>
                    <ul>
                        <li>
                            <button id="headerMap"
                                className={isActive('/') ? 'active' : ''}
                                onClick={() => navigate('/')}>
                                <FontAwesomeIcon icon={faLocationDot} className='icon' />
                                <p className={isActive('/') ? 'active' : ''}>지도 홈</p>
                            </button>
                        </li>
                        <li>
                            <button id="headerAnalysis"
                                onClick={() => navigate('/Analysispage')}
                                className={isActive('/Analysispage') ? 'active' : ''}>
                                <FontAwesomeIcon icon={faChartSimple} className='icon' />
                                <p className={isActive('/Analysispage') ? 'active' : ''}>데이터 분석</p>
                            </button>
                        </li>
                    </ul>
                </nav>
                <div id="user">
                    <button type="button" style={{ background: "none", border: "none" }} onClick={openModal}>
                        <FontAwesomeIcon icon={faUser} className='icon' />
                    </button>
                </div>
            </header>

            {modalOpen && (
                <div className="modal-overlay2" onClick={closeModal}>
                    <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
                        <Login closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
