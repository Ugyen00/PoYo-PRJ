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
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err.message)
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
        // Fetch the current best time for the pose
        const existingBest = await Best.findOne({ clerkUserId: clerkUserId });

        if (existingBest) {
            const currentBestTime = existingBest[`${pose_name}_best`] || 0;

            // Update only if the new best time is greater than the current best time
            if (bestPoseTime > currentBestTime) {
                let updateObject = {};
                updateObject[`${pose_name}_best`] = bestPoseTime;
                updateObject['$inc'] = { cumulativePoseTime: bestPoseTime - currentBestTime }; // Adjust cumulative time by the difference

                const updatedBest = await Best.findOneAndUpdate(
                    { clerkUserId: clerkUserId },
                    updateObject,
                    { new: true, upsert: true }
                );

                console.log(updatedBest);
                res.status(200).json({
                    success: true,
                    message: 'Best time and cumulative pose time updated',
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'New best time is not greater than the current best time',
                });
            }
        } else {
            // If no existing best time is found, create a new entry
            let newBest = new Best({
                clerkUserId: clerkUserId,
                [`${pose_name}_best`]: bestPoseTime,
                cumulativePoseTime: bestPoseTime
            });

            await newBest.save();
            res.status(200).json({
                success: true,
                message: 'New best time and cumulative pose time created',
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
        console.log(err)
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

const port = process.env.PORT || 80;
