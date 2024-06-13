import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {

    return (
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
                <a href='#'>
                    <FontAwesomeIcon icon={faUser} className='icon' />
                </a>
            </div>
        </header>

    );
}

export default Header;