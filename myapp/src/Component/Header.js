import React, { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import Login from '../Login';

import Newspage from '../Newspage';
import PrivateRoute from '../PrivateRoute';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

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
                            <button id="headerMap">
                                <FontAwesomeIcon icon={faLocationDot} className='icon' />
                                <span>지도 홈</span>
                            </button>
                        </li>
                        <li>
                            <button id="headerAnalysis">
                                <FontAwesomeIcon icon={faChartSimple} className='icon' />
                                <span>데이터 분석</span>
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