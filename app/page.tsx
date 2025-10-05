"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Book {
  _id: string
  title: string
  author: string
  description: string
  genre: string
  publishedYear: number
  averageRating: number
  reviewCount: number
  addedBy: {
    name: string
  }
}

const genres = [
  "All",
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
]

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchBooks()
  }, [page, genre, sortBy])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await api.getBooks({
        page,
        limit: 5,
        search: search || undefined,
        genre: genre !== "All" ? genre : undefined,
        sortBy: sortBy === "rating" ? "rating" : sortBy === "year" ? "year" : undefined,
      })

      if (response.success) {
        setBooks(response.data)
        setTotalPages(response.pagination.pages)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchBooks()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-balance text-5xl font-bold leading-tight">
          Discover Your Next
          <br />
          Great Read
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          Explore thousands of books, read reviews from fellow readers, and share your own thoughts on the books you
          love.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="year">Published Year</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : books.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No books found. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Link key={book._id} href={`/books/${book._id}`}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <CardTitle className="text-balance leading-tight">{book.title}</CardTitle>
                      <Badge variant="secondary">{book.genre}</Badge>
                    </div>
                    <CardDescription>
                      by {book.author} • {book.publishedYear}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {book.averageRating > 0 ? book.averageRating.toFixed(1) : "No ratings"}
                        </span>
                        {book.reviewCount > 0 && (
                          <span className="text-sm text-muted-foreground">({book.reviewCount})</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">Added by {book.addedBy.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
