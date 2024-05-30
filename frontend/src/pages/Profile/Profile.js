import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useUser } from '@clerk/clerk-react';

const Profile = () => {
    const { user } = useUser();
    const [bestPoseTime, setBestPoseTime] = useState(null);

    useEffect(() => {
        const clerkUserId = user.id;

        // Fetch user profile data
        axios.get(`http://localhost:80/api/user-profile/${clerkUserId}`)
            .then(response => {
                console.log('User profile data:', response.data);
                setBestPoseTime(response.data.user.bestPoseTime);

                axios.get(`http://localhost:80/api/bests/${clerkUserId}`)
                    .then(response => {
                        console.log('Best pose time data:', response.data);
                        setBestPoseTime(response.data.bestPoseTime);
                    })
                    .catch(error => {
                        console.error('Error fetching best pose time:', error);
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
            <div>
                <h1 className='py-20'>Profile Page</h1>
                <h2>First Name: {user.firstName}</h2>
                <h2>Last Name: {user.lastName}</h2>
                <h2>Best Performance Time: {bestPoseTime ? `${bestPoseTime} s` : 'N/A'}</h2>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
