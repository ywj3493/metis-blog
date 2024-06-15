import Image from "next/image";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import TooltipWrapper from "../TooltipWrapper";

export default function Hero() {
  return (
    <section className="flex flex-col gap-4 text-center items-center">
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
      <p>노션에 작성한 글들을 편하게 게시하기 위해 만들었습니다.</p>
      <p>블로그의 소스코드는 아래 버튼을 통해 확인해주세요.</p>

      <TooltipWrapper message="블로그 repository 주소">
        <Link href="https://github.com/ywj3493/metis-blog">
          <button className="bg-blue-200 font-bold rounded-xl py-4 px-16 text-gray-800 flex items-center gap-8 text-lg">
            Github <AiFillGithub />
          </button>
        </Link>
      </TooltipWrapper>
    </section>
  );
}
