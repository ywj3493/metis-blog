export function LoadingPage() {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-400 opacity-40">
      <Loading />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="w-full flex justify-center items-center">
      <Loading />
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 z-1">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-green-500"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-yellow-500"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-red-500"></div>
      </div>
    </div>
  );
}
