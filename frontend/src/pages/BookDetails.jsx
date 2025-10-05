"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Star, Edit, Trash2, Plus } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import api from "../lib/api"
import RatingChart from "../components/RatingChart"

export default function BookDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookDetails()
  }, [id])

  const fetchBookDetails = async () => {
    try {
      const [bookRes, reviewsRes] = await Promise.all([api.get(`/books/${id}`), api.get(`/reviews/book/${id}`)])
      setBook(bookRes.data)
      setReviews(reviewsRes.data)
    } catch (error) {
      console.error("Error fetching book details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      await api.delete(`/books/${id}`)
      navigate("/")
    } catch (error) {
      alert("Failed to delete book")
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      await api.delete(`/reviews/${reviewId}`)
      fetchBookDetails()
    } catch (error) {
      alert("Failed to delete review")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-3/4"></div>
          <div className="h-4 bg-secondary rounded w-1/2"></div>
          <div className="h-32 bg-secondary rounded"></div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-muted-foreground">Book not found</p>
      </div>
    )
  }

  const isOwner = user && book.addedBy._id === user.id
  const userReview = reviews.find((r) => r.userId._id === user?.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Book Header */}
      <div className="bg-secondary/50 rounded-lg p-8 border border-border mb-8">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">{book.genre}</span>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/books/${id}/edit`} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Edit className="w-5 h-5" />
              </Link>
              <button
                onClick={handleDeleteBook}
                className="p-2 hover:bg-accent rounded-lg transition-colors text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-primary text-primary" />
            <span className="text-2xl font-bold">{book.averageRating ? book.averageRating.toFixed(1) : "N/A"}</span>
          </div>
          <span className="text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Published {book.publishedYear}</span>
        </div>

        <p className="text-lg leading-relaxed">{book.description}</p>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Added by <span className="font-medium text-foreground">{book.addedBy.name}</span>
          </p>
        </div>
      </div>

      {/* Rating Chart */}
      {reviews.length > 0 && (
        <div className="mb-8">
          <RatingChart reviews={reviews} />
        </div>
      )}

      {/* Reviews Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {user && !userReview && (
            <Link
              to={`/books/${id}/review`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write Review
            </Link>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-secondary/50 rounded-lg border border-border">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-secondary/50 rounded-lg p-6 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{review.userId.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-primary text-primary" : "fill-none text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {user && review.userId._id === user.id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{review.reviewText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
