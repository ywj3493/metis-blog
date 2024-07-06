export interface IGuestbook {
  id: string;
  name: string;
  content: string;
  date: string;
  status: string;
}

export interface MetisGuestbookDatabaseResponse {
  id: string;
  properties: {
    작성자: {
      title: {
        plain_text: string;
      }[];
    };
    방명록: {
      rich_text: {
        plain_text: string;
      }[];
    };
    남긴날짜: {
      date: {
        start: string;
      };
    };
    상태: {
      status: {
        name: "공개" | "비공개";
      };
    };
  };
}
