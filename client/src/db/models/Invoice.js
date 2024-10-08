import mongoose from "mongoose";

let Schema = mongoose.Schema;

let invoice = new Schema({
    owner: {
        type: String,
        required: true,
    },
    recipient: {
        type: String,
        required: true,
    },
    tokenAddress: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    tags: {
        type: String,
        required: false,
    },
    items: [
        {
            description: {
                type: String,
                required: false,
            },
            qty: {
                type: Number,
                required: true,
            },
            unitPrice: {
                type: Number,
                required: true,
            },
            discount: {
                type: Number,
                required: true,
            },
            tax: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: Number,
        required: true,
        default: 1,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoice);
export default Invoice;
