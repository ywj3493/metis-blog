import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col gap-4 text-center">
      <Image
        className="mx-auto"
        src={"/mascot.png"}
        alt={"profile_image"}
        width={240}
        height={240}
        priority
      />
      <h2 className="text-3xl font-bold mt-8">{"안녕하세요. 메티입니다."}</h2>
      <h3 className="text-xl font-semibold">웹 프론트엔드 개발자</h3>
      <p>노션 TIL 에서 작성한 것을 공개하는 블로그 입니다.</p>
      <Link href="/guestbooks">
        <button className="bg-blue-200 font-bold rounded-xl py-4 px-16 text-gray-800">
          Contact
        </button>
      </Link>
    </section>
  );
}
