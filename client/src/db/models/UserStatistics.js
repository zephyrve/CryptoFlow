import mongoose from "mongoose";

let Schema = mongoose.Schema;

let userStatistics = new Schema({
    transactionsCount: {
        type: Number,
        default: 0,
    },
    walletAddress: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^0x[a-fA-F0-9]{40}$/.test(v);
            },
            message: props => `${props.value} is not a valid wallet address!`
        },
    },
    successfulTransactions: {
        type: Number,
        default: 0,
    },
    totalAmountTransacted: {
        type: Number,
        default: 0.0,
    },
    lastTransactionDate: {
        type: Date,
        default: null,
    },
    transactionHistory: [{
        transactionHash: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['success', 'failed'],
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const UserStatistics = mongoose.models.UserStatistics || mongoose.model('UserStatistics', userStatistics);
export default UserStatistics;
