import mongoose from "mongoose";

let Schema = mongoose.Schema;

let address = new Schema({
    owner: {
        type: String,
        required: true,
    },
    groupId: {
        type: String,
        required: false,
    },
    walletAddress: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Address = mongoose.models.Address || mongoose.model('Address', address);
export default Address;
