import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Newspage.css"

const JobRecommendationForm = () => {
    const [categories, setCategories] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [wordcloudImage, setWordcloudImage] = useState('');
    const [wordFrequencies, setWordFrequencies] = useState({}); // 단어 빈도수 정보
    const [selectedTab, setSelectedTab] = useState('skills'); // 'skills' 또는 'jobs'

    useEffect(() => {
        // 페이지가 로드될 때 "기술스택" 워드클라우드 이미지 요청
        fetchWordcloud('skills');
        fetchWordcloudFrequency('skills');
    }, []);

    const fetchWordcloud = async (tab) => {
        try {
            const endpoint = tab === 'skills' ? 'http://localhost:8080/api/sdwordCloud' : 'http://localhost:8080/api/jobwordCloud';
            const response = await axios.post(endpoint); // 빈 리스트를 보내서 데이터 구조 일치
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
            console.log("빈도수 : ", response.data.word_counts_with_rank);

        } catch (error) {
            console.error('Error generating wordcloudFrequency:', error);
        }
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        fetchWordcloud(tab);
        fetchWordcloudFrequency(tab);
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

    console.log(categories);
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
            "OpenGL", "Qt", "React", "React Native", "Redux", "Unity", "Unreal", "Vue.js", "WebGL", "Webpack",
            "Next_js"
        ],
        "Data&AI": [
            "R", "SAS", "SPSS", "PyTorch", "Django", "TensorFlow", "Keras", "Pandas", "Spark", "Hadoop", "Kubernetes",
            "Logstash", "Lucene", "Maven", "OpenCV", "Elasticsearch", "HBase", "AI", "neural", "Deep_Learning",
            "Machine_Learning", "bigdata", "data_analysis", "NoSQL", "DB", "SAP", "data_labeling", "data_mining",
            "data_visualization", "DW", "ETL", "RDBMS", "text_mining", "DBMS"
        ]
    };

    const sortedWordCounts = Object.entries(wordFrequencies)
        .sort(([, a], [, b]) => a.rank - b.rank)
        .slice(0, 10);
    console.log(sortedWordCounts);

    return (
        <div className = "analysis-container" >
            <div className="tabs">
                <button onClick={() => handleTabChange('skills')} className={selectedTab === 'skills' ? 'active' : ''}>기술스택</button>
                <button onClick={() => handleTabChange('jobs')} className={selectedTab === 'jobs' ? 'active' : ''}>직군</button>
            </div>
            <div className="wordcloud-container">
                <img src={`data:image/png;base64,${wordcloudImage}`} alt="Wordcloud" />
                <div className="word-counts">
                    <h4>단어 빈도수 순위 (상위 10개)</h4>
                    <ul>
                        {sortedWordCounts.map(([word, data]) => (
                            <li key={word}>
                                <span>{data.rank}. {word}</span>
                                <span> - 빈도수: {data.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="recommendations-container">
                <form onSubmit={handleSubmit}>
                    {Object.entries(techStacks).map(([category, skills]) => (
                        <div key={category}>
                                <h3>{category}</h3>
                                {skills.map(skill => (
                                    <label key={skill}>
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (e.target.checked) {
                                                    // 체크된 경우 해당 항목을 categories에 추가
                                                    setCategories([...categories, value]);
                                                } else {
                                                    // 체크 해제된 경우 해당 항목을 categories에서 제거
                                                    setCategories(categories.filter(item => item !== value));
                                                }
                                            }}
                                        /> {skill}
                                    </label>
                                ))}

                            </div>
                    ))}
                    <button type="submit">Get Recommendations</button>
                </form>
                <div className="recommendations-wrap">
                    {recommendations.map((job, index) => (
                        <div className="recommendations" key={index}>{job}</div>
                    ))}
                </div>
            </div>
        </div >

    );
};

export default JobRecommendationForm;
