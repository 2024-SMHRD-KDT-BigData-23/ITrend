import React from 'react';
import './RecruitList.css';

const RecruitList = ({ showCluster, clusterMarkers, dbPlaces, handlePlaceClick }) => {
    const places = showCluster ? clusterMarkers : dbPlaces;

    return (
        <div className='recruitList'>
            <div className="menuWrap" id={showCluster ? "clusterMenuWrap" : "dbMenuWrap"}>
                <ul id={showCluster ? "clusterPlacesList" : "dbPlacesList"}>
                    {places.map((place, index) => (
                        <li key={index} className="item" onClick={() => handlePlaceClick(place)}>
                            <div className="info">
                                <div className='placeTitle'>
                                    <span>{place.title}</span>
                                </div>
                                <div className='placeHeader'>
                                    <div>
                                        <span className={`markerBg marker_${index + 1}`}>{place.name}</span>
                                    </div>
                                    <div>
                                        <span className='placeJob'>{place.job}</span>
                                    </div>
                                </div>
                                <div>
                                    <span>{place.address}</span>
                                </div>
                                <div>
                                    <span>{place.skills}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecruitList;