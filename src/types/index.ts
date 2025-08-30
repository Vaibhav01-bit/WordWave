export interface Article {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export interface TrendingArticle {
  title: string;
  summary: string;
}
