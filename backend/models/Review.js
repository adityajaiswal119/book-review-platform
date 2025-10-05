const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },
  reviewText: {
    type: String,
    required: [true, "Review text is required"],
    trim: true,
    minlength: [10, "Review must be at least 10 characters"],
    maxlength: [1000, "Review cannot exceed 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true })

// Update the updatedAt timestamp before saving
reviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Review", reviewSchema)
