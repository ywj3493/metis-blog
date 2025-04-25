export function Tooltip({
  children,
  message,
}: {
  children: React.ReactNode;
  message: string;
  width?: number;
}) {
  return (
    <div className="tooltip-wrapper relative inline-block cursor-pointer">
      {children}
      <div className="-translate-x-1/2 tooltip-text invisible absolute bottom-full left-1/2 mb-2 w-auto transform overflow-visible whitespace-nowrap rounded bg-gray-700 px-8 py-2 text-white text-xs opacity-0 transition-opacity duration-300">
        {message}
        <div className="-translate-x-1/2 absolute top-full left-1/2 transform border-4 border-transparent border-t-gray-700" />
      </div>
    </div>
  );
}
