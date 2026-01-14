export default function ShopLoading() {
  return (
    <main className="min-h-screen px-6 pt-24 md:pt-40 pb-12 max-w-7xl mx-auto animate-pulse">
      
      {/* Page Header Skeleton */}
      <div className="mb-16 space-y-4 text-center">
        <div className="h-12 bg-stone-200 rounded-lg w-64 mx-auto" />
        <div className="h-6 bg-stone-200 rounded w-80 mx-auto" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            {/* Image skeleton */}
            <div className="aspect-[4/5] bg-stone-200 rounded-lg" />
            
            {/* Text skeletons */}
            <div className="text-center space-y-2">
              <div className="h-6 bg-stone-200 rounded w-32 mx-auto" />
              <div className="h-4 bg-stone-200 rounded w-16 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
