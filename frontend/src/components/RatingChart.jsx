import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RatingChart({ reviews }) {
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  reviews.forEach((review) => {
    ratingCounts[review.rating]++
  })

  const data = [
    { rating: "5★", count: ratingCounts[5] },
    { rating: "4★", count: ratingCounts[4] },
    { rating: "3★", count: ratingCounts[3] },
    { rating: "2★", count: ratingCounts[2] },
    { rating: "1★", count: ratingCounts[1] },
  ]

  return (
    <div className="bg-secondary/50 rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
          <YAxis dataKey="rating" type="category" stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
