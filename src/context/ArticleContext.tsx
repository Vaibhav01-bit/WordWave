
"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Article, TrendingArticle } from '@/types';
import { generateTrendingSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface ArticleContextType {
  articles: Article[];
  trendingArticle: TrendingArticle | null;
  loading: boolean;
  addArticle: (article: Omit<Article, 'id' | 'published' | 'createdAt' | 'likes' | 'author'>, author: string) => void;
  updateArticleStatus: (id: string, published: boolean) => void;
  deleteArticle: (id: string) => void;
  likeArticle: (id: string) => void;
  setTrendingArticle: (article: Article) => Promise<void>;
  getArticleById: (id: string) => Article | undefined;
}

export const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

const ARTICLES_STORAGE_KEY = 'wordwave_articles';
const TRENDING_ARTICLE_STORAGE_KEY = 'wordwave_trending_article';

const sampleArticle: Article = {
  id: '1',
  title: 'Getting Started with Next.js',
  content: 'Next.js is a React framework for building full-stack web applications. You can use React Components to build user interfaces, and Next.js for additional features and optimizations.\n\nUnder the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more. This allows you to focus on building your application instead of spending time with configuration.\n\nWhether you\'re an individual developer or part of a larger team, Next.js can help you build interactive, dynamic, and fast React applications.',
  published: true,
  createdAt: new Date().toISOString(),
  likes: 15,
  author: 'admin',
};

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticle, setTrendingArticleState] = useState<TrendingArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const articlesFromStorage = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (articlesFromStorage) {
        const parsedArticles = JSON.parse(articlesFromStorage);
        if (parsedArticles.length > 0) {
            setArticles(parsedArticles);
        } else {
            setArticles([sampleArticle]);
        }
      } else {
        setArticles([sampleArticle]);
      }
      const trendingFromStorage = localStorage.getItem(TRENDING_ARTICLE_STORAGE_KEY);
      if (trendingFromStorage) {
        setTrendingArticleState(JSON.parse(trendingFromStorage));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setArticles([sampleArticle]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const persistTrendingArticle = useCallback((trending: TrendingArticle | null) => {
    setTrendingArticleState(trending);
    if(trending) {
        localStorage.setItem(TRENDING_ARTICLE_STORAGE_KEY, JSON.stringify(trending));
    } else {
        localStorage.removeItem(TRENDING_ARTICLE_STORAGE_KEY);
    }
  }, []);

  const addArticle = useCallback((articleData: Omit<Article, 'id' | 'published' | 'createdAt' | 'likes' | 'author'>, author: string) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      published: false,
      createdAt: new Date().toISOString(),
      likes: 0,
      author: author,
    };
    setArticles(prevArticles => {
        const updatedArticles = [newArticle, ...prevArticles];
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedArticles));
        return updatedArticles;
    });
  }, []);

  const updateArticleStatus = useCallback((id: string, published: boolean) => {
    setArticles(prevArticles => {
        const articleToUpdate = prevArticles.find(article => article.id === id);
        if (!articleToUpdate) {
            return prevArticles;
        }

        const updatedArticles = prevArticles.map(article =>
            article.id === id ? { ...article, published } : article
        );

        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedArticles));

        toast({
            title: `Article ${published ? 'Published' : 'Unpublished'}`,
            description: `"${articleToUpdate.title}" has been successfully ${published ? 'published' : 'unpublished'}.`,
        });

        return updatedArticles;
    });
  }, [toast]);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prevArticles => {
        const articleToDelete = prevArticles.find(article => article.id === id);
        if (!articleToDelete) {
            return prevArticles;
        }

        const updatedArticles = prevArticles.filter(article => article.id !== id);
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedArticles));

        toast({
            title: "Article Deleted",
            description: `"${articleToDelete.title}" has been successfully deleted.`,
        });

        return updatedArticles;
    });
  }, [toast]);

  const likeArticle = useCallback((id: string) => {
    setArticles(prevArticles => {
        const updatedArticles = prevArticles.map(article =>
            article.id === id ? { ...article, likes: (article.likes || 0) + 1 } : article
        );
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedArticles));
        return updatedArticles;
    });
  }, []);
  
  const setTrendingArticle = useCallback(async (article: Article) => {
    // Immediately set the trending article with a placeholder summary
    const newTrendingArticle: TrendingArticle = {
      title: article.title,
      summary: 'Generating summary...'
    };
    persistTrendingArticle(newTrendingArticle);
    toast({
        title: "Trending Article Updated",
        description: `"${article.title}" is now trending. Summary is being generated.`,
    });

    // Generate the summary in the background
    try {
        const result = await generateTrendingSummary(article.title, article.content);
        if (result && result.articleSummary) {
          const finalTrendingArticle = {
            ...newTrendingArticle,
            summary: result.articleSummary
          };
          persistTrendingArticle(finalTrendingArticle);
        } else {
            throw new Error("Failed to generate summary.");
        }
    } catch (error) {
        console.error("Failed to set trending article:", error);
        // Optionally revert or show an error state
        const errorTrendingArticle = {
            ...newTrendingArticle,
            summary: 'Could not generate summary. Please try again.'
        };
        persistTrendingArticle(errorTrendingArticle);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate trending summary.",
        });
    }
  }, [toast, persistTrendingArticle]);

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
