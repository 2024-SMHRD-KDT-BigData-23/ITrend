import React from 'react';
import "./RecruitSection.css";

const RecruitInfoSection = ({ iconSrc, title, content }) => {
    return (
        <>
            <div className='section'>
                <img src={iconSrc} alt={`${title} icon`} />
                <strong>{title}</strong>
            </div>
            <div>
                <p>{content}</p>
            </div>
        </>
    );
};

export default RecruitInfoSection;