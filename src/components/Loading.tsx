export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-200"></div>
    </div>
  );
}

export function LoadingDot({ className = "" }) {
  return (
    <div className="animate-pulse rounded-full w-24 h-24 bg-gray-300"></div>
  );
}
