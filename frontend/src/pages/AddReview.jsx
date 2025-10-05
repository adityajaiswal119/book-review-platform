"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../lib/api"
import StarRating from "../components/StarRating"

export default function AddReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const { data } = await api.get(`/books/${id}`)
      setBook(data)
    } catch (error) {
      setError("Failed to load book")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setError("")
    setLoading(true)

    try {
      await api.post("/reviews", {
        bookId: id,
        rating,
        reviewText,
      })
      navigate(`/books/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add review")
    } finally {
      setLoading(false)
    }
  }

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded"></div>
          <div className="h-32 bg-secondary rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-xl text-muted-foreground">
          for <span className="font-semibold text-foreground">{book.title}</span> by {book.author}
        </p>
      </div>

      <div className="bg-secondary/50 rounded-lg p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3">Your Rating *</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div>
            <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
              Your Review *
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Share your thoughts about this book..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/books/${id}`)}
              className="flex-1 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
