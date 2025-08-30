"use client";

import { useContext, useState } from 'react';
import { ArticleContext } from '@/context/ArticleContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/types';
import { Flame, CheckCircle, Hourglass, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminPage() {
  const context = useContext(ArticleContext);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { articles, updateArticleStatus, setTrendingArticle, loading, deleteArticle } = context;

  const handleSetTrending = async (article: Article) => {
    setIsSubmitting(article.id);
    await setTrendingArticle(article);
    setIsSubmitting(null);
  };
  
  const sortedArticles = [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>Manage article submissions and feature trending content.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading articles...</p>
          ) : (
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Publish</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedArticles.length > 0 ? sortedArticles.map((article) => (
                    <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>
                        {article.published ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Published
                            </Badge>
                        ) : (
                            <Badge variant="secondary">
                                <Hourglass className="mr-1 h-3 w-3" />
                                Pending
                            </Badge>
                        )}
                        </TableCell>
                        <TableCell className="text-center">
                        <Switch
                            checked={article.published}
                            onCheckedChange={(checked) => updateArticleStatus(article.id, checked)}
                            aria-label={`Publish status for ${article.title}`}
                        />
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetTrending(article)}
                            disabled={isSubmitting === article.id}
                        >
                            <Flame className="mr-2 h-4 w-4 text-accent" />
                            {isSubmitting === article.id ? 'Generating...' : 'Make Trending'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the article.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteArticle(article.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        </TableCell>
                    </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No articles submitted yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
