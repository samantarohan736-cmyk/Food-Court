const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    foodItem: {
        type: mongoose.Schema.ObjectId,
        ref: 'FoodItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const OrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Please add a customer name']
    },
    items: [OrderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
