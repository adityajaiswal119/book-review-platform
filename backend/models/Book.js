const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    maxlength: [100, "Author name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: [
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Thriller",
      "Romance",
      "Science Fiction",
      "Fantasy",
      "Biography",
      "History",
      "Self-Help",
      "Other",
    ],
    default: "Other",
  },
  publishedYear: {
    type: Number,
    required: [true, "Published year is required"],
    min: [1000, "Please provide a valid year"],
    max: [new Date().getFullYear(), "Year cannot be in the future"],
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
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

// Update the updatedAt timestamp before saving
bookSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Book", bookSchema)
