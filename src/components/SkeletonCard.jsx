export default function SkeletonCard() {
  return (
    <div className="animate-pulse md:px-4 md:py-4 space-y-2">
      <div className="bg-gray-300 rounded-md w-full aspect-[253/337]" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-8 bg-gray-300 rounded w-full" />
    </div>
  );
}
