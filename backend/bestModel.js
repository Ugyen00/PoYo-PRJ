import mongoose from 'mongoose';

const bestSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, unique: true, required: true },
        bestPoseTime: { type: Number, required: true },
    },
    { timestamps: true }
);

const Best = mongoose.model('Best', bestSchema);

export default Best;
