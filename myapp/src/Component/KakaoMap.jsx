/* global kakao */
import React, { useState, useEffect } from 'react';
import "./KakaoMap.css";

// 컴포넌트
import RecruitInfo from './kakaoComponent/RecruitInfo';
import RecruitList from './kakaoComponent/RecruitList';
import MapControls from './kakaoComponent/MapControls';
import ChartPanel from './kakaoComponent/ChartPanel';
import FilterModal from './kakaoComponent/FilterModal';

// 라이브러리
import axios from 'axios'; // 비동기적으로 API 데이터를 보내는 라이브러리
import _ from 'lodash'; // 배열, 객체, 문자열 등의 데이터를 다루는 라이브러리
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 폰트어썸 라이브러리

// 폰트어썸에서 제공하는 아이콘을 사용하기 위한 라이브러리
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import { GridLoader } from 'react-spinners'; // 로딩화면에 사용될 spinners 라이브러리
import Swal from "sweetalert2"; // sweetalert2 라이브러리의 swal 사용

const KakaoMap = () => {

    // 데이터를 저장하는 변수들
    const [map, setMap] = useState(null); // 카카오맵을 저장할 객체
    const [dbPlaces, setDbPlaces] = useState([]); // 데이터베이스에서 가져온 장소 정보를 저장할 객체
    const [clusterer, setClusterer] = useState(null); // 카카오맵 클러스터러를 저장할 객체
    const [clusterMarkers, setClusterMarkers] = useState([]); // 클러스터 내부의 마커정보를 저장할 객체 
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택한 공고의 채용정보를 저장할 객체
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] }); // 차트에 표시될 skills의 정보를 저장할 객체
    const [jobChartData, setJobChartData] = useState({ labels: [], datasets: [] }); // 차트에 표시될 bar chart의 job 목록을 변경하기 위한 옵션
    const [selectedOptions, setSelectedOptions] = useState([]); // 사용자가 선택한 필터링 데이터를 저장할 객체
    const [keyword, setKeyword] = useState(''); // 사용자의 검색어가 저장될 객체

    // 레이아웃의 출력 여부를 결정할 변수들
    const [kakaoLoaded, setKakaoLoaded] = useState(false); // KakaoMap API 로딩 상태 관리 객체
    const [showCheckboxes, setShowCheckboxes] = useState(false); // 필터링을 위한 체크박스의 노출여부를 결정할 객체
    const [showCluster, setShowCluster] = useState(false); // 클러스터를 클릭시 클러스터 내부의 정보의 노출 여부를 결정할 객체
    const [recruitInfo, setRecruitInfo] = useState(false); //  채용공고의 노출여부를 결정할 객체
    const [showChart, setShowChart] = useState(false);  // 차트의 노출여부를 결정할 객체
    const [loading, setLoading] = useState(true); // 맵의 정보 로딩상태를 결정할 객체

    // 컴포넌트가 처음 렌더링될 때 지도 생성 및 초기 데이터 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`;
        script.onload = () => {
            kakao.maps.load(() => {
                setKakaoLoaded(true);
                const map = initMap();
                fetchInitialPlaces(map);
            });
        };
        document.head.appendChild(script);

        return () => {
            if (document.getElementById('kakao-map-script')) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // 지도 생성 함수
    const initMap = () => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new kakao.maps.LatLng(36.5, 127.5), // 남한 중심 좌표
            level: 12, // 지도의 확대 레벨 (1: 가장 확대, 14: 가장 축소)
            maxLevel: 12
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        setMap(map); // map 상태 업데이트
        return map;
    };

    // 저장된 카카오맵을 매개변수로 클러스터를 생성하는 함수
    const createClusterer = (map) => {
        // 카카오맵API에서 제공해주는 클러스터러 기능을 이용하여 클러스터러 저장
        const cluster = new kakao.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
            gridSize: 60, // 클러스터의 격자 크기. 화면 픽셀 단위이며 해당 격자 영역 안에 마커가 포함되면 클러스터에 포함시킨다 (default : 60)
            minLevel: 1, // 클러스터를 표시할  최소 지도 레벨
            minClusterSize: 3, // 클러스터링 할 최소 마커 수 (default: 2)
            disableClickZoom: true // 클러스터 클릭 시 지도 확대 여부. true로 설정하면 클러스터 클릭 시 확대 되지 않는다 (default: false)
        });
        setClusterer(cluster); // 클러스터러를 다른곳에서 사용할 수 있게 상태 업데이트
        return cluster; // 클러스터러 반환
    };

    // 카카오맵APi에 마커를 생성하는 함수
    const loadMarkers = (dbPlaces, clusterer) => {
        // dbPlace의 배열만큼, 마커 생성
        const markers = dbPlaces.map(dbPlace => {
            // 개별의 마커에 위도, 경도 설정
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(dbPlace.latitude, dbPlace.longitude)
            });
            // 위도, 경도를 설정한 마커에, dbplace의 정보를 담은 새로운 키값 생성
            marker.placeInfo = dbPlace;
            return marker; // 생성된 marker를 markers에 리턴
        });
        clusterer.addMarkers(markers); // 클러스터러에 마커들을 추가

        // 클러스터러 이벤트 리스너 추가
        kakao.maps.event.addListener(clusterer, 'clusterclick', handleClusterClick);
    };

    // 장소 목록을 클릭했을 때 해당 장소로 이동하는 함수
    const handlePlaceClick = (place) => {
        // 경도 값을 float형으로 변환
        const placeLongitude = parseFloat(place.longitude);
        // 경도 값을 약간 조정
        const updatedLongitude = placeLongitude - 0.0014;
        // 위도와 조정된 경도로 새로운 LatLng 객체 생성
        const placePosition = new kakao.maps.LatLng(place.latitude, updatedLongitude);

        // 지도의 중심을 새로운 위치로 설정하고 확대 레벨을 설정
        map.setCenter(placePosition);
        // 지도의 중심을 새로운 위치로 설정
        map.setLevel(1, { anchor: placePosition });

        // 상태 업데이트
        setSelectedPlace(place); // 선택된 장소 정보 설정
        setRecruitInfo(true); // 장소 클릭 시 채용 정보 표시
        setShowChart(false); // 차트 표시 비활성화
    };

    // 필터옵션의 체크박스의 체크상를 관리할 함수
    const handleCheckboxChange = (e) => {
        // 체크한 체크박스의 값을 저장
        const { name, checked } = e.target; // name : 체크박스의 값, checked : 체크상태

        // SelectedOptions의 값을 가져옴
        setSelectedOptions(prevState =>
            // 체크상태일경우, SelectOption에 체크된 값을 저장
            // 체크해제될 경우, SelectedOption의 각 요소와 비교하여,
            // true인 경우는 배열에 포함되고, false일 경우는 포함되지 않음
            checked ? [...prevState, name] : prevState.filter(option => option !== name)
        );
    };

    // 검색어 입력 시 상태 업데이트
    const handleChange = (e) => {
        setKeyword(e.target.value);
    };

    // 검색을 필터링 할 수 있는 체크박스 보여주기
    const toggleCheckboxes = () => {
        setShowCheckboxes(prevState => !prevState); // true -> false, false -> true
    };

    // 차트의 데이터를 생성하는 함수
    // markerInfos: 마커 정보 배열
    // key: 어떤 키워드를 추출할 것인지 (skills or job)
    // topN: 상위 추출 갯수 설정
    const extractTopItems = (markerInfos, key, topN) => {
        // 각 항목의 등장 횟수를 저장할 객체
        const itemCounts = {};

        // 마커 정보 배열을 순회하며 key에 해당하는 값을 추출하고 등장 횟수를 계산
        markerInfos.forEach(info => {
            if (info[key]) {
                info[key].split(', ').forEach(item => {
                    // itemCounts에 아이템이 존재하는지 확인
                    if (itemCounts[item]) {
                        // 존재할 경우 값에 +1
                        itemCounts[item]++;
                    } else {
                        // 존재하지 않을경우, item : 1 이런식으로 저장됨
                        // ex) itemCounts = { java : 1, python : 2} 
                        itemCounts[item] = 1;
                    }
                });
            }
        });

        // 각 항목과 그 등장 횟수를 배열 형태로 변환
        // ex) [ { item: 'Java', count: 1 }, { item: 'Python', count: 2 } ]
        const itemArray = Object.keys(itemCounts).map(item => ({
            item: item,
            count: itemCounts[item]
        }));

        
        // 모든 배열의 순환하며, 카운트값을 비교하여 내림차순으로 정렬
        itemArray.sort((a, b) => b.count - a.count);

        // 상위 topN 개의 항목을 반환 
        return itemArray.slice(0, topN);
    };

    // 클러스터 클릭 이벤트 핸들러
    const handleClusterClick = (cluster) => {
        // 클러스터에 포함된 마커들을 가져옴
        const markers = cluster.getMarkers();

        // 각 마커의 placeInfo를 추출하여 배열 생성
        const markerInfos = markers.map(marker => marker.placeInfo);
        setClusterMarkers(markerInfos); // 각 기업의 채용공고를 새로운 변수에 저장

        // extractTopItems함수를 이용하여, 채용공고에서 skills의 값을 카운트하고 상위 10개를 저장
        const topSkills = extractTopItems(markerInfos, 'skills', 10);
        // topSkills 데이터로 차트에 표시할 데이터 생성
        const newBarChartData = {
            labels: topSkills.map(item => item.item), // 차트 라벨 설정
            datasets: [
                {
                    data: topSkills.map(item => item.count), // 데이터 값 설정
                    borderColor: 'rgb(255, 99, 132)', // 바차트의 테두리
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // 바차트의 색상
                }
            ],
        };
        setBarChartData(newBarChartData); // Skills 차트 데이터 업데이트

        // 상동
        const topJobs = extractTopItems(markerInfos, 'job', 10);
        const newJobChartData = {
            labels: topJobs.map(item => item.item),
            datasets: [
                {
                    data: topJobs.map(item => item.count),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                }
            ],
        };
        setJobChartData(newJobChartData); // 직무 차트 데이터 상태 업데이트

        // 상태 업데이트
        setShowCluster(true); // 클러스터러의 채용공고 리스트를 보여주도록 상태 업데이트
        setShowChart(true); // 클러스터러의 skills, job 차트를 보여주도록 상태 업데이트
        setRecruitInfo(false); // 채용공고의 상세내용을 보여주지 않도록 상태 업데이트
    };

    // 핕터옵션으로 검색하는 함수
    const RDcategoryFind = async () => {
        if (selectedOptions.length === 0) {
            Swal.fire({
                title: '옵션을 선택해 주세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
            return;
        }
        try {
            // 필터조건을 배열에 담아, URL로 요쳥
            const response = await axios.post('http://localhost:8080/api/RDcategoryFind', selectedOptions)
            const placesFromDb = Array.isArray(response.data) ? response.data : []; // 상동

            // lodash 라이브러리의 함수
            // placesFromDb의 title을 기준으로 중복된 장소를 제거
            const uniquePlaces = _.uniqBy(placesFromDb, 'title');

            // 상동
            if (map) {
                let currentClusterer = clusterer;
                if (currentClusterer) {
                    currentClusterer.clear();
                } else {
                    currentClusterer = createClusterer(map);
                }
                loadMarkers(uniquePlaces, currentClusterer);
            }

            setDbPlaces(uniquePlaces);
            setShowCheckboxes(false);
            setShowChart(false);
            setRecruitInfo(false);
            map.setCenter(new kakao.maps.LatLng(36.5, 127.5));
            map.setLevel(12);
        } catch (error) {
            console.error(error);
        }
    };

    // 키워드로 장소를 검색하는 함수
    const searchPlaces = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            Swal.fire({
                title: '검색어를 입력하세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
            return;
        }
        if (!kakaoLoaded) {
            Swal.fire({
                title: '지도가 생성되는 중입니다.',
                icon: 'error',
                confirmButtonText: '확인'
            });
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/RDkeywordFind', { keyword });
            const placesFromDb = Array.isArray(response.data) ? response.data : [];

            if (map) {
                let currentClusterer = clusterer;
                if (currentClusterer) {
                    currentClusterer.clear(); // 기존 마커들을 삭제합니다
                } else {
                    currentClusterer = createClusterer(map); // 클러스터러를 생성합니다
                }
                loadMarkers(placesFromDb, currentClusterer);
            }
            setDbPlaces(placesFromDb);
        } catch (error) {
            console.error('Error fetching places from database', error);
        }
        map.setLevel(12);
        map.setCenter(new kakao.maps.LatLng(36.5, 127.5));
        setRecruitInfo(false);
    };

    // KakaoMap이 처음 로드 될 때, 데이터를 불러 올 함수
    const fetchInitialPlaces = async (map) => {
        try {
            // 비동기를 이용해, SpringBoot 서버에  URL을 요청
            const response = await axios.post('http://localhost:8080/api/RDload');
            // Array.isArray : 값이 배열인지 확인
            // 배열이라면 response.data를 반환하고, 아니라면 빈 배열을 반환함
            const placesFromDb = Array.isArray(response.data) ? response.data : [];

            // KakaoMap이 존재 한다면,
            if (map) {
                let currentClusterer = clusterer; // 클러스터러를 변수에 할당

                // 클러스터러가 중복으로 생성되지않기 위해 사용
                if (currentClusterer) {
                    // 기존에 클러스터러가 있다면, 클러스터러의 마커 초기화
                    currentClusterer.clear();
                } else {
                    currentClusterer = createClusterer(map); // 없다면, 클러스터러 생성
                }
                loadMarkers(placesFromDb, currentClusterer); // 값들을 가지고 마커를 생성
            }
            setDbPlaces(placesFromDb); // 채용공고 리스트에 출력할 데이터 저장
            setLoading(false); // 로딩화면 제거
        } catch (error) {
            // 서버가 실행되지 않았을 경우,
            Swal.fire({
                title: '서버를 확인해 주세요',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    };

    return (
        <div div className='kakaoMap' id="map">
            {loading && ( // 로딩 중일 때 스피너 표시
                <div id='loading'>
                    <GridLoader color="#A7E6FF" loading={loading} />
                </div>
            )}
            <div className='mapInfo'>
                <div className="searchBox">
                    <div className='searchInput'>
                        <input value={keyword} onChange={handleChange} placeholder="장소를 검색하세요." id="keyword" size="15" />
                        <button type='button' onClick={searchPlaces}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="faMagnifyingGlass" />
                        </button>
                    </div>

                    <div className="filterOptions">
                        <button type='button' onClick={toggleCheckboxes}>
                            <FontAwesomeIcon icon={faSliders} className="faSlidersIcon" />
                        </button>
                    </div>

                    <RecruitList
                        showCluster={showCluster}
                        clusterMarkers={clusterMarkers}
                        dbPlaces={dbPlaces}
                        handlePlaceClick={handlePlaceClick}
                    />
                </div>
            </div>
            {recruitInfo && selectedPlace && (
                <RecruitInfo
                    selectedPlace={selectedPlace}
                    setRecruitInfo={setRecruitInfo}
                    setSelectedPlace={setSelectedPlace}
                />
            )}

            {/* showCheckboxes 상태가 true일 때만 체크박스 옵션을 표시합니다 */}
            {showCheckboxes && (
                <FilterModal
                    toggleCheckboxes={toggleCheckboxes}
                    selectedOptions={selectedOptions}
                    handleCheckboxChange={handleCheckboxChange}
                    RDcategoryFind={RDcategoryFind}
                    setSelectedOptions={setSelectedOptions}
                />
            )}

            {/* 차트를 그리는 영역 */}
            {showChart ? (
                <ChartPanel
                    setShowChart={setShowChart}
                    barChartData={barChartData}
                    jobChartData={jobChartData}
                />
            ) : (
                <MapControls map={map} setRecruitInfo={setRecruitInfo} />
            )};
        </div>
    );
};

export default KakaoMap;