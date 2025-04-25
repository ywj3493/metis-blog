export function LoadingPage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-400 opacity-40">
      <LoadingDot />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="flex w-full items-center justify-center">
      <LoadingDot />
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="box-border inline-block h-32 w-32 animate-spin rounded-full border-4 border-gray-200 border-b-blue-300 " />
    </div>
  );
}

export function LoadingDot() {
  return <div className="h-24 w-24 animate-pulse rounded-full bg-gray-300" />;
}
