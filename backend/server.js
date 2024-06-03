import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './userModel.js';
import Best from './bestModel.js';
import Performance from './performanceModel.js';

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB');
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
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

app.post('/api/update-best-time', async (req, res) => {
    const { clerkUserId, bestPoseTime, pose_name } = req.body;

    try {
        const existingBest = await Best.findOne({ clerkUserId: clerkUserId, pose: pose_name });

        if (existingBest) {
            const currentBestTime = existingBest.bestTime || 0;

            if (bestPoseTime > currentBestTime) {
                existingBest.bestTime = bestPoseTime;
                existingBest.date = new Date();
                await existingBest.save();

                res.status(200).json({
                    success: true,
                    message: 'Best time updated',
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'New best time is not greater than the current best time',
                });
            }
        } else {
            let newBest = new Best({
                clerkUserId: clerkUserId,
                pose: pose_name,
                bestTime: bestPoseTime,
                date: new Date()
            });

            await newBest.save();

            res.status(200).json({
                success: true,
                message: 'New best time created',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

app.get('/api/best-times/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const bestTimes = await Best.find({ clerkUserId: userId }).sort({ date: 1 });
        res.status(200).json({
            success: true,
            bestTimes,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// Endpoint to get user's profile data
app.get('/api/user-profile/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        const user = await User.findOne({ clerkUserId: userId });
        console.log(user);
        if (user) {
            const best = await Best.findOne({ clerkUserId: userId });
            res.status(200).json({
                success: true,
                user: {
                    ...user.toObject(),
                    ...best.toObject(),
                },
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// Endpoint to get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    const { pose } = req.query;
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
                $sort: { [`${pose}_best`]: -1 }
            },
            {
                $project: {
                    _id: 0,
                    clerkUserId: 1,
                    [`${pose}_best`]: 1,
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


app.post('/api/update-performance', async (req, res) => {
    const { clerkUserId, pose, bestTime } = req.body;

    try {
        const existingPerformance = await Performance.findOne({
            clerkUserId: clerkUserId,
            pose: pose,
            date: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
                $lt: new Date(new Date().setHours(23, 59, 59, 999)) // End of the day
            }
        });

        if (existingPerformance) {
            if (bestTime > existingPerformance.bestTime) {
                existingPerformance.bestTime = bestTime;
                await existingPerformance.save();
                res.status(200).json({
                    success: true,
                    message: 'Best time updated for today',
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'New best time is not greater than the current best time for today',
                });
            }
        } else {
            const newPerformance = new Performance({
                clerkUserId,
                pose,
                bestTime,
                date: new Date(),
            });
            await newPerformance.save();
            res.status(200).json({
                success: true,
                message: 'New performance record created for today',
            });
        }
    } catch (err) {
        console.error('Error updating performance:', err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const port = process.env.PORT || 80;
