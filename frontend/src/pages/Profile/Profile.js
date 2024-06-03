import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useUser } from '@clerk/clerk-react';

const poseList = [
    'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog', 'Shoulderstand'
];

const Profile = () => {
    const { user } = useUser();
    const [bestPoseTime, setBestPoseTime] = useState(null);
    const [cumulativePoseTime, setCumulativePoseTime] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedPose, setSelectedPose] = useState(poseList[0]);

    const sortedLeaderboard = [...leaderboard].sort((a, b) => b[`${selectedPose}_best`] - a[`${selectedPose}_best`]);

    useEffect(() => {
        if (!user) return;

        const clerkUserId = user.id;

        const fetchUserData = async () => {
            try {
                // Fetch user profile data
                const userProfileResponse = await axios.get(`http://localhost:80/api/user-profile/${clerkUserId}`);
                console.log('User profile data:', userProfileResponse.data);
                setBestPoseTime(userProfileResponse.data.user[`${selectedPose}_best`]);
                setCumulativePoseTime(userProfileResponse.data.user.cumulativePoseTime);

                // Fetch leaderboard data
                await fetchLeaderboardData(selectedPose);
            } catch (error) {
                console.error('Error fetching user profile or leaderboard:', error);
            }
        };

        fetchUserData();
    }, [user, selectedPose]);

    const fetchLeaderboardData = async (pose) => {
        try {
            const response = await axios.get(`http://localhost:80/api/leaderboard?pose=${pose}`);
            console.log('Leaderboard data:', response.data);
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

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
                    {/* Profile Section */}
                    <div className="profile-section bg-[#A5B28F] p-5 rounded-lg shadow-lg">
                        <div className="profile-image">
                            <img src="https://via.placeholder.com/150" alt="User Avatar" className="rounded-full w-24 h-24 mx-auto" />
                        </div>
                        <h2 className="text-center text-xl font-bold mt-3">{`${user.firstName} ${user.lastName}`}</h2>
                        <div className="total-time bg-gray-200 p-3 mt-3 rounded-lg text-center">
                            <h3>Total Time:</h3>
                            <span className="text-3xl font-bold">{bestPoseTime || 0}</span> s
                        </div>
                    </div>
                    {/* Leaderboard Section */}
                    <div className="leaderboard-section bg-[#A5B28F] p-5 rounded-lg shadow-lg ml-10 flex-grow">
                        <h1 className="text-2xl font-bold text-center mb-5">LEADERBOARD</h1>
                        
                        {/* Pose Filter Dropdown */}
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
                                    <tr key={entry.clerkUserId} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">{`${entry.userDetails.firstName} ${entry.userDetails.lastName}`}</td>
                                        <td className="border px-4 py-2 text-center">{entry[`${selectedPose}_best`]} Sec</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
