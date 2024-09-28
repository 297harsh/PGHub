const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UsersInfo",
  },
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "PGDetails",
  },
});

const BookmarkModel = mongoose.model("Bookmarks", bookmarkSchema);
module.exports = { BookmarkModel };
