import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import "./MapControls.css";

const MapControls = ({ map }) => {
    // 지도를 확대하는 함수
    const zoomIn = () => {
        // 현재 지도 레벨을 1단계 축소하여 지도를 확대
        map.setLevel(map.getLevel() - 1);
    };

    // 지도를 축소하는 함수
    const zoomOut = () => {
        // 현재 지도 레벨을 1단계 확대하여 지도를 축소
        map.setLevel(map.getLevel() + 1);
    };

    // 지도를 초기화하는 함수
    const resetMap = () => {
        // 지도의 레벨을 12로 설정하여 초기 상태로 되돌림
        map.setLevel(12);
    };

    return (
        <div className="mapControls">
            {/* 지도 확대 버튼 */}
            <button type='button' id="zoomIn" onClick={zoomIn}>
                <FontAwesomeIcon icon={faPlus} className='icon' />
            </button>
            {/* 지도 축소 버튼 */}
            <button type='button' id="zoomOut" onClick={zoomOut}>
                <FontAwesomeIcon icon={faMinus} className='icon' />
            </button>
            {/* 지도 초기화 버튼 */}
            <button type='button' id="reset" onClick={resetMap}>Reset</button>
        </div>
    );
};

export default MapControls;