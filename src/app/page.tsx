"use client";

import { useState, useMemo, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleContext } from '@/context/ArticleContext';
import { AuthContext } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import TrendingArticleCard from '@/components/TrendingArticleCard';
import type { Article } from '@/types';

export default function Home() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const articleContext = useContext(ArticleContext);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authContext && !authContext.isAuthenticated && !authContext.loading) {
      router.push('/login');
    }
  }, [authContext, router]);


  if (!articleContext || !authContext || authContext.loading || !authContext.isAuthenticated) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <p>Loading...</p>
            </div>
        </div>
    );
  }

  const { articles, trendingArticle, loading } = articleContext;

  const publishedArticles = useMemo(() => {
    return articles
      .filter((article: Article) => article.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery) {
      return publishedArticles;
    }
    return publishedArticles.filter(
      (article: Article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [publishedArticles, searchQuery]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                <div className="h-40 bg-gray-300 rounded mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-48 bg-gray-300 rounded"></div>
                    <div className="h-48 bg-gray-300 rounded"></div>
                    <div className="h-48 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for articles..."
            className="pl-10 text-base py-6 rounded-full bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {trendingArticle && <TrendingArticleCard trendingArticle={trendingArticle} />}

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Latest Articles</h2>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-card rounded-lg shadow-sm">
                <p className="text-muted-foreground text-lg">No articles found.</p>
                {searchQuery && <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
