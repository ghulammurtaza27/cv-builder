export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse w-[8.5in] mx-auto p-2">
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
      {/* Add more skeleton elements as needed */}
    </div>
  );
} 