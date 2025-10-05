"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen } from "lucide-react"
import api from "../lib/api"

export default function AddBook() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publishedYear: new Date().getFullYear(),
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const genres = ["Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Fantasy", "Romance", "Thriller", "Biography"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data } = await api.post("/books", formData)
      navigate(`/books/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Add New Book</h1>
        <p className="text-muted-foreground">Share a book with the community</p>
      </div>

      <div className="bg-secondary/50 rounded-lg p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="The Great Gatsby"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author *
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="F. Scott Fitzgerald"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="A brief description of the book..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-2">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="publishedYear" className="block text-sm font-medium mb-2">
                Published Year *
              </label>
              <input
                id="publishedYear"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleChange}
                required
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
