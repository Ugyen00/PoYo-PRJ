import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './userModel.js';

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => console.log(err.message));

const app = express();

app.use(cors());

// Middleware to capture raw body
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

app.post('/api/webhooks', async (req, res) => {
    try {
        const payloadString = req.rawBody;
        const svixHeaders = req.headers;

        // Log headers and raw body for debugging purposes
        console.log('Headers:', svixHeaders);
        console.log('Raw Body:', payloadString);

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(payloadString, svixHeaders);

        const { id, ...attributes } = evt.data;
        const eventType = evt.type;

        if (eventType === 'user.created') {
            // console.log(`User ${id} was ${eventType}`);
            // console.log(attributes);
            const firstName = attributes.first_name;
            const lastName = attributes.last_name;

            console.log(firstName)

            const user = new User({
                clerkUserId: id,
                firstName: firstName,
                lastName: lastName
            })

            await user.save();
            console.log('User is created')
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

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
