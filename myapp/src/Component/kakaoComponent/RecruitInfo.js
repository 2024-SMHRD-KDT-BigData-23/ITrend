import React from 'react';
import './RecruitInfo.css';
import RecruitInfoSection from './RecruitSection';

const RecruitInfo = ({ selectedPlace, setRecruitInfo, setSelectedPlace }) => {
    
    const openUrl = (url) => {
        // URL이 http:// 또는 https://로 시작하지 않는 경우 http://를 추가
        if (!/^https?:\/\//i.test(url)) {
            url = `http://${url}`;
        }
        window.open(url, '_blank', 'noopener noreferrer');
    };

    return (
        <div className='recruitInfo'>
            <div className="recruitHead">
                <div className='left'>
                    <img src='/images/Note.png' alt='Note Icon'></img>
                    <span>{selectedPlace.title}</span>
                </div>
                <div className='right'>
                    <button onClick={() => {
                        setRecruitInfo(false);
                        setSelectedPlace(null);
                    }}>X</button>
                </div>
            </div>

            <div className='rcruitNeck'></div>

            <div className='recruitBody'>
                <RecruitInfoSection iconSrc='/images/Check.png' title='기업명' content={selectedPlace.name} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='지역' content={selectedPlace.region} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='직무' content={selectedPlace.job} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='경력' content={selectedPlace.carrer} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='기술스택' content={selectedPlace.skills} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='기업소개' content={selectedPlace.info} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='하시는 일' content={selectedPlace.work} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='자격조건' content={selectedPlace.license} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='우대사항' content={selectedPlace.preference} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='지원절차' content={selectedPlace.job_process} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='상세주소' content={selectedPlace.address} />
                <RecruitInfoSection iconSrc='/images/Check.png' title='공고마감날짜' content={selectedPlace.deadline_at} />
            </div>

            <div className='recruitFoot'>
                <button type='button' onClick={() => openUrl(selectedPlace.url)}>홈페이지 이동</button>
            </div>
        </div>
    );
}

export default RecruitInfo;