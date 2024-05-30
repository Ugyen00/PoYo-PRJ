import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useUser } from '@clerk/clerk-react';

const Profile = () => {
    const { user } = useUser();
    const [bestPoseTime, setBestPoseTime] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        if (!user) return;

        const clerkUserId = user.id;

        // Fetch user profile data
        axios.get(`http://localhost:80/api/user-profile/${clerkUserId}`)
            .then(response => {
                console.log('User profile data:', response.data);
                setBestPoseTime(response.data.user.bestPoseTime);

                // Fetch best pose time data
                axios.get(`http://localhost:80/api/bests/${clerkUserId}`)
                    .then(response => {
                        console.log('Best pose time data:', response.data);
                        setBestPoseTime(response.data.bestPoseTime);
                    })
                    .catch(error => {
                        console.error('Error fetching best pose time:', error);
                    });

                // Fetch leaderboard data
                axios.get('http://localhost:80/api/leaderboard')
                    .then(response => {
                        console.log('Leaderboard data:', response.data);
                        setLeaderboard(response.data.leaderboard);
                    })
                    .catch(error => {
                        console.error('Error fetching leaderboard data:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-20">
                <h1 className='py-20'>Profile Page</h1>
                <h2>First Name: {user.firstName}</h2>
                <h2>Last Name: {user.lastName}</h2>
                <h2>Best Performance Time: {bestPoseTime ? `${bestPoseTime} s` : 'N/A'}</h2>

                <h1 className="text-2xl font-bold mt-10">Leaderboard</h1>
                <table className="min-w-full bg-white mt-5">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-gray-200">Rank</th>
                            <th className="py-2 px-4 bg-gray-200">Name</th>
                            <th className="py-2 px-4 bg-gray-200">Best Pose Time (s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, index) => (
                            <tr key={entry.clerkUserId}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{`${entry.userDetails.firstName} ${entry.userDetails.lastName}`}</td>
                                <td className="border px-4 py-2">{entry.bestPoseTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
