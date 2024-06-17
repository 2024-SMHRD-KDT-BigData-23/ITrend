/* global kakao */
import React, { useState, useEffect } from 'react';
import "./KakaoMap.css";
import RecruitInfo from './kakaoComponent/RecruitInfo';
import RecruitList from './kakaoComponent/RecruitList';
import MapControls from './kakaoComponent/MapControls';
import ChartPanel from './kakaoComponent/ChartPanel';
import FilterModal from './kakaoComponent/FilterModal';
import axios from 'axios';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import { GridLoader } from 'react-spinners'; 

const KakaoMap = () => {
    const [keyword, setKeyword] = useState(''); // 검색어 상태 관리
    const [map, setMap] = useState(null); // 지도 객체 상태 관리
    const [kakaoLoaded, setKakaoLoaded] = useState(false); // Kakao API 로드 상태 관리
    const [dbPlaces, setDbPlaces] = useState([]);
    const [clusterer, setClusterer] = useState(null);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // 체크박스 옵션을 보여줄지 여부를 관리하는 상태 변수
    const [showCluster, setShowCluster] = useState(false); // 클러스터 클릭시 클러스터의 정보를 보여주기 위한 상태 관리 변수
    const [clusterMarkers, setClusterMarkers] = useState([]); // 클러스터 안의 마커 정보를 관리하는 상태
    const [recruitInfo, setRecruitInfo] = useState(false); // 채용정보를 출력을 담당하는 변수
    const [selectedPlace, setSelectedPlace] = useState(null); // 클릭한 공고의 채용정보를 저장할 변수
    const [showChart, setShowChart] = useState(false);
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] }); // 클러스터러를 클릭 할 경우, bar chart의 skills 목록을 변경하기 위한 옵션
    const [jobChartData, setJobChartData] = useState({ labels: [], datasets: [] }); // 클러스터러를 클릭 할 경우, bar chart의 job 목록을 변경하기 위한 옵션
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedOptions(prevState =>
            checked ? [...prevState, name] : prevState.filter(option => option !== name)
        );
    };

    // 필터의 초기화버튼 클릭시 체크된 체크박스 초기화
    const handleReset = () => {
        setSelectedOptions([]);
    };

    // 검색어 입력 시 상태 업데이트
    const handleChange = (e) => {
        setKeyword(e.target.value);
    };


    // 차트의 데이터를 생성하는 함수
    // markerInfos: 마커 정보 배열
    // key: 추출할 항목의 키 (예: 'skills' 또는 'job')
    // topN: 상위 몇 개의 항목을 추출할지 설정
    const extractTopItems = (markerInfos, key, topN) => {
        // 중복된 항목을 제거하기 위해 Set을 사용
        const itemSet = new Set();

        // 마커 정보 배열을 순회하며 key에 해당하는 값을 추출하여 Set에 추가
        markerInfos.forEach(info => {
            if (info[key]) {
                info[key].split(', ').forEach(item => itemSet.add(item));
            }
        });

        // Set 객체를 배열로 변환
        const itemArray = Array.from(itemSet);

        // 각 항목의 등장 횟수를 계산
        const itemCount = itemArray.map(item => ({
            item: item,
            count: markerInfos.filter(info => info[key] && info[key].includes(item)).length
        }));

        // 등장 횟수에 따라 내림차순으로 정렬
        itemCount.sort((a, b) => b.count - a.count);

        // 상위 topN 개의 항목을 반환
        return itemCount.slice(0, topN);
    };

    // 클러스터 클릭 이벤트 핸들러
    const handleClusterClick = (cluster) => {
        // 클러스터에 포함된 마커들을 가져옴
        const markers = cluster.getMarkers();
        // 각 마커의 placeInfo를 추출하여 배열 생성
        const markerInfos = markers.map(marker => marker.placeInfo);

        // 상태 업데이트: 클러스터 정보를 보여주고 차트를 표시, 채용정보는 숨김
        setShowCluster(true);
        setShowChart(true);
        setRecruitInfo(false);
        // 클러스터 안의 마커 정보를 상태로 저장
        setClusterMarkers(markerInfos);

        // 상위 10개의 skills 항목을 추출
        const topSkills = extractTopItems(markerInfos, 'skills', 10);
        // skills 데이터를 바 차트 데이터 형식으로 변환
        const newBarChartData = {
            labels: topSkills.map(item => item.item), // 차트 라벨 설정
            datasets: [
                {
                    data: topSkills.map(item => item.count), // 데이터 값 설정
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                }
            ],
        };
        // 바 차트 데이터 상태 업데이트
        setBarChartData(newBarChartData);

        // 상위 10개의 job 항목을 추출
        const topJobs = extractTopItems(markerInfos, 'job', 10);
        // job 데이터를 바 차트 데이터 형식으로 변환
        const newJobChartData = {
            labels: topJobs.map(item => item.item), // 차트 라벨 설정
            datasets: [
                {
                    data: topJobs.map(item => item.count), // 데이터 값 설정
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                }
            ],
        };
        // 직무 차트 데이터 상태 업데이트
        setJobChartData(newJobChartData);
    };

    // 체크박스 보여주기
    const toggleCheckboxes = () => {
        setShowCheckboxes(prevState => !prevState);
    };

    const createClusterer = (map) => {
        const cluster = new kakao.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
            gridSize: 60, // 클러스터의 격자 크기. 화면 픽셀 단위이며 해당 격자 영역 안에 마커가 포함되면 클러스터에 포함시킨다 (default : 60)
            minLevel: 2, // 클러스터 할 최소 지도 레벨
            minClusterSize: 3, // 클러스터링 할 최소 마커 수 (default: 2)
            disableClickZoom: true // 클러스터 클릭 시 지도 확대 여부. true로 설정하면 클러스터 클릭 시 확대 되지 않는다 (default: false)
        });
        setClusterer(cluster); // 클러스터 상태 업데이트
        return cluster;
    };

    const loadMarkers = (dbPlaces, clusterer) => {
        const markers = dbPlaces.map(dbPlace => {
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(dbPlace.latitude, dbPlace.longitude)
            });
            const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
            marker.placeInfo = dbPlace; // 마커 객체에 장소 정보를 추가
            kakao.maps.event.addListener(marker, 'mouseover', () => {
                displayInfowindow(marker, dbPlace.name, infowindow);
            });

            kakao.maps.event.addListener(marker, 'mouseout', () => {
                infowindow.close();
            });
            return marker;
        });
        clusterer.addMarkers(markers); // 클러스터러에 마커들을 추가합니다
        // 클러스터러 이벤트 리스너 추가
        kakao.maps.event.addListener(clusterer, 'clusterclick', handleClusterClick);
        console.log(dbPlaces)
    };

    // 인포윈도우에 장소명을 표시하는 함수
    const displayInfowindow = (marker, title, infowindow) => {
        const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
        infowindow.setContent(content);
        infowindow.open(map, marker);
    };

    const RDcategoryFind = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/RDcategoryFind', selectedOptions)
            const placesFromDb = Array.isArray(response.data) ? response.data : [];
            const uniquePlaces = _.uniqBy(placesFromDb, 'title');
            if (map) {
                let currentClusterer = clusterer;
                if (currentClusterer) {
                    currentClusterer.clear(); // 기존 마커들을 삭제합니다
                } else {
                    currentClusterer = createClusterer(map); // 클러스터러를 생성합니다
                }
                loadMarkers(uniquePlaces, currentClusterer);
            }

            setDbPlaces(uniquePlaces);
            setShowCheckboxes(false);
            map.setLevel(12);
        } catch (error) {
            console.error('Error fetching places from database', error);
        }
    };

    // 키워드로 장소를 검색하는 함수
    const searchPlaces = async (e) => {
        e.preventDefault();
        setRecruitInfo(false);
        if (!keyword.trim()) {
            alert('검색어를 입력해주세요!');
            return;
        }

        if (!kakaoLoaded) {
            alert('Kakao Maps API is not loaded yet.');
            return;
        }
        map.setLevel(12);
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
    };

    const fetchInitialPlaces = async (map) => {

        try {
            const response = await axios.post('http://localhost:8080/api/RDload');
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
            setLoading(false);
        } catch (error) {
            console.error('Error fetching places from database', error);
        }
    };

    // 장소 목록을 클릭했을 때 해당 장소로 이동하는 함수
    const handlePlaceClick = (place) => {
        const placeLongitude = parseFloat(place.longitude);
        const updatedLongitude = placeLongitude - 0.0014;
        const placePosition = new kakao.maps.LatLng(place.latitude, updatedLongitude);
        console.log(place.longitude);
        console.log(placePosition);
        map.setCenter(placePosition);
        map.setLevel(1); // 지도의 확대 레벨을 1로 설정
        setSelectedPlace(place); // 선택된 장소 정보 설정
        setRecruitInfo(true); // 장소 클릭 시 recruitInfo 상태를 true로 설정
        setShowChart(false); // 차트를 미출력
    };

    // 지도 생성 함수
    const initMap = () => {

        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new kakao.maps.LatLng(36.5, 127.5), // 남한 중심 좌표
            level: 12, // 지도의 확대 레벨 (1: 가장 확대, 14: 가장 축소)
            maxLevel: 12
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        // 맵에 줌 레벨 추가하기ㄴ
        // const zoomControl = new kakao.maps.ZoomControl();
        // map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


        setMap(map); // map 상태 업데이트

        return map;
    };

    // 컴포넌트가 처음 렌더링될 때 지도 생성 및 초기 데이터 로드
    useEffect(() => {

        if (document.getElementById('kakao-map-script')) {
            setKakaoLoaded(true);
            const map = initMap();
            fetchInitialPlaces(map); // Initial places fetch
            return;
        }

        // Load Kakao Maps API script dynamically
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`;
        script.onload = () => {
            kakao.maps.load(() => {
                setKakaoLoaded(true);
                const map = initMap();
                fetchInitialPlaces(map); // Initial places fetch
            });
        };
        document.head.appendChild(script);

        // Clean up function
        return () => {
            // Remove the dynamically added script when the component unmounts
            if (document.getElementById('kakao-map-script')) {
                document.head.removeChild(script);
            }
        };
    }, []); // Empty dependency array to ensure it runs only once

    return (
        <div div className='kakaoMap' id="map">
            {loading && ( // 로딩 중일 때 스피너 표시
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'absolute', width: '100%', zIndex: 100, background: 'rgba(255, 255, 255, 0.7)' }}>
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
            )
            }

            {/* showCheckboxes 상태가 true일 때만 체크박스 옵션을 표시합니다 */}
            {showCheckboxes && (
                <FilterModal
                    toggleCheckboxes={toggleCheckboxes}
                    selectedOptions={selectedOptions}
                    handleCheckboxChange={handleCheckboxChange}
                    handleReset={handleReset}
                    RDcategoryFind={RDcategoryFind}
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
                <MapControls map={map} />
            )
            };
        </div>
    );
};

export default KakaoMap;