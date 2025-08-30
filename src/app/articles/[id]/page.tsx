"use client";

import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArticleContext } from '@/context/ArticleContext';
import type { Article } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const context = useContext(ArticleContext);
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (context && id) {
      const foundArticle = context.getArticleById(id);
      // For this app, we allow viewing unpublished articles if you have the link,
      // as there is no admin/user role separation.
      // In a real app, you would add: && foundArticle.published
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        setArticle(null); // Not found
      }
    }
  }, [context, id, context?.articles]);

  const handleLike = () => {
    if (context && id) {
        context.likeArticle(id);
    }
  }

  if (article === undefined || context?.loading) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="space-y-3 pt-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
  }

  if (article === null) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been moved.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold leading-tight tracking-tighter">{article.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-4">
            <Calendar className="h-4 w-4" />
            <span>Published on {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={handleLike}>
                <Heart className="mr-2 h-4 w-4" />
                Like ({article.likes || 0})
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
