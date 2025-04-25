export function LoadingPage() {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-400 opacity-40">
      <LoadingDot />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="w-full flex justify-center items-center">
      <LoadingDot />
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin w-32 h-32 border-4 border-gray-200 border-b-blue-300 rounded-full inline-block box-border " />
    </div>
  );
}

export function LoadingDot() {
  return <div className="animate-pulse rounded-full w-24 h-24 bg-gray-300" />;
}
