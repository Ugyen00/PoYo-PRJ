import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Added to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Added to parse URL-encoded request bodies

app.post(
    '/api/webhooks',
    bodyParser.raw({ type: 'application/json' }), // Middleware to handle raw JSON bodies
    async function (req, res) {
        try {
            const payloadString = req.body.toString();
            const svixHeaders = req.headers;

            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);

            const evt = wh.verify(payloadString, svixHeaders);
            const { id, ...attributes } = evt.data;

            const eventType = evt.type;
            if (eventType === 'user.created') {
                console.log(`User ${id} was ${eventType}`);
                console.log(attributes);
            }
            res.status(200).json({
                success: true,
                message: 'Webhook received',
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }
);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
    // console.log('CLERK_WEBHOOK_SECRET_KEY:', process.env.CLERK_WEBHOOK_SECRET_KEY);
});