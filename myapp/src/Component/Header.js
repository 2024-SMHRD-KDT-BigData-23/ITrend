import React, { useState } from "react";
// useLocation 현재의 경로를 알기위함
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';
import Login from './Login';
import './Header.css';

const Header = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // 현재 경로가 특정 경로와 일치하는지 확인하여 활성 상태를 결정합니다.
    // 경로가 일치하면 True
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
