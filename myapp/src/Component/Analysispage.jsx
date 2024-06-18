import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import "./Analysispage.css";
import "./Header.css";
import Login from './Login';  // Assuming you have a Login component

const JobRecommendationForm = () => {
    const [categories, setCategories] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [wordcloudImage, setWordcloudImage] = useState('');
    const [wordFrequencies, setWordFrequencies] = useState({});
    const [selectedTab, setSelectedTab] = useState('skills');
    const [selectedCategoryTab, setSelectedCategoryTab] = useState("Back-end");
    const [cookies] = useCookies(['user_id']);
    const isAuthenticated = !!cookies['user_id'];
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchWordcloud('skills');
        fetchWordcloudFrequency('skills');
    }, []);

    const handleReset = () => {
        setCategories([]);
        setRecommendations([]);
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    };

    const fetchWordcloud = async (tab) => {
        try {
            const endpoint = tab === 'skills' ? 'http://localhost:8080/api/sdwordCloud' : 'http://localhost:8080/api/jobwordCloud';
            const response = await axios.post(endpoint);
            setWordcloudImage(response.data);
        } catch (error) {
            console.error('Error generating wordcloud:', error);
        }
    };

    const fetchWordcloudFrequency = async (tab) => {
        try {
            const endpoint = tab === 'skills' ? 'http://localhost:8080/api/sdwordCloudfq' : 'http://localhost:8080/api/jobwordCloudfq';
            const response = await axios.post(endpoint);
            setWordFrequencies(response.data.word_counts_with_rank);
        } catch (error) {
            console.error('Error generating wordcloudFrequency:', error);
        }
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        fetchWordcloud(tab);
        fetchWordcloudFrequency(tab);
    };

    const handleCategoryTabChange = (category) => {
        setSelectedCategoryTab(category);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/job_recommend', { categories });
            setRecommendations(response.data.recommended_jobs);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const techStacks = {
        "Back-end": [
            "Python", "Java", "C", "C++", "C#", "Perl", "PHP", "Ruby", "Scala", "Solidity", "VisualBasic", ".NET",
            "ABAP", "ASP", "ASP.NET", "Flask", "GoLang", "GraphQL", "JPA", "JSP", "Kafka", "LabVIEW", "MyBatis",
            "Node_js", "Spring", "SpringBoot", "Struts", "Vert.x", "Docker", "Eclipse", "GCP", "Git", "Jenkins",
            "Linux", "MacOS", "MariaDB", "MongoDB", "MSSQL", "MySQL", "PostgreSQL", "Pro-C", "Redis", "SVN",
            "Sybase", "Tomcat", "Ubuntu", "Unix", "Windows"
        ],
        "Front-end": [
            "JavaScript", "TypeScript", "Kotlin", "Swift", "Objective_C", "Angular", "Flutter", "Ionic", "jQuery",
            "OpenGL", "Qt", "React", "React Native", "Redux", "Unity", "Unreal", "Vue.js", "WebGL", "Webpack", "Android", "iOS",
            "Next_js"
        ],
        "Data&AI": [
            "R", "SAS", "SPSS", "PyTorch", "Django", "TensorFlow", "Keras", "Pandas", "Spark", "Hadoop", "Kubernetes",
            "Logstash", "Lucene", "Maven", "OpenCV", "Elasticsearch", "HBase", "AI", "neural", "Deep_Learning",
            "DB", "bigdata", "data_analysis", "NoSQL", "Machine_Learning", "SAP", "data_labeling", "data_mining",
            "data_visualization", "DW", "ETL", "RDBMS", "text_mining", "DBMS"
        ]
    };

    const sortedWordCounts = Object.entries(wordFrequencies)
        .sort(([, a], [, b]) => a.rank - b.rank)
        .slice(0, 10);


    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className={`analysisContainer ${isAuthenticated ? '' : 'blurred'}`}>
                <div className="wordcloudTabs">
                    <button onClick={() => handleTabChange('skills')} className={selectedTab === 'skills' ? 'active' : ''}>기술스택</button>
                    <button onClick={() => handleTabChange('jobs')} className={selectedTab === 'jobs' ? 'active' : ''}>직군</button>
                </div>
                <div className="wordcloudContainer">
                    <img src={`data:image/png;base64,${wordcloudImage}`} alt="Wordcloud" />
                    <div className="wordCounts">
                        <h4><strong>채용 인기 {selectedTab === 'skills' ? '기술스택' : '직무'} 순위</strong><img src='/images/Rankicon.png' alt='Rankicon' /></h4>
                        <ul>
                            {sortedWordCounts.map(([word, data]) => (
                                <li key={word}>
                                    <span>{data.rank}. {word}</span>
                                    <span> + {data.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="categoryTabs">
                    {Object.keys(techStacks).map((category) => (
                        <button
                            key={category}
                            className={`tab-button ${selectedCategoryTab === category ? 'active' : ''}`}
                            onClick={() => handleCategoryTabChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="recommendationsContainer">
                    <form onSubmit={handleSubmit}>
                        {Object.entries(techStacks).map(([category, skills]) => (
                            <div
                                key={category}
                                className={`recommendationsCategory ${selectedCategoryTab === category ? 'active' : 'hidden'}`}
                            >
                                {skills.map((skill) => (
                                    <label key={skill}>
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (e.target.checked) {
                                                    setCategories((prevCategories) => [...prevCategories, value]);
                                                } else {
                                                    setCategories((prevCategories) => prevCategories.filter((item) => item !== value));
                                                }
                                            }}
                                        /> {skill}
                                    </label>
                                ))}
                            </div>
                        ))}
                        <div className="buttonContainer" style={{ display: "flex", justifyContent: "flex-end", padding: "0 10px" }}>
                            <button id='submit' type="submit">Get Recommendations</button>

                            <button id='reset' type="button" onClick={handleReset} >초기화</button>
                        </div>
                    </form>
                    <div className="recommendationsWrap">
                        <div className="recommendationsTitle">Recommendations</div>
                        <div className="recommendationsContent">
                            {recommendations.length === 0 ? (
                                <div className="recommendationsPlaceholder">No recommendations yet. Please select skills and submit to get recommendations.</div>
                            ) : (
                                recommendations.map((rec, index) => (
                                    <div key={index} className="recommendations">
                                        - {rec}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div >
            </div >
            {!isAuthenticated && (
                <div className="loginOverlay" >
                    <div className="loginMessage">채용공고 데이터분석과 직업추천 서비스를 이용하려면 로그인이 필요합니다</div>
                    <button className="loginButton" onClick={openModal}>로그인</button>
                </div>
            )}
            {
                modalOpen && (
                    <div className="modalOverlay2" onClick={closeModal}>
                        <div className="modalContent2" onClick={(e) => e.stopPropagation()}>
                            <Login closeModal={closeModal} />
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default JobRecommendationForm;
