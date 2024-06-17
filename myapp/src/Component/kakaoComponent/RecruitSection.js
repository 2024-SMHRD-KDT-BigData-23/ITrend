import React from 'react';
import "./RecruitSection.css";

const RecruitInfoSection = ({ iconSrc, title, content }) => {
    const addLineBreaks = (title, text) => {
        if (title !== '상세주소' && title !== '공고마감날짜') {
            if (!text) return '정보없음';

            // `•` 기호 앞에 줄바꿈 추가
            let formattedText = text.replace(/•/g, '<br>•');

            // `-` 기호 앞에 들여쓰기를 추가하여 줄바꿈
            formattedText = formattedText.replace(/-\s/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;- ');

            return formattedText;
        } else {
            return text;
        }
    };

    return (
        <>
            <div className='section'>
                <img src={iconSrc} alt={`${title} icon`} />
                <strong>{title}</strong>
            </div>
            <div>
                <p dangerouslySetInnerHTML={{ __html: addLineBreaks(title, content) }} />
            </div>
        </>
    );
};

export default RecruitInfoSection;
