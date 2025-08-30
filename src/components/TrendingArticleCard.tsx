import type { TrendingArticle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface TrendingArticleCardProps {
  trendingArticle: TrendingArticle;
}

export default function TrendingArticleCard({ trendingArticle }: TrendingArticleCardProps) {
  return (
    <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
            <Flame className="w-8 h-8 text-accent" />
            Trending Article
        </h2>
        <Card className="bg-gradient-to-br from-card to-secondary/50 shadow-lg border-accent/50">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{trendingArticle.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">{trendingArticle.summary}</p>
            </CardContent>
        </Card>
    </section>
  );
}
