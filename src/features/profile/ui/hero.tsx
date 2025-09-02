import Image from "next/image";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <Image
        className="mx-auto"
        src={"/mascot.png"}
        alt={"profile_image"}
        width={240}
        height={240}
        priority
      />
      <h2 className="mt-4 font-bold text-3xl">안녕하세요. 메티입니다.</h2>
      <p>노션에서 작성한 TIL을 쉽게 공개하기 위해 만든 블로그 입니다!</p>
      <p>블로그의 소스코드는 아래 버튼을 통해 확인해주세요.</p>
      <Tooltip>
        <TooltipTrigger>
          <Link href="https://github.com/ywj3493/metis-blog">
            <button
              type="button"
              className="flex items-center gap-1 rounded-xl bg-blue-200 px-8 py-2 font-bold text-gray-800 text-xl"
            >
              Github <AiFillGithub />
            </button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>블로그 repository 주소</p>
        </TooltipContent>
      </Tooltip>
    </section>
  );
}
