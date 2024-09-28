const router = require('express').Router();
const Bookmark = require('../models/Bookmark');
const { BookmarkModel } = require('../models/BookmarkModel');

// Add bookmark
router.post('/add', async (req, res) => {
  const { userId, pgId } = req.body;
  try {
    const newBookmark = new BookmarkModel({ userId, pgId });
    await newBookmark.save();
    return res.status(201).json({ success: true, message: 'Bookmark added' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add bookmark' });
  }
});

// Remove bookmark
router.delete('/remove', async (req, res) => {
  const { userId, pgId } = req.body;
  try {
    await BookmarkModel.findOneAndDelete({ userId, pgId });
    return res.status(200).json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove bookmark' });
  }
});

// Get bookmarks for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const bookmarks = await Bookmark.find({ userId }).populate('pgId');
    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookmarks' });
  }
});

module.exports = router;
