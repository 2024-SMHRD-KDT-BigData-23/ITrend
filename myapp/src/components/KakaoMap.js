/* global kakao */
import React, { useState, useEffect } from 'react';
import "../KakaoMap.css";
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
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 체크박스 리스트
    const [showCluster, setShowCluster] = useState(false); // 클러스터 클릭시 클러스터의 정보를 보여주기 위한 상태 관리 변수
    const [clusterMarkers, setClusterMarkers] = useState([]); // 클러스터 안의 마커 정보를 관리하는 상태
    const [checkedCategory, setcheckedCategory] = useState([]);
    const [recruitInfo, setRecruitInfo] = useState(false); // 채용정보를 출력을 담당하는 변수
    const [selectedPlace, setSelectedPlace] = useState(null); // 클릭한 공고의 채용정보를 저장할 변수
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] }); // 클러스터러를 클릭 할 경우, bar chart의 skills 목록을 변경하기 위한 옵션
    const [jobChartData, setJobChartData] = useState({ labels: [], datasets: [] }); // 클러스터러를 클릭 할 경우, bar chart의 job 목록을 변경하기 위한 옵션


    // 검색어 입력 시 상태 업데이트
    const handleChange = (e) => {
        setKeyword(e.target.value);
    };

    // 검색 필터 목록
    const options = {
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

    // 클러스터 클릭 이벤트 핸들러 함수
    const handleClusterClick = (cluster) => {
        const markers = cluster.getMarkers(); // 클러스터에 포함된 마커들을 가져옵니다
        console.log('Cluster clicked:', cluster);
        console.log('Markers in cluster:', markers);
        // 각 마커의 정보를 출력
        setShowCluster(true);
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
        const topSkills = skillsCount.slice(0, 5);


        //  차트 데이터를 업데이트
        const newBarChartData = {
            // 추출한 skillsArray를 차트의 라벨로 설정합니다
            labels: topSkills.map(item => item.skill),
            // datasets: 데이터셋의 data 필드에는 각 스킬이 얼마나 자주 등장하는지 계산한 값을 배열로 설정합니다. 
            // 이를 위해 skillsArray를 반복하면서, 
            // 각 스킬이 마커 정보에서 몇 번 등장하는지 필터링하여 그 수를 계산합니다.
            datasets: [
                {
                    label: 'Number of Positions',
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
        const topJobs = jobCount.slice(0, 5);


        const newJobChartData = {
            labels: topJobs.map(item => item.job),
            datasets: [
                {
                    label: 'Number of Positions',
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
    };
    // 체크박스 상태 변경 시 호출되는 함수`
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedOptions(prevState => {
            if (checked) {
                setcheckedCategory([...checkedCategory, name]);
                return [...prevState, name]; // 체크된 경우 리스트에 추가
            } else {
                setcheckedCategory(checkedCategory.filter(option => option !== name));
                return prevState.filter(option => option !== name); // 체크 해제된 경우 리스트에서 제거
            }
        });
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

    // 지도 타입을 변경하는 함수
    const setMapType = (maptype) => {
        if (maptype === 'roadmap') {
            map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        } else {
            map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
        }
    };

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
            const response = await axios.post('http://localhost:8080/api/RDcategoryFind', checkedCategory)
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

    // 차트 그리기
    const barChartOptions = {
        indexAxis: 'y', // 수평 막대 차트로 설정
        elements: {
            bar: {
                borderWidth: 2, // 막대 테두리 두께
            },
        },
        responsive: true, // 반응형 설정
        plugins: {
            legend: {
                position: 'right', // 범례 위치
            },
            title: {
                display: true, // 제목 표시
                text: '기술 스택', // 제목 텍스트
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div className='kakaoMap' id="map">
                <div className="search-box" style={{ width: "300px", position: 'relative', top: '10px', left: '10px', zIndex: 10, backgroundColor: 'white', borderRadius: '5px' }}>
                    <form onSubmit={searchPlaces}>
                        <div>
                            {/* 옵션 버튼을 클릭하면 체크박스 옵션들을 보여줍니다. 클릭시 showCheckBoxes의 옵션이 true가 됩니다.*/}
                            <input type="text" value={keyword} onChange={handleChange} placeholder="장소를 검색하세요." id="keyword" size="15" style={{ width: '260px', height: '30px' }} />
                            <button type="submit" style={{ width: '30px', height: '30px' }}>검
                            </button>
                        </div>
                        <button type='button' onClick={toggleCheckboxes} style={{ width: '50px', height: '25px' }}>옵션</button>
                    </form>
                </div>

                <div style={{ display: 'flex', width: '40%', height: '100%', paddingLeft: '10px', paddingTop: '30px' }}>
                    <div style={{ width: "300px", position: 'relative', left: '10px', zIndex: 10, backgroundColor: 'white', borderRadius: '5px', maxHeight: '700px' }}>
                        {showCluster ? (
                            <div id="cluster_menu_wrap" className="bg_white" style={{ maxHeight: '700px', overflowY: 'auto', backgroundColor: 'white' }}>
                                <ul id="clusterPlacesList">
                                    {clusterMarkers.map((place, index) => (
                                        <li key={index} className="item" onClick={() => handlePlaceClick(place)}>
                                            <span className={`markerbg marker_${index + 1}`}><h3>{place.name}</h3></span>
                                            <div className="info" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                <span>{place.address}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            dbPlaces.length > 0 && (
                                <div id="db_menu_wrap" className="bg_white" style={{ maxHeight: '700px', overflowY: 'auto', backgroundColor: 'white' }}>
                                    <ul id="dbPlacesList">
                                        {dbPlaces.map((place, index) => (
                                            <li key={index} className="item" onClick={() => handlePlaceClick(place)}>
                                                <span className={`markerbg marker_${index + 1}`}><h3>{place.title}</h3></span>
                                                <div className="info" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <span>{place.address}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>

                    {recruitInfo && selectedPlace && (
                        <div style={{ display: 'flex' }}>
                            {/* width: "300px", position: 'relative', left: '10px', zIndex: 10, backgroundColor: 'white', borderRadius: '5px', maxHeight: '700px' */}
                            <div className="tempRecruitInfo" style={{ position: 'relative', maxHeight: '700px', padding: '0 10px', width: '500px', backgroundColor: 'white', zIndex: 10, border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', marginLeft: '10px', overflowY: 'auto' }}>
                                <div className="tempRecruitHead" style={{ borderBottom: '2px solid #000' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline' }}>Recruit Information</span>
                                </div>
                                <div className='tempRcruitNeck' style={{ height: '10px', backgroundColor: "green" }}></div>
                                <div className='tempRecruitBody' style={{ border: '1px solid', marginTop: '5px', padding: "5px" }}>
                                <p><strong>Region:</strong> {selectedPlace.title}</p>
                                    < p > <strong>Name:</strong> {selectedPlace.name}</p>
                                    <p><strong>Region:</strong> {selectedPlace.region}</p>
                                    <p><strong>Job:</strong> {selectedPlace.job}</p>
                                    <p><strong>Carrer:</strong> {selectedPlace.carrer}</p>
                                    <p><strong>Skills:</strong> {selectedPlace.skills}</p>
                                    <p><strong>Info:</strong> {selectedPlace.info}</p>
                                    <p><strong>Work:</strong> {selectedPlace.work}</p>
                                    <p><strong>License:</strong> {selectedPlace.license}</p>
                                    <p><strong>Preference:</strong> {selectedPlace.preference}</p>
                                    <p><strong>Job Process:</strong> {selectedPlace.job_process}</p>
                                    <p><strong>Address:</strong> {selectedPlace.address}</p>
                                    <p><strong>Deadline:</strong> {selectedPlace.deadline_at}</p>
                                    <p><strong>Latitude:</strong> {selectedPlace.latitude}</p>
                                    <p><strong>Longitude:</strong> {selectedPlace.longitude}</p>
                                </div>
                            </div>
                            <button style={{ width: "30px", height: "30px", backgroundColor: 'white', zIndex: 10, border: '1px solid #ccc' }} onClick={() => {
                                setRecruitInfo(false);
                                setSelectedPlace(null);
                            }}>X</button>
                        </div>
                    )}
                </div>

                {/* showCheckboxes 상태가 true일 때만 체크박스 옵션을 표시합니다 */}
                {
                    showCheckboxes && (
                        // showCheckboxes가 true일 때만 렌더링
                        <div className="modal-overlay" onClick={toggleCheckboxes}>
                            {/* 모달 외부 영역 클릭 시 toggleCheckboxes 호출 */}
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                {/* 모달 내부 클릭 시 이벤트 전파 방지 */}
                                {Object.keys(options).map(category => (
                                    // 각 카테고리에 대해 반복
                                    <div key={category} style={{ marginBottom: '10px' }}>
                                        <strong>{category}</strong>
                                        {/* 카테고리 이름을 굵게 표시 */}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {/* 카테고리 내의 옵션들을 3개씩 나누어 행으로 정렬 */}
                                            {Array.from({ length: Math.ceil(options[category].length / 3) }, (_, rowIndex) => (
                                                <div key={rowIndex} style={{ display: 'flex' }}>
                                                    {/* 각 행에 3개의 옵션을 포함 */}
                                                    {options[category].slice(rowIndex * 3, rowIndex * 3 + 3).map(option => {
                                                        const optionId = `option-${option}`;
                                                        return (
                                                            <label key={option} htmlFor={optionId} style={{ display: 'flex', alignItems: 'center', marginRight: '10px', width: '150px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={optionId}
                                                                    name={option}
                                                                    checked={selectedOptions.includes(option)}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                {/* 체크박스 상태가 변경될 때 handleCheckboxChange 호출 */}
                                                                <span style={{ marginLeft: '5px' }}>{option}</span>
                                                                {/* 옵션 이름 표시 */}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {/* 카테고리 검색 버튼, 클릭 시 RDcategoryFind 함수 호출 */}
                                <button onClick={RDcategoryFind} type="submit" style={{ width: '100%', height: '25px' }}>
                                    카테고리 검색
                                </button>
                            </div>
                        </div>
                    )
                }
                <div className="mapStyle">
                    <button id="mapBtn" onClick={() => setMapType('roadmap')}>지도</button>
                    <button id="skyBtn" onClick={() => setMapType('skyview')}>스카이뷰</button>
                    <button id="ZoomInBtn" onClick={zoomIn}><img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대"></img></button>
                    <br />
                    <button id="ZoomOutBtn" onClick={zoomOut}><img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소"></img></button>
                </div>


                {/* 차트를 그리는 영역 */}
                {showCluster && (
                    <div className="barChart" style={{ width: "20%", height: '70vh', position: 'absolute', top: '15%', right: '0px', zIndex: 10, backgroundColor: 'white', borderRadius: '5px' }}>
                        <div style={{ border: '1px solid', height: '50%' }}>
                            <Bar options={barChartOptions} data={barChartData} />
                        </div>
                        <div style={{ border: '1px solid', height: '50%' }}>
                            <Bar options={barChartOptions} data={jobChartData} />
                        </div>
                    </div>
                )}

            </div >
        </div >
    );
};

export default KakaoMap;