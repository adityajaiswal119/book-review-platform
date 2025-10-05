"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Star, Edit, Trash2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import api from "../lib/api"

export default function Profile() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [booksRes, reviewsRes] = await Promise.all([api.get("/books/user/me"), api.get("/reviews/user/me")])
      setBooks(booksRes.data)
      setReviews(reviewsRes.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      await api.delete(`/books/${bookId}`)
      fetchUserData()
    } catch (error) {
      alert("Failed to delete book")
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      await api.delete(`/reviews/${reviewId}`)
      fetchUserData()
    } catch (error) {
      alert("Failed to delete review")
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3"></div>
          <div className="h-32 bg-secondary rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-secondary/50 rounded-lg p-8 border border-border mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-3xl font-bold text-primary">{books.length}</div>
            <div className="text-sm text-muted-foreground">Books Added</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-3xl font-bold text-primary">{reviews.length}</div>
            <div className="text-sm text-muted-foreground">Reviews Written</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <div className="text-3xl font-bold text-primary">
              {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating Given</div>
          </div>
        </div>
      </div>

      {/* Books Added */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Books</h2>
        {books.length === 0 ? (
          <div className="text-center py-12 bg-secondary/50 rounded-lg border border-border">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">You haven't added any books yet</p>
            <Link
              to="/books/add"
              className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <div key={book._id} className="bg-secondary/50 rounded-lg p-6 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{book.genre}</span>
                  <div className="flex gap-2">
                    <Link to={`/books/${book._id}/edit`} className="p-1 hover:bg-accent rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="p-1 hover:bg-accent rounded transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Link to={`/books/${book._id}`} className="block">
                  <h3 className="text-lg font-bold mb-1 hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-semibold">
                      {book.averageRating ? book.averageRating.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-sm text-muted-foreground">({book.reviewCount || 0} reviews)</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Written */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-secondary/50 rounded-lg border border-border">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">You haven't written any reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-secondary/50 rounded-lg p-6 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      to={`/books/${review.bookId._id}`}
                      className="text-lg font-bold hover:text-primary transition-colors"
                    >
                      {review.bookId.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">by {review.bookId.author}</p>
                    <div className="flex items-center gap-2 mt-2">
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
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
