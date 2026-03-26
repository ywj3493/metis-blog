export interface ITag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface IPost {
  id: string;
  title: string;
  slugifiedTitle: string;
  tags: ITag[];
  cover: string;
  icon: string;
  publishTime: string;
  lastEditedTime: string;
  aiSummary: string;
}

export interface PostDatabaseResponse {
  id: string;
  properties: {
    제목: {
      title: {
        plain_text: string;
      }[];
    };
    Tags: {
      multi_select: ITag[];
    };
    날짜: {
      date: {
        start: string;
      };
    };
    summary?: {
      rich_text: {
        plain_text: string;
      }[];
    };
  };
  cover: {
    external?: {
      url?: string;
    };
  };
  icon?: {
    external?: {
      url?: string;
    };
  };
  last_edited_time: string;
}

export interface TagDatabaseResponse {
  id: string;
  color: string;
  name: string;
  description: string;
}
