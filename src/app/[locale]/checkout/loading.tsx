export default function CheckoutLoading() {
  return (
    <section className="bg-[#f9f7f2] py-16 animate-pulse">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Heading skeleton */}
        <div className="text-center mb-12">
          <div className="h-3 bg-stone-200 rounded w-24 mx-auto mb-4" />
          <div className="h-8 bg-stone-200 rounded w-64 mx-auto mb-2" />
          <div className="h-4 bg-stone-200 rounded w-80 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: Form skeleton */}
          <div className="rounded-3xl border border-[#d8d3c4] bg-white/70 p-8 shadow-lg space-y-6">
            
            {/* Section label */}
            <div className="h-3 bg-stone-200 rounded w-32" />
            
            {/* Address search */}
            <div className="space-y-2">
              <div className="h-4 bg-stone-200 rounded w-24" />
              <div className="h-14 bg-stone-200 rounded-xl" />
            </div>
            
            {/* Form fields */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-stone-200 rounded w-20" />
                <div className="h-12 bg-stone-200 rounded-xl" />
              </div>
            ))}
            
            {/* Map placeholder */}
            <div className="h-48 bg-stone-200 rounded-xl" />
            
            {/* Submit button */}
            <div className="h-14 bg-stone-300 rounded-xl" />
          </div>

          {/* RIGHT: Order summary skeleton */}
          <div className="rounded-3xl border border-[#d8d3c4] bg-white/70 p-8 shadow-lg space-y-6 h-fit">
            
            {/* Section label */}
            <div className="h-3 bg-stone-200 rounded w-28" />
            
            {/* Cart items */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-stone-200">
                <div className="w-20 h-24 bg-stone-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-stone-200 rounded w-32" />
                  <div className="h-3 bg-stone-200 rounded w-24" />
                  <div className="h-4 bg-stone-200 rounded w-16" />
                </div>
              </div>
            ))}
            
            {/* Totals */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <div className="h-4 bg-stone-200 rounded w-16" />
                <div className="h-4 bg-stone-200 rounded w-20" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-stone-200 rounded w-20" />
                <div className="h-4 bg-stone-200 rounded w-16" />
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <div className="h-6 bg-stone-200 rounded w-14" />
                <div className="h-6 bg-stone-200 rounded w-24" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
