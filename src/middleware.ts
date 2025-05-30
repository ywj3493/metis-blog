import { isNotionPageId } from "@/entities/posts/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 미들웨어 전용 헬퍼, 추가되는 포스트는 미들웨어를 통한 리디렉션 필요 없을 가능성 농후
const slugMapHelper = {
  "18주차-타입챌린지-스터디": "1e63c18b-cccb-8077-a44e-e0447ff198c7",
  "17주차-타입챌린지-스터디": "1df3c18b-cccb-80b3-9637-ee21b8fc817f",
  "16주차-타입챌린지-스터디": "1d83c18b-cccb-809b-9dec-ce273b14d02b",
  "15주차-타입챌린지-스터디": "1d13c18b-cccb-80e4-a325-e9576e52f004",
  "14주차-타입챌린지-스터디": "1cb3c18b-cccb-804b-8bf6-fb87e6562901",
  "13주차-타입챌린지-스터디": "1c33c18b-cccb-80ba-9378-d94017cb8592",
  "12주차-타입챌린지-스터디": "1c23c18b-cccb-80f5-8ec4-f3f8bf3bc9a3",
  "11주차-타입챌린지-스터디": "1b93c18b-cccb-806a-8302-d9f9e18a5222",
  "10주차-타입챌린지-스터디": "1b33c18b-cccb-8079-a07e-d1d8d46f8e8f",
  "9주차-타입챌린지-스터디": "1ac3c18b-cccb-80b4-bbff-cb7462469ce0",
  "8주차-타입챌린지-스터디": "1a63c18b-cccb-8065-a180-da3106075995",
  "7주차-타입챌린지-스터디": "19e3c18b-cccb-80e3-b2a1-db284e7e71fb",
  "6주차-타입챌린지-스터디": "1983c18b-cccb-80b5-a43f-c8fe35d324c9",
  "5주차-타입챌린지-스터디": "1913c18b-cccb-807a-9e2b-c9d874f88e17",
  "4주차-타입챌린지-스터디": "18c3c18b-cccb-809c-90e3-ca7c7ba1b5de",
  "b2b-커머스-앱-프론트엔드-1인-개발-회고":
    "1823c18b-cccb-8010-b254-eee38996bd55",
  "react-프로젝트에서-디렉터리-기반-라우팅-적용":
    "de4ddaf8-e8be-4a75-a113-176538863d92",
  "프로젝트-별-node-버전-관리-방법-nvm": "edccc2c4-699c-4959-9ed8-15f750cb9a9a",
  "github-actions-pnpm-사용-이해와-gpt-driven-트러블슈팅의-위험성":
    "284a0624-6b4e-4e80-a2b5-7ca0fd557a7c",
  "vercel-배포-사이트-커스텀-도메인-적용":
    "a1b52cac-53e2-4794-8e64-fc3457696673",
  "nextjs-14-에서-notion-api-사용하기": "98d7f7b5-b883-49cc-bcdb-499ebd583500",
  "msw-nextjs-에-적용해보기클라이언트-사이드":
    "b715fc18-ad72-4a7e-8d75-49c2c73bc219",
  "자바스크립트-객체-리터럴": "6db34159-f906-4ccf-a830-13762a3f6125",
  "react-hook-form-간단-가이드": "0a7218fb-833d-48f7-b6d1-66b650561a91",
  "tanstack-query-간단-가이드": "5769fc4d-fcfd-452f-8ea1-fcc5594adfb6",
  "linux-ssh-서버-접속-가능하게-오픈하기":
    "cb58442d-7fa9-4e7d-b6fe-b9ba7cbf8138",
  "잘못-띄워놓은-verdaccio-서버-volume-찾아서-백업하기":
    "e7c27a56-d597-4548-be81-03f701981e06",
  "aws-lightsail-에-nextjs-배포하기": "6e92cc5a-989b-416f-b3d9-cff1451f448d",
  "symbolic-link-hard-link-inode": "9db67792-9ea9-4737-85af-5dabaa3dc7af",
  "never-any-unknown-mixed-타입-비교": "3260f9f4-ac4b-459d-9cfb-c4e556761eaf",
  "textarea-입력-3줄-까지만-늘어나게-하기":
    "2d3c8d71-1bca-426e-b4fb-80572681a52a",
  "margin-collapsing": "c4da5e12-6989-4d42-a4b8-15738c21fc38",
  "useeffect-와-uselayouteffect-차이": "d78be55b-4e0c-4e04-bc45-0602aed8ab2e",
  cors: "75f3c67c-22c1-41d1-9c0a-86bdcd18067b",
  "react-query-캐시-컨트롤": "bd84cb47-da67-40bb-a503-2e648b243c82",
  jsx: "b1c75d0b-156c-4998-8b0a-727453e0dd6a",
  "react-에서의-virtualdom": "d8efd355-1cda-4a43-a690-91cb6153a400",
  클로저: "8ba70209-4b89-4d0b-8313-ce9e0027e3e0",
};

const idMapHelper = Object.fromEntries(
  Object.entries(slugMapHelper).map(([slugifiedTitle, id]) => [
    id,
    slugifiedTitle,
  ]),
);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slugOrId = pathname.split("/posts/")[1];

  if (!slugOrId) {
    return NextResponse.next();
  }

  if (isNotionPageId(slugOrId)) {
    const slugifiedTitle = idMapHelper[slugOrId];

    if (slugifiedTitle) {
      const url = request.nextUrl.clone();
      url.pathname = `/posts/${slugifiedTitle}`;
      if (slugifiedTitle.includes("타입챌린지 스터디")) {
        url.pathname = "posts/타입챌린지-스터디-풀이-모음";
      }
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/posts/:path*",
};
