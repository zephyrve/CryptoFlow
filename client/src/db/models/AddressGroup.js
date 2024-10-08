import mongoose from "mongoose";

let Schema = mongoose.Schema;

let addressGroup = new Schema({
    owner: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
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

const AddressGroup = mongoose.models.AddressGroup || mongoose.model('AddressGroup', addressGroup);

export default AddressGroup;
