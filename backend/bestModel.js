// import mongoose from 'mongoose';

// const bestSchema = new mongoose.Schema(
//     {
//         clerkUserId: { type: String, unique: true, required: true },
//         bestPoseTime: { type: Number, required: true },
//     },
//     { timestamps: true }
// );

// const Best = mongoose.model('Best', bestSchema);

// export default Best;

import mongoose from 'mongoose';

const bestSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
    },
    cumulativePoseTime: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Best = mongoose.model('Best', bestSchema);

export default Best;
