"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Article, TrendingArticle } from '@/types';
import { generateTrendingSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface ArticleContextType {
  articles: Article[];
  trendingArticle: TrendingArticle | null;
  loading: boolean;
  addArticle: (article: Omit<Article, 'id' | 'published' | 'createdAt' | 'likes'>) => void;
  updateArticleStatus: (id: string, published: boolean) => void;
  deleteArticle: (id: string) => void;
  likeArticle: (id: string) => void;
  setTrendingArticle: (article: Article) => Promise<void>;
  getArticleById: (id: string) => Article | undefined;
}

export const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

const ARTICLES_STORAGE_KEY = 'devnovate_articles';
const TRENDING_ARTICLE_STORAGE_KEY = 'devnovate_trending_article';

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticle, setTrendingArticleState] = useState<TrendingArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const articlesFromStorage = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (articlesFromStorage) {
        setArticles(JSON.parse(articlesFromStorage));
      }
      const trendingFromStorage = localStorage.getItem(TRENDING_ARTICLE_STORAGE_KEY);
      if (trendingFromStorage) {
        setTrendingArticleState(JSON.parse(trendingFromStorage));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistArticles = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedArticles));
  };
  
  const persistTrendingArticle = (trending: TrendingArticle | null) => {
    setTrendingArticleState(trending);
    if(trending) {
        localStorage.setItem(TRENDING_ARTICLE_STORAGE_KEY, JSON.stringify(trending));
    } else {
        localStorage.removeItem(TRENDING_ARTICLE_STORAGE_KEY);
    }
  };

  const addArticle = useCallback((articleData: Omit<Article, 'id' | 'published' | 'createdAt' | 'likes'>) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      published: false,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    const updatedArticles = [newArticle, ...articles];
    persistArticles(updatedArticles);
  }, [articles]);

  const updateArticleStatus = useCallback((id: string, published: boolean) => {
    const updatedArticles = articles.map(article =>
      article.id === id ? { ...article, published } : article
    );
    persistArticles(updatedArticles);
  }, [articles]);

  const deleteArticle = useCallback((id: string) => {
    const updatedArticles = articles.filter(article => article.id !== id);
    persistArticles(updatedArticles);
    toast({
        title: "Article Deleted",
        description: "The article has been successfully deleted.",
    });
  }, [articles, toast]);

  const likeArticle = useCallback((id: string) => {
    const updatedArticles = articles.map(article =>
        article.id === id ? { ...article, likes: (article.likes || 0) + 1 } : article
    );
    persistArticles(updatedArticles);
  }, [articles]);
  
  const setTrendingArticle = async (article: Article) => {
      try {
        const result = await generateTrendingSummary(article.title, article.content);
        if (result && result.articleSummary) {
          const newTrendingArticle = {
            title: article.title,
            summary: result.articleSummary
          };
          persistTrendingArticle(newTrendingArticle);
          toast({
            title: "Success",
            description: `"${article.title}" is now the trending article.`,
          });
        } else {
            throw new Error("Failed to generate summary.")
        }
      } catch (error) {
        console.error("Failed to set trending article:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate trending summary. Please try again.",
        });
      }
  };

  const getArticleById = useCallback((id: string) => {
    return articles.find(article => article.id === id);
  }, [articles]);

  const value = {
    articles,
    trendingArticle,
    loading,
    addArticle,
    updateArticleStatus,
    deleteArticle,
    likeArticle,
    setTrendingArticle,
    getArticleById,
  };

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
}
