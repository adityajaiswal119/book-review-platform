import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const apiClient = axios.create({
  baseURL: API_URL,
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API methods
export const api = {
  // Auth
  async login(email: string, password: string) {
    const { data } = await apiClient.post("/auth/login", { email, password })
    return { success: true, data }
  },

  async signup(name: string, email: string, password: string) {
    const { data } = await apiClient.post("/auth/signup", { name, email, password })
    return { success: true, data }
  },

  // Books
  async getBooks(params?: { page?: number; limit?: number; search?: string; genre?: string; sortBy?: string }) {
    const { data } = await apiClient.get("/books", { params })
    return {
      success: true,
      data: data.books,
      pagination: {
        page: data.page,
        pages: data.totalPages,
        total: data.total,
      },
    }
  },

  async getBook(id: string) {
    const { data } = await apiClient.get(`/books/${id}`)
    return { success: true, data }
  },

  async createBook(bookData: any) {
    const { data } = await apiClient.post("/books", bookData)
    return { success: true, data }
  },

  async updateBook(id: string, bookData: any) {
    const { data } = await apiClient.put(`/books/${id}`, bookData)
    return { success: true, data }
  },

  async deleteBook(id: string) {
    await apiClient.delete(`/books/${id}`)
    return { success: true }
  },

  async getUserBooks() {
    const { data } = await apiClient.get("/books/user/me")
    return { success: true, data }
  },

  // Reviews
  async getBookReviews(bookId: string) {
    const { data } = await apiClient.get(`/reviews/book/${bookId}`)
    return { success: true, data }
  },

  async createReview(reviewData: any) {
    const { data } = await apiClient.post("/reviews", reviewData)
    return { success: true, data }
  },

  async updateReview(id: string, reviewData: any) {
    const { data } = await apiClient.put(`/reviews/${id}`, reviewData)
    return { success: true, data }
  },

  async deleteReview(id: string) {
    await apiClient.delete(`/reviews/${id}`)
    return { success: true }
  },

  async getUserReviews() {
    const { data } = await apiClient.get("/reviews/user/me")
    return { success: true, data }
  },
}

export default apiClient
