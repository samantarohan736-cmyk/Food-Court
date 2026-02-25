const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const { protect, authorizeAdmin } = require('../middleware/auth');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await FoodItem.find();
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const item = await FoodItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
router.post('/', protect, authorizeAdmin, async (req, res) => {
    try {
        const item = await FoodItem.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
router.put('/:id', protect, authorizeAdmin, async (req, res) => {
    try {
        const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
router.delete('/:id', protect, authorizeAdmin, async (req, res) => {
    try {
        const item = await FoodItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Create new review
// @route   POST /api/menu/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const item = await FoodItem.findById(req.params.id);

        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

        const alreadyReviewed = item.reviews.find(r => r.user.toString() === req.user.id.toString());
        if (alreadyReviewed) return res.status(400).json({ success: false, error: 'Item already reviewed' });

        const review = {
            name: req.user.name || 'Anonymous User',
            rating: Number(rating),
            comment,
            user: req.user.id
        };

        item.reviews.push(review);
        item.averageRating = item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length;

        await item.save();
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
