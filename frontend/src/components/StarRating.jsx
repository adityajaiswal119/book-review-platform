"use client"

import { Star } from "lucide-react"

export default function StarRating({ rating, onRatingChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`w-6 h-6 ${star <= rating ? "fill-primary text-primary" : "fill-none text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  )
}
