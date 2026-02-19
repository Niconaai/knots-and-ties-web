export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-stone-50 animate-pulse">
      <div className="lg:grid lg:grid-cols-12 relative max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN: Gallery Skeleton */}
        <div className="lg:col-span-8 w-full pt-24 pb-24 px-6 lg:pl-16 lg:pr-12">
          {/* Back button skeleton */}
          <div className="lg:hidden h-4 bg-stone-200 rounded w-20 mb-6" />
          
          {/* Main image skeleton */}
          <div className="aspect-[4/5] bg-stone-200 rounded-lg mb-4" />
          
          {/* Thumbnail grid skeleton */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-stone-200 rounded" />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Configurator Skeleton */}
        <div className="lg:col-span-4 w-full px-6 lg:pl-4 lg:pr-16 pb-12 relative">
          <div className="sticky top-32 space-y-8">
            
            {/* Back button skeleton (desktop) */}
            <div className="hidden lg:block h-4 bg-stone-200 rounded w-16" />
            
            {/* Title skeleton */}
            <div className="space-y-3">
              <div className="h-10 bg-stone-200 rounded w-48" />
              <div className="h-6 bg-stone-200 rounded w-20" />
            </div>
            
            {/* Description skeleton */}
            <div className="h-4 bg-stone-200 rounded w-40" />
            
            {/* Color swatches skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-stone-200 rounded w-16" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-stone-200 rounded-full" />
                ))}
              </div>
            </div>
            
            {/* Options skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-stone-200 rounded w-20" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-stone-200 rounded-lg w-24" />
                ))}
              </div>
            </div>
            
            {/* Quantity and button skeleton */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-stone-200 rounded w-20" />
                <div className="h-10 bg-stone-200 rounded-lg w-32" />
              </div>
              <div className="h-14 bg-stone-300 rounded-xl w-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
