const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const { protect, authorizeAdmin } = require('../middleware/auth');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, authorizeAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ customerName: req.user.name }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Create new order and deduct stock
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { customerName, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, error: 'No order items' });
        }

        // Validate stock availability and deduct
        for (const orderItem of items) {
            const foodItem = await FoodItem.findById(orderItem.foodItem);
            if (!foodItem) {
                return res.status(404).json({ success: false, error: `Food item not found with id ${orderItem.foodItem}` });
            }
            if (foodItem.stock < orderItem.quantity) {
                return res.status(400).json({ success: false, error: `Insufficient stock for ${foodItem.name}` });
            }

            // Deduct stock
            foodItem.stock -= orderItem.quantity;
            await foodItem.save();
        }

        const order = await Order.create({
            customerName,
            items,
            totalAmount
        });

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
router.put('/:id', protect, authorizeAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
            new: true,
            runValidators: true
        });
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
