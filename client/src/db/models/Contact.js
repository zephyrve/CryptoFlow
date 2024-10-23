import mongoose from "mongoose";

let Schema = mongoose.Schema;

let invoice = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'archived'],
        default: 'pending',
    },
});

const ContactForm = mongoose.models.ContactForm || mongoose.model('ContactForm', invoice);
export default ContactForm;
