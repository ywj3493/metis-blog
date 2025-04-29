export function slugify(title: string) {
  return title
    .toLowerCase() // 영어만 소문자 변환
    .replace(/\s+/g, "-") // 공백 → 하이픈
    .replace(/[^a-z0-9가-힣-]+/gi, "") // 영어 + 숫자 + 한글 + 하이픈만 허용
    .replace(/--+/g, "-") // 연속 하이픈 압축
    .replace(/^-+/, "") // 시작 하이픈 제거
    .replace(/-+$/, ""); // 끝 하이픈 제거
}
