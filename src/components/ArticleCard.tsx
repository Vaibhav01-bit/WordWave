
import Link from 'next/link';
import type { Article } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ArrowRight, User, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onLike: (id: string) => void;
}

export default function ArticleCard({ article, onLike }: ArticleCardProps) {
  const snippet = article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '');

  return (
    <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border-border/60 hover:border-brand-primary bg-white">
       <Link href={`/articles/${article.id}`} className="group block flex-grow">
        <CardHeader>
          <CardTitle className="text-xl leading-tight text-brand-foreground group-hover:text-brand-primary transition-colors">{article.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 text-xs text-brand-foreground/80">
            <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.readingTime} min read</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-brand-foreground/90 text-sm leading-relaxed break-words">{snippet}</p>
        </CardContent>
      </Link>
      <div className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onLike(article.id)} className="text-brand-accent hover:text-brand-secondary">
            <ThumbsUp className="h-5 w-5" />
          </Button>
          <span className="text-sm text-brand-foreground/80">{article.likes}</span>
        </div>
        <Link href={`/articles/${article.id}`} className="group text-sm font-semibold text-brand-primary flex items-center gap-2">
          Read More
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
