const express = require("express")
const router = express.Router()
const Review = require("../models/Review")
const Book = require("../models/Book")
const { protect } = require("../middleware/auth")

// Helper function to update book's average rating
const updateBookRating = async (bookId) => {
  const reviews = await Review.find({ bookId })

  if (reviews.length === 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      reviewCount: 0,
    })
    return
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  await Book.findByIdAndUpdate(bookId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  })
}

// @route   GET /api/reviews/book/:bookId
// @desc    Get all reviews for a book
// @access  Public
router.get("/book/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    })
  }
})

// @route   GET /api/reviews/user/:userId
// @desc    Get all reviews by a user
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate("bookId", "title author")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    console.error("Get user reviews error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
    })
  }
})

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body

    // Validate input
    if (!bookId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user._id,
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book. Please update your existing review.",
      })
    }

    // Create review
    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      reviewText,
    })

    // Update book's average rating
    await updateBookRating(bookId)

    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name email")
      .populate("bookId", "title author")

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: populatedReview,
    })
  } catch (error) {
    console.error("Add review error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Error adding review",
    })
  }
})

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (only review creator)
router.put("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user is the review creator
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      })
    }

    const { rating, reviewText } = req.body

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, reviewText },
      { new: true, runValidators: true },
    )
      .populate("userId", "name email")
      .populate("bookId", "title author")

    // Update book's average rating
    await updateBookRating(review.bookId)

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    })
  } catch (error) {
    console.error("Update review error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Error updating review",
    })
  }
})

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (only review creator)
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user is the review creator
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      })
    }

    const bookId = review.bookId

    await Review.findByIdAndDelete(req.params.id)

    // Update book's average rating
    await updateBookRating(bookId)

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    console.error("Delete review error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting review",
    })
  }
})

module.exports = router
