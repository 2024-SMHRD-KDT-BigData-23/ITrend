/* global kakao */
import React, { useState, useEffect } from 'react';
import "./KakaoMap.css";
import RecruitInfo from './kakaoComponent/RecruitInfo';
import RecruitList from './kakaoComponent/RecruitList';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

// Chart.js의 구성 요소를 등록합니다.
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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

    const [currentOptions, setCurrentOptions] = useState({});// 현재 필터옵션을 저장할 변수
    const [selectedOptions, setSelectedOptions] = useState([]);


    const handleSkillsClick = () => {
        setCurrentOptions(skillsOptions);
    };

    const handleJobClick = () => {
        setCurrentOptions(jobOptions);
    };

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

    // 검색 필터 목록
    const skillsOptions = {
        "Back-end": [
            "Python", "Java", "C", "C++", "C#", "Perl", "PHP", "Ruby", "Scala", "Solidity", "VisualBasic", ".NET",
            "ABAP", "ASP", "ASP.NET", "Flask", "GoLang", "GraphQL", "JPA", "JSP", "Kafka", "LabVIEW", "MyBatis",
            "Node_js", "Spring", "SpringBoot", "Struts", "Vert.x", "Docker", "Eclipse", "GCP", "Git", "Jenkins",
            "Linux", "MacOS", "MariaDB", "MongoDB", "MSSQL", "MySQL", "PostgreSQL", "Pro-C", "Redis", "SVN",
            "Sybase", "Tomcat", "Ubuntu", "Unix", "Windows"
        ],
        "Front-end": [
            "JavaScript", "TypeScript", "Kotlin", "Swift", "Objective_C", "Angular", "Flutter", "Ionic", "jQuery",
            "OpenGL", "Qt", "React", "React Native", "Redux", "Unity", "Unreal", "Vue.js", "WebGL", "Webpack",
            "Next_js"
        ],
        "Data&AI": [
            "R", "SAS", "SPSS", "PyTorch", "Django", "TensorFlow", "Keras", "Pandas", "Spark", "Hadoop", "Kubernetes",
            "Logstash", "Lucene", "Maven", "OpenCV", "Elasticsearch", "HBase", "AI", "neural", "Deep Learning",
            "Machine Learning", "bigdata", "data_analysis", "NoSQL", "DB", "SAP", "data_labeling", "data_mining",
            "data_visualization", "DW", "ETL", "RDBMS", "text_mining", "DBMS"
        ]
    };
    const jobOptions = {
        "개발": [
            "CTO", "DBA", "ERP", "iOS개발", "QA",
            "VR엔지니어", "게임개발", "기술지원", "네트워크/보안/운영", "백엔드개발",
            "소프트웨어개발", "소프트웨어아키텍트", "안드로이드개발", "웹개발", "웹퍼블리셔",
            "클라우드개발", "프론트엔드개발", "하드웨어개발"
        ],
        "데이터": [
            "BI엔지니어", "데이터분석가", "데이터사이언티스트", "데이터엔지니어", "머신러닝엔지니어",
            "빅데이터엔지니어"
        ],
        "디자인": [
            "UI/UX/GUI디자인", "웹디자인"
        ]
    };

    // 클러스터 클릭 이벤트 핸들러 함수
    const handleClusterClick = (cluster) => {
        const markers = cluster.getMarkers(); // 클러스터에 포함된 마커들을 가져옵니다
        console.log('Cluster clicked:', cluster);
        console.log('Markers in cluster:', markers);
        // 각 마커의 정보를 출력
        setShowCluster(true);
        setShowChart(true); // 차트를 출력
        setRecruitInfo(false); // 채용정보를 출력여부를 false로
        const markerInfos = markers.map(marker => marker.placeInfo); // marker.place를 marker.placeInfo로 변경
        setClusterMarkers(markerInfos);


        // 클러스터 내부의 모든 마커들의 skills 목록을 추출
        // handleClusterClick 함수 내에서 각 마커의 placeInfo.skills를 추출하고,
        // Set을 사용하여 중복되지 않은 skills 목록을 생성합니다
        const skillsSet = new Set();
        markerInfos.forEach(info => {
            if (info.skills) {
                info.skills.split(', ').forEach(skill => skillsSet.add(skill));
            }
        });

        // 중복되지 않은 스킬 리스트 생성
        // Set 객체를 배열로 변환합니다. 이는 차트의 라벨로 사용하기 위해 필요합니다.
        const skillsArray = Array.from(skillsSet);


        // skillsArray.map 메소드는 배열의 각 요소에 대해 주어진 함수를 호출하고,
        //  그 결과를 새로운 배열로 반환합니다.
        // 결과는 skill로 매핑 된다.
        // skill은 skill, count라는 두개의 속성을 가진다.
        const skillsCount = skillsArray.map(skill => ({
            skill: skill,

            // markerInfos 배열의 각 요소(info)를 순회합니다.
            // filter 메소드는 주어진 조건을 만족하는 요소들만을 포함하는 새로운 배열을 반환합니다.
            // info.skills가 존재하고, 해당 skills 문자열에 현재의 skill이 포함되어 있는지 확인합니다.
            // 조건을 만족하는 요소들만을 포함하는 배열이 생성되며, 이 배열의 길이(length)가 현재 skill의 등장 횟수입니다.
            // 이 값을 count 속성으로 설정하여 객체를 생성합니다.
            count: markerInfos.filter(info => info.skills && info.skills.includes(skill)).length
        }));

        // skillsCount 배열을 sort 메소드를 사용하여 정렬합니다.
        // sort 메소드는 배열을 제자리에서 정렬하며, 원본 배열을 수정합니다.
        // sort 메소드는 비교 함수를 인수로 받아 두 요소를 비교합니다
        // b.count - a.count는 두 요소의 count 속성을 비교합니다
        // b.count - a.count가 양수인 경우, b가 a보다 앞에 와야 함을 의미합니다. 즉, 내림차순으로 정렬됩니다.
        // b.count - a.count가 음수인 경우, a가 b보다 앞에 와야 함을 의미합니다.
        // b.count - a.count가 0인 경우, 순서가 변경되지 않습니다.
        // sort는 전체 배열을 검사한다.
        skillsCount.sort((a, b) => b.count - a.count);

        // slice 메소드는 배열의 일부를 추출하여 새로운 배열을 반환합니다.
        // slice 메소드는 두 개의 인수를 받을 수 있습니다: 시작 인덱스와 끝 인덱스 (끝 인덱스는 포함되지 않습니다).
        const topSkills = skillsCount.slice(0, 10);


        //  차트 데이터를 업데이트
        const newBarChartData = {
            // 추출한 skillsArray를 차트의 라벨로 설정합니다
            labels: topSkills.map(item => item.skill),
            // datasets: 데이터셋의 data 필드에는 각 스킬이 얼마나 자주 등장하는지 계산한 값을 배열로 설정합니다. 
            // 이를 위해 skillsArray를 반복하면서, 
            // 각 스킬이 마커 정보에서 몇 번 등장하는지 필터링하여 그 수를 계산합니다.
            datasets: [
                {
                    data: topSkills.map(item => item.count),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };
        //  상태 업데이트
        setBarChartData(newBarChartData);
        console.log("라벨데이터", skillsArray);
        console.log("차트 데이터셋", newBarChartData);

        const jobSet = new Set();
        markerInfos.forEach(info => {
            if (info.job) {
                info.job.split(', ').forEach(job => jobSet.add(job));
            }
        });

        const jobArray = Array.from(jobSet);
        const jobCount = jobArray.map(job => ({
            job: job,
            count: markerInfos.filter(info => info.job && info.job.includes(job)).length
        }));

        // 상위 5개 데이터로 제한
        jobCount.sort((a, b) => b.count - a.count);
        const topJobs = jobCount.slice(0, 10);


        const newJobChartData = {
            labels: topJobs.map(item => item.job),
            datasets: [
                {
                    data: topJobs.map(item => item.count),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                }
            ],
        };
        setJobChartData(newJobChartData);


    };

    // 체크박스 보여주기
    const toggleCheckboxes = () => {
        setShowCheckboxes(prevState => !prevState);
        setCurrentOptions(skillsOptions);
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

    // // 지도 타입을 변경하는 함수
    // const setMapType = (maptype) => {
    //     if (maptype === 'roadmap') {
    //         map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    //     } else {
    //         map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
    //     }
    // };

    // 지도를 확대하는 함수
    const zoomIn = () => {
        map.setLevel(map.getLevel() - 1);
    };

    // 지도를 축소하는 함수
    const zoomOut = () => {
        map.setLevel(map.getLevel() + 1);
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
        } catch (error) {
            console.error('Error fetching places from database', error);
        }
    };

    // 장소 목록을 클릭했을 때 해당 장소로 이동하는 함수
    const handlePlaceClick = (place) => {
        const placePosition = new kakao.maps.LatLng(place.latitude, place.longitude);
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
        // Load Kakao Maps API script dynamically
        const script = document.createElement('script');
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
            document.head.removeChild(script);
        };
    }, []); // Empty dependency array to ensure it runs only once


    // 차트의 라벨 길이 조절하기
    const truncateLabel = (label) => {
        const maxLabelLength = 3;
        if (label.length > maxLabelLength) {
            return label.substr(0, maxLabelLength) + '...';
        }
        return label.padEnd(maxLabelLength + 3); // 3 for '...'
    };
    // 차트 그리기
    const barChartOptions = {
        indexAxis: 'y', // 수평 막대 차트로 설정
        elements: {
            bar: {
                borderWidth: 2, // 막대 테두리 두께
            },
        },
        responsive: true, // 반응형 설정
        maintainAspectRatio: false, // 비율 유지하지 않음
        plugins: {
            legend: {
                display: false, // 범례 위치
            },
            title: {
                display: true, // 제목 표시
                text: '기술 스택', // 제목 텍스트
                font: {
                    size: 20, // 글꼴 크기
                    family: 'Arial', // 글꼴 가족
                    weight: 'bold', // 글꼴 굵기
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        const label = this.getLabelForValue(value);
                        return truncateLabel(label);
                    }
                }
            }
        }
    };


    const jobChartOptions = {
        indexAxis: 'y', // 수평 막대 차트로 설정
        elements: {
            bar: {
                borderWidth: 1, // 막대 테두리 두께
            },
        },
        responsive: true, // 반응형 설정
        maintainAspectRatio: false, // 비율 유지하지 않음
        plugins: {
            legend: {
                display: false, // 범례 위치
            },
            title: {
                display: true, // 제목 표시
                text: '직무', // 제목 텍스트
                position: 'top', // 제목 위치 (가능한 값: 'top', 'left', 'bottom', 'right')
                font: {
                    size: 20, // 글꼴 크기
                    family: 'Arial', // 글꼴 가족
                    weight: 'bold', // 글꼴 굵기
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        const label = this.getLabelForValue(value);
                        return truncateLabel(label);
                    }
                }
            }
        }
    };

    const openUrl = (url) => {
        // URL이 http:// 또는 https://로 시작하지 않는 경우 http://를 추가
        if (!/^https?:\/\//i.test(url)) {
            url = `http://${url}`;
        }
        window.open(url, '_blank', 'noopener noreferrer');
    };


    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div div className='kakaoMap' id="map">
                <div className='mapInfo' style={{ position: "relative", backgroundColor: "white", width: '400px', height: "100%", zIndex: 10 }}>
                    <div className="searchBox" style={{ height: "90px", width: "100%", position: 'relative', backgroundColor: 'white', padding: "5px" }}>
                        <div className='sarchInput' style={{ width: "100%", height: "60%", border: "2px solid #A7E6FF" }}>
                            <input value={keyword} onChange={handleChange} placeholder="장소를 검색하세요." id="keyword" size="15" style={{ border: "none", width: "80%", height: "100%", paddingLeft: "10px" }} />
                            <button type='button' onClick={searchPlaces} style={{ border: "none", borderLeft: "1px solid #A7E6FF", background: "none", width: "20%", height: "100%" }}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#A7E6FF" }} />
                            </button>
                        </div>

                        <div className="filterOptions" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px' }}>
                            <button type='button' onClick={toggleCheckboxes} style={{ border: "none" }}>
                                <FontAwesomeIcon icon={faSliders} style={{ color: "#6a6774" }} />
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
                        openUrl={openUrl}
                    />
                )
                }

                {/* showCheckboxes 상태가 true일 때만 체크박스 옵션을 표시합니다 */}
                {showCheckboxes && (
                    // showCheckboxes가 true일 때만 렌더링
                    <div className="modal-overlay" onClick={toggleCheckboxes}>
                        {/* 모달 외부 영역 클릭 시 toggleCheckboxes 호출 */}
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            {/* 모달 내부 클릭 시 이벤트 전파 방지 */}
                            <div style={{ height: "400px", display: 'flex', flexDirection: 'column' }}>
                                <div className='optionSpace' style={{ display: "flex", height: "30px" }}>
                                    <button type='button' onClick={handleSkillsClick}>
                                        기술스택
                                    </button>
                                    <button type='button' onClick={handleJobClick}>
                                        직무
                                    </button>
                                </div>
                                <div className='checkBoxSpace' style={{ flexGrow: 1, overflowY: 'auto', marginBottom: "10px", marginTop: "10px" }}>
                                    {Object.keys(currentOptions).map(category => (
                                        <div key={category} style={{ marginBottom: '10px' }}>
                                            <strong>{category}</strong>
                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {currentOptions[category].map(option => (
                                                    <label key={option} htmlFor={option} style={{ display: 'flex', alignItems: 'center', marginRight: '10px', width: '30%' }}>
                                                        <input
                                                            type="checkbox"
                                                            id={option}
                                                            name={option}
                                                            checked={selectedOptions.includes(option)}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <span style={{ marginLeft: '5px' }}>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-button" style={{ display: 'flex', justifyContent: 'flex-end', height: "30px" }}>
                                    {/* 카테고리 검색 버튼, 클릭 시 RDcategoryFind 함수 호출 */}
                                    <button type='button' onClick={handleReset} style={{ width: "10%", height: "100%", fontSize: "12px" }}>초기화</button>
                                    <button onClick={RDcategoryFind} type="button" style={{ width: '10%', height: '100%', marginLeft: "10px", fontSize: "12px" }}>
                                        검색
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                )}

                {/* 차트를 그리는 영역 */}
                {showChart ? (
                    <div className='chartSpace' style={{ display: "flex", position: "absolute", width: "25%", height: '100%', zIndex: 10, top: "0px", right: '0px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: "50px" }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type='button' onClick={() => {
                                    setShowChart(false);
                                }} style={{
                                    width: "30px", height: "30px"
                                }}>X</button>
                            </div>
                            <button style={{ marginTop: "10px", justifyContent: 'center' }} id="ZoomInBtn" onClick={zoomIn}>
                                <FontAwesomeIcon icon={faPlus} className='icon' />
                            </button>
                            <button style={{ marginTop: "10px", justifyContent: 'center' }} id="ZoomOutBtn" onClick={zoomOut}>
                                <FontAwesomeIcon icon={faMinus} className='icon' />
                            </button>
                        </div>
                        <div className="barChart" style={{ flexGrow: 1, height: '100%', position: 'relative', backgroundColor: 'white', padding: "5px", right: "0px" }}>
                            <div style={{ borderBottom: '1px solid', height: '50%' }}>
                                <Bar options={barChartOptions} data={barChartData} />
                            </div>
                            <div style={{ height: '50%' }}>
                                <Bar options={jobChartOptions} data={jobChartData} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mapStyle">
                        <button type='button' id="ZoomInBtn" onClick={zoomIn}>
                            <FontAwesomeIcon icon={faPlus} className='icon' />
                        </button>
                        <button type='button' id="ZoomOutBtn" onClick={zoomOut}>
                            <FontAwesomeIcon icon={faMinus} className='icon' />
                        </button>
                        <br></br>
                        <button type='button' id="mapBtn" onClick={() => {
                            map.setLevel(12);
                        }}>초기화면</button>
                    </div>)
                };
            </div>
        </div >
    );
};

export default KakaoMap;