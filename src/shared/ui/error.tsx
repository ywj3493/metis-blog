type ErrorSectionProps = {
  message?: string;
};

export function ErrorPage() {
  return <div>ErrorPage</div>;
}

export function ErrorSection({ message }: ErrorSectionProps) {
  const displayMessage = message
    ? message
    : "알수없는 오류로 인해 표시 할 수 없습니다.";
  return (
    <div className="w-full flex items-center justify-center">
      {displayMessage}
    </div>
  );
}
