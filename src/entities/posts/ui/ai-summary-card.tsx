import Image from "next/image";

export function AISummaryCard({ summary }: { summary: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 shadow-sm dark:border-blue-800/30 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
      <div className="absolute top-2 right-2 opacity-10">
        <Image
          src={"/mascot.png"}
          alt="mascot-background"
          width={80}
          height={80}
          className="opacity-30"
        />
      </div>
      <div className="relative mb-3 flex items-center gap-3">
        <div className="flex-shrink-0 rounded-full bg-white p-2 shadow-sm dark:bg-gray-800">
          <Image src={"/mascot.png"} alt="mascot-icon" width={24} height={24} />
        </div>
        <div>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            메티가 요약해드렸어요!
          </p>
        </div>
      </div>
      <div className="relative rounded-lg bg-white/70 p-3 backdrop-blur-sm dark:bg-gray-800/70">
        <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
          {summary}
        </p>
      </div>
    </div>
  );
}
