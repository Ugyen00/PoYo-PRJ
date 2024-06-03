// performanceModel.js
import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
    },
    pose: {
        type: String,
        required: true,
    },
    bestTime: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
