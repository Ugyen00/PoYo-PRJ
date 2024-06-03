import mongoose from 'mongoose';

const bestSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true },
    pose: { type: String, required: true },
    bestTime: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Best = mongoose.model('Best', bestSchema);

export default Best;
