import Link from 'next/link';
import type { Article } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const snippet = article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '');

  return (
    <Link href={`/articles/${article.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 border-border/60 hover:border-primary">
        <CardHeader>
          <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{article.title}</CardTitle>
          <CardDescription>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm leading-relaxed">{snippet}</p>
        </CardContent>
        <div className="p-6 pt-0 flex justify-end items-center">
            <span className="text-sm font-semibold text-primary flex items-center gap-2">
                Read More 
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
        </div>
      </Card>
    </Link>
  );
}
