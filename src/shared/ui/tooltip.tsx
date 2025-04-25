export function Tooltip({
  children,
  message,
}: {
  children: React.ReactNode;
  message: string;
  width?: number;
}) {
  return (
    <div className="relative inline-block cursor-pointer tooltip-wrapper">
      {children}
      <div
        className="absolute invisible overflow-visible bg-gray-700 text-white text-xs 
      whitespace-nowrap w-auto rounded py-2 px-8 bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 transition-opacity duration-300 tooltip-text"
      >
        {message}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
      </div>
    </div>
  );
}
