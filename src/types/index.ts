
export interface Article {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  likes: number;
  author: string;
  readingTime: number;
}

export interface TrendingArticle {
  title: string;
  summary: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}
