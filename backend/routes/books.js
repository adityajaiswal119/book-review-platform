const express = require("express")
const router = express.Router()
const Book = require("../models/Book")
const Review = require("../models/Review")
const { protect } = require("../middleware/auth")

// @route   GET /api/books
// @desc    Get all books with pagination, search, and filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    // Build query
    const query = {}

    // Search by title or author
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { author: { $regex: req.query.search, $options: "i" } },
      ]
    }

    // Filter by genre
    if (req.query.genre && req.query.genre !== "All") {
      query.genre = req.query.genre
    }

    // Sort options
    const sort = {}
    if (req.query.sortBy === "year") {
      sort.publishedYear = -1
    } else if (req.query.sortBy === "rating") {
      sort.averageRating = -1
    } else {
      sort.createdAt = -1 // Default: newest first
    }

    const books = await Book.find(query).populate("addedBy", "name email").sort(sort).limit(limit).skip(skip)

    const total = await Book.countDocuments(query)

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get books error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching books",
    })
  }
})

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("addedBy", "name email")

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    res.status(200).json({
      success: true,
      data: book,
    })
  } catch (error) {
    console.error("Get book error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching book",
    })
  }
})

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body

    // Validate input
    if (!title || !author || !description || !genre || !publishedYear) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      publishedYear,
      addedBy: req.user._id,
    })

    const populatedBook = await Book.findById(book._id).populate("addedBy", "name email")

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: populatedBook,
    })
  } catch (error) {
    console.error("Add book error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Error adding book",
    })
  }
})

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private (only book creator)
router.put("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if user is the book creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book",
      })
    }

    const { title, author, description, genre, publishedYear } = req.body

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, genre, publishedYear },
      { new: true, runValidators: true },
    ).populate("addedBy", "name email")

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    })
  } catch (error) {
    console.error("Update book error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Error updating book",
    })
  }
})

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private (only book creator)
router.delete("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if user is the book creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this book",
      })
    }

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: req.params.id })

    await Book.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Book and associated reviews deleted successfully",
    })
  } catch (error) {
    console.error("Delete book error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting book",
    })
  }
})

module.exports = router
