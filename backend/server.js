import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './userModel.js';
import Best from './bestModel.js'; // Import Best model

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => console.log(err.message));

const app = express();

app.use(cors({
    origin: 'http://localhost:300/'
}));

app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

app.post('/api/webhooks', async (req, res) => {
    try {
        const payloadString = req.rawBody;
        const svixHeaders = req.headers;

        console.log('Headers:', svixHeaders);
        console.log('Raw Body:', payloadString);

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(payloadString, svixHeaders);

        const { id, ...attributes } = evt.data;
        const eventType = evt.type;

        if (eventType === 'user.created') {
            const firstName = attributes.first_name;
            const lastName = attributes.last_name;

            console.log(firstName);

            const user = new User({
                clerkUserId: id,
                firstName: firstName,
                lastName: lastName
            });

            await user.save();
            console.log('User is created');
        }

        res.status(200).json({
            success: true,
            message: 'Webhook received',
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
});

// Endpoint to update user's best pose time
app.post('/api/update-best-time', async (req, res) => {
    const { clerkUserId, bestPoseTime } = req.body;

    try {
        const best = await Best.findOneAndUpdate(
            { clerkUserId: clerkUserId },
            { bestPoseTime: bestPoseTime },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Best pose time updated',
            best,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// Endpoint to get user's profile data
app.get('/api/user-profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ clerkUserId: userId });

        if (user) {
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// Endpoint to get user's best pose times
app.get('/api/bests/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const best = await Best.findOne({ clerkUserId: userId });

        if (best) {
            res.status(200).json({
                success: true,
                bestPoseTime: best.bestPoseTime,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Best pose time not found',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// Endpoint to get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Best.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'clerkUserId',
                    foreignField: 'clerkUserId',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $sort: { bestPoseTime: 1 }
            },
            {
                $project: {
                    _id: 0,
                    clerkUserId: 1,
                    bestPoseTime: 1,
                    'userDetails.firstName': 1,
                    'userDetails.lastName': 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            leaderboard,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
