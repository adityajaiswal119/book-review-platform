"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react"
import api from "../lib/api"

export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const genres = ["Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Fantasy", "Romance", "Thriller", "Biography"]

  useEffect(() => {
    fetchBooks()
  }, [search, genre, sort, page])

  // const fetchBooks = async () => {
  //   try {
  //     setLoading(true)
  //     const { data } = await api.get("/books", {
  //       params: { search, genre, sort, page, limit: 6 },
  //     })
  //     setBooks(data.books)
  //     setTotalPages(data.totalPages)
  //   } catch (error) {
  //     console.error("Error fetching books:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  const fetchBooks = async () => {
  try {
    setLoading(true)
    const { data } = await api.get("/books", {
      params: { search, genre, sort, page, limit: 6 },
    })
    setBooks(Array.isArray(data.books) ? data.books : [])
    setTotalPages(data.totalPages || 1)
  } catch (error) {
    console.error("Error fetching books:", error)
    setBooks([]) // ensure it's never undefined
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
          Discover Your Next
          <span className="text-primary"> Great Read</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Share your thoughts, explore reviews, and find books that inspire you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-3 bg-secondary border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 bg-secondary border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Top Rated</option>
            <option value="year">By Year</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-secondary rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : !books || books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No books found. Be the first to add one!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="group bg-secondary/50 rounded-lg p-6 border border-border hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{book.genre}</span>
                  <span className="text-sm text-muted-foreground">{book.publishedYear}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-muted-foreground mb-3">by {book.author}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{book.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-semibold">{book.averageRating ? book.averageRating.toFixed(1) : "N/A"}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({book.reviewCount || 0} {book.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
