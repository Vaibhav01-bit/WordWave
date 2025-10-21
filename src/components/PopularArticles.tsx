
"use client";

import Link from 'next/link';
import type { Article } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface PopularArticlesProps {
  articles: Article[];
}

export default function PopularArticles({ articles }: PopularArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Flame className="h-6 w-6 text-primary" />
        <CardTitle>Most Popular This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li key={article.id} className="flex items-start gap-4">
                <span className="font-bold text-xl text-primary">{index + 1}</span>
                <div>
                    <Link href={`/articles/${article.id}`} className="font-semibold hover:underline">
                        {article.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{article.likes} likes</p>
                </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
