// ─── Base Skeleton Block ─────────────────────────────────────
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
)

// ─── Product Card Skeleton (already have SkeletonCard) ───────
export const SkeletonCard = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-5 space-y-3">
      <SkeletonBlock className="h-3 w-1/3" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <div className="flex justify-between items-center pt-1">
        <SkeletonBlock className="h-6 w-1/4" />
        <SkeletonBlock className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  </div>
)

// ─── Order Card Skeleton ─────────────────────────────────────
export const SkeletonOrderCard = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-6 w-20 rounded-full" />
        <SkeletonBlock className="h-6 w-16" />
        <SkeletonBlock className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
)

// ─── Product Detail Skeleton ─────────────────────────────────
export const SkeletonProductDetail = () => (
  <div className="container-custom py-10 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image */}
      <SkeletonBlock className="h-80 lg:h-96 rounded-3xl" />
      {/* Info */}
      <div className="space-y-4">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-3/4" />
        <SkeletonBlock className="h-4 w-1/3" />
        <SkeletonBlock className="h-10 w-1/4" />
        <SkeletonBlock className="h-20 w-full" />
        <div className="flex gap-4">
          <SkeletonBlock className="h-16 flex-1 rounded-xl" />
          <SkeletonBlock className="h-16 flex-1 rounded-xl" />
        </div>
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
)

// ─── Cart Item Skeleton ──────────────────────────────────────
export const SkeletonCartItem = () => (
  <div className="card p-4 flex items-center gap-4 animate-pulse">
    <SkeletonBlock className="w-20 h-20 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <SkeletonBlock className="h-4 w-1/4" />
    </div>
    <SkeletonBlock className="w-24 h-9 rounded-xl" />
    <div className="text-right space-y-2">
      <SkeletonBlock className="h-4 w-16" />
      <SkeletonBlock className="h-3 w-12" />
    </div>
  </div>
)

// ─── Profile Skeleton ────────────────────────────────────────
export const SkeletonProfile = () => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-pulse">
    {/* Sidebar */}
    <div className="lg:col-span-1 space-y-4">
      <div className="card p-6 text-center space-y-3">
        <SkeletonBlock className="w-24 h-24 rounded-full mx-auto" />
        <SkeletonBlock className="h-4 w-32 mx-auto" />
        <SkeletonBlock className="h-3 w-40 mx-auto" />
      </div>
      <div className="card overflow-hidden">
        {[1, 2].map((i) => (
          <div key={i} className="px-5 py-3.5 border-b border-gray-100 last:border-0">
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
    {/* Main */}
    <div className="lg:col-span-3">
      <div className="card p-6 space-y-5">
        <SkeletonBlock className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <SkeletonBlock className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  </div>
)

// ─── Home Featured Skeleton ──────────────────────────────────
export const SkeletonFeatured = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
)

// ─── Home Category Skeleton ──────────────────────────────────
export const SkeletonCategories = () => (
  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-orange-50 rounded-2xl p-4 text-center animate-pulse">
        <SkeletonBlock className="w-14 h-14 rounded-xl mx-auto mb-2" />
        <SkeletonBlock className="h-3 w-16 mx-auto" />
      </div>
    ))}
  </div>
)

// ─── Order Detail Skeleton ───────────────────────────────────
export const SkeletonOrderDetail = () => (
  <div className="container-custom py-8 animate-pulse space-y-6">
    {/* Tracking card */}
    <div className="bg-white rounded-3xl p-6 space-y-6">
      <div className="flex justify-between">
        <SkeletonBlock className="h-6 w-48" />
        <SkeletonBlock className="h-6 w-32 rounded-full" />
      </div>
      <SkeletonBlock className="h-16 w-full rounded-2xl" />
      <div className="flex justify-between">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <SkeletonBlock className="w-12 h-12 rounded-2xl" />
            <SkeletonBlock className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
    {/* Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <SkeletonBlock className="h-6 w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-20" />
                </div>
              </div>
              <SkeletonBlock className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <SkeletonBlock className="h-6 w-32" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
)