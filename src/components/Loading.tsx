export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin w-32 h-32 border-4 border-gray-200 border-b-blue-300 rounded-full inline-block box-border "></div>
    </div>
  );
}

export function LoadingDot() {
  return (
    <div className="animate-pulse rounded-full w-24 h-24 bg-gray-300"></div>
  );
}
