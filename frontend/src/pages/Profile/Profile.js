import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useUser } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { Line } from 'react-chartjs-2';
import { format, parseISO, isValid } from 'date-fns';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(...registerables);

const poseList = [
    'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog', 'Shoulderstand'
];

const Profile = () => {
    const { user } = useUser();
    const [bestPoseTime, setBestPoseTime] = useState(null);
    const [cumulativePoseTime, setCumulativePoseTime] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedPose, setSelectedPose] = useState(poseList[0]);
    const [userBestTimes, setUserBestTimes] = useState({});
    const [bestTimesData, setBestTimesData] = useState([]);
    const chartRef = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const sortedLeaderboard = [...leaderboard].sort((a, b) => b[`${selectedPose}_best`] - a[`${selectedPose}_best`]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            const clerkUserId = user.id;

            try {
                const userProfileResponse = await axios.get(`http://localhost:80/api/user-profile/${clerkUserId}`);
                console.log('User profile data:', userProfileResponse.data);
                setBestPoseTime(userProfileResponse.data.user[`${selectedPose}_best`]);
                setCumulativePoseTime(userProfileResponse.data.user.cumulativePoseTime);

                const bestTimes = poseList.reduce((acc, pose) => {
                    acc[pose] = userProfileResponse.data.user[`${pose}_best`] || 0;
                    return acc;
                }, {});

                setUserBestTimes(bestTimes);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserData();
    }, [user, selectedPose]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await axios.get(`http://localhost:80/api/leaderboard?pose=${selectedPose}`);
                console.log('Leaderboard data:', response.data);
                setLeaderboard(response.data.leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboardData();
    }, [selectedPose]);

    useEffect(() => {
        const fetchBestTimesData = async () => {
            if (!user) return;

            const clerkUserId = user.id;

            try {
                const response = await axios.get(`http://localhost:80/api/best-times/${clerkUserId}`);
                setBestTimesData(response.data.bestTimes);
            } catch (error) {
                console.error('Error fetching best times data:', error);
            }
        };

        fetchBestTimesData();
    }, [user]);

    useEffect(() => {
        const renderChart = () => {
            const ctx = document.getElementById('performance-chart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: bestTimesData
                        .filter(entry => {
                            const date = entry.date ? parseISO(entry.date) : null;
                            return date && isValid(date) &&
                                (!startDate || date >= startDate) &&
                                (!endDate || date <= endDate);
                        })
                        .map(entry => {
                            const date = entry.date ? parseISO(entry.date) : null;
                            return date && isValid(date) ? format(date, 'MM/dd/yyyy') : 'Invalid Date';
                        }),
                    datasets: poseList.map(pose => ({
                        label: pose,
                        data: bestTimesData
                            .filter(entry => entry.pose === pose && entry.date && isValid(parseISO(entry.date)) &&
                                (!startDate || parseISO(entry.date) >= startDate) &&
                                (!endDate || parseISO(entry.date) <= endDate))
                            .map(entry => entry.bestTime),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    }))
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'll'
                            },
                            ticks: {
                                maxTicksLimit: 7
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    }
                }
            });

            chartRef.current = chart;
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (bestTimesData.length) {
            renderChart();
        }
    }, [bestTimesData, selectedPose, startDate, endDate]);

    return (
        <div>
            <NavBar />

            <div className='py-24'>
                <img
                    src='/images/profile.svg'
                    width={250}
                    height={60}
                    className='flex justify-center items-center mx-auto'
                    alt='Yoga Class'
                />
                <div className="container mx-auto py-20 px-56 flex">
                    {user && (
                        <div className="profile-section bg-[#A5B28F] p-5 rounded-lg shadow-lg">
                            <div className="profile-image text-center">
                                <div className="user-button-large mt-2">
                                    <UserButton afterSignOutUrl='/' />
                                </div>
                            </div>
                            <h2 className="text-center text-xl font-bold mt-3">{`${user.firstName} ${user.lastName}`}</h2>
                            <div className="total-time bg-gray-200 p-3 mt-3 rounded-lg text-center">
                                <h3>Total Time:</h3>
                                <span className="text-3xl font-bold">{cumulativePoseTime || 0}</span> s
                            </div>
                            <div className="best-times mt-5">
                                <h3 className="text-center text-xl font-bold">Best Times for Each Pose</h3>
                                <table className="min-w-full bg-white mt-3 border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 bg-gray-200 border">Pose</th>
                                            <th className="py-2 px-4 bg-gray-200 border">Best Time (s)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poseList.map(pose => (
                                            <tr key={pose} className="text-center">
                                                <td className="border px-4 py-2">{pose}</td>
                                                <td className="border px-4 py-2">{userBestTimes[pose]} s</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="leaderboard-section bg-[#A5B28F] p-5 rounded-lg shadow-lg ml-10 flex-grow">
                        <h1 className="text-2xl font-bold text-center mb-5">LEADERBOARD</h1>
                        <div className="mb-5">
                            <label htmlFor="pose-select" className="block mb-2">Select Pose:</label>
                            <select
                                id="pose-select"
                                value={selectedPose}
                                onChange={(e) => setSelectedPose(e.target.value)}
                                className="block w-full p-2 border rounded"
                            >
                                {poseList.map(pose => (
                                    <option key={pose} value={pose}>{pose}</option>
                                ))}
                            </select>
                        </div>

                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 bg-gray-200">Rank</th>
                                    <th className="py-2 px-4 bg-gray-200">Name</th>
                                    <th className="py-2 px-4 bg-gray-200">Best Time ({selectedPose}) (s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLeaderboard.map((entry, index) => (
                                    <tr key={entry.userId} className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{entry.username}</td>
                                        <td className="border px-4 py-2">{entry[`${selectedPose}_best`]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-10">
                <div className="calendar-section bg-white p-5 rounded-lg shadow-lg mx-20 mt-10">
                    <h1 className="text-2xl font-bold text-center mb-5">DAILY PERFORMANCE</h1>
                    <div className="flex justify-center items-center mb-5">
                        <div className="mr-2">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                className="p-2 border rounded"
                            />
                        </div>
                        <div>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>
                    <canvas id="performance-chart"></canvas>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;
