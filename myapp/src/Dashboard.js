import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.post('http://localhost:8080/api/dashboard_process', {}, { withCredentials: true });
                if (response.status === 200) {
                    const userId = response.data;
                    console.log('User ID fetched:', userId);
                    setUserId(userId);
                } else {
                    console.error('Failed to fetch user ID:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {userId ? (
                <p>{userId}님 안녕하세요!</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
