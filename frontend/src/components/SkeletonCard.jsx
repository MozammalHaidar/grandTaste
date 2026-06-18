const SkeletonCard = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
)

export default SkeletonCard
