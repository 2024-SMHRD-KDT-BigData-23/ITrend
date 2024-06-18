import React from 'react';
import { useState, useEffect } from 'react';
import './FilterModal.css'
const FilterModal = ({
    toggleCheckboxes,
    selectedOptions,
    handleCheckboxChange,
    RDcategoryFind,
    setSelectedOptions
}) => {

    const [currentOptions, setCurrentOptions] = useState({});
    const [selectedButton, setSelectedButton] = useState('skills');

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
    useEffect(() => {
        setCurrentOptions(skillsOptions);
        // 의존성배열이 추가되지않아 생기는 경고메시지를 무시하는 주석
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSkillsClick = () => {
        setCurrentOptions(skillsOptions);
        setSelectedButton('skills'); // 선택된 버튼 업데이트
    };

    const handleJobClick = () => {
        setCurrentOptions(jobOptions);
        setSelectedButton('job'); // 선택된 버튼 업데이트
    };

    // 필터의 초기화버튼 클릭시, 선택된 배열을 빈 배열로 만듦
    const handleReset = () => {
        setSelectedOptions([]);
    };

    return (
        <div className="modalOverlay" onClick={toggleCheckboxes}>
            {/* 모달 외부 영역 클릭 시 toggleCheckboxes 호출 */}
            <div className="modalContent" onClick={e => e.stopPropagation()}>
                {/* 모달 내부 클릭 시 이벤트 전파 방지 */}
                <div className="modalInner">
                    <div className="optionSpace">
                        <button type='button' onClick={handleSkillsClick}
                            className={`filterButton ${selectedButton === 'skills' ? 'selectedButton' : ''}`}>
                            기술스택
                        </button>
                        <button type='button' onClick={handleJobClick}
                            className={`filterButton ${selectedButton === 'job' ? 'selectedButton' : ''}`}>
                            직무
                        </button>
                    </div>
                    <div className="checkBoxSpace">
                        {Object.keys(currentOptions).map(category => (
                            <div key={category} className="categorySection">
                                <div className='categoryTitle' >{category}</div>
                                <div className="categoryOptions">
                                    {currentOptions[category].map(option => (
                                        <label key={option} htmlFor={option} className="optionLabel">
                                            <input
                                                type="checkbox"
                                                id={option}
                                                name={option}
                                                checked={selectedOptions.includes(option)}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modalButton">
                        {/* 카테고리 검색 버튼, 클릭 시 RDcategoryFind 함수 호출 */}
                        <button type='button' onClick={handleReset} id='reset'>초기화</button>
                        <button onClick={RDcategoryFind} type="button" id='search'>검색</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
