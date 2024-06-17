import React from 'react';
import { Bar } from 'react-chartjs-2';
import "./ChartPanel.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Chart.js의 구성 요소를 등록합니다.
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const ChartPanel = ({ setShowChart, barChartData, jobChartData }) => {
    const truncateLabel = (label) => {
        const maxLabelLength = 3;
        if (label.length > maxLabelLength) {
            return label.substr(0, maxLabelLength) + '...';
        }
        return label.padEnd(maxLabelLength + 3); // 3 for '...'
    };

    const createChartOptions = (titleText) => ({
        // 설정한 차트의 축을 y축을 기준으로 설정합니다.
        indexAxis: 'y',
        elements: {
            bar: {
                // 막대의 테두리 두께를 설정합니다.
                borderWidth: 2,
            },
        },
        // 차트의 반응형 여부를 설정합니다.
        responsive: true,
        // 차트의 비율 유지 여부를 설정합니다.
        maintainAspectRatio: false,
        plugins: {
            legend: {
                // 범례 표시 여부를 설정합니다.
                display: false,
            },
            title: {
                // 차트 제목 표시 여부를 설정합니다.
                display: true,
                // 차트 제목 텍스트를 설정합니다.
                text: titleText,
                // 차트 제목의 위치를 설정합니다.
                position: 'top',
                // 차트 제목의 폰트 설정을 정의합니다.
                font: {
                    size: 20,      // 폰트 크기
                    family: 'Arial', // 폰트 패밀리
                    weight: 'bold',  // 폰트 두께
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    // y축의 틱 레이블을 사용자 정의 형식으로 설정합니다.
                    callback: function (value) {
                        // y축의 레이블을 가져와 길이를 조정합니다.
                        const label = this.getLabelForValue(value);
                        return truncateLabel(label);
                    },
                }
            }
        }
    });

    const barChartOptions = createChartOptions('기술 스택');
    const jobChartOptions = createChartOptions('직무');

    return (
        <div className='chartSpace'>
            <div className='chartSpace2'>
                <div className='chartSpace3'>
                    <div className='chartSpace4'>
                        <button type='button' onClick={() => setShowChart(false)}>X</button>
                    </div>
                </div>
            </div>
            <div className="barChart">
                <div className="skillsChart">
                    <Bar options={barChartOptions} data={barChartData} />
                </div>
                <div className='jobChart'>
                    <Bar options={jobChartOptions} data={jobChartData} />
                </div>
            </div>
        </div>
    );
};

export default ChartPanel;