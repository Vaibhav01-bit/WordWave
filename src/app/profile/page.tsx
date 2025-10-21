
"use client";

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { ArticleContext } from '@/context/ArticleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Hourglass, User, Mail } from 'lucide-react';

export default function ProfilePage() {
  const authContext = useContext(AuthContext);
  const articleContext = useContext(ArticleContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.loading && !authContext?.isAuthenticated) {
      router.push('/login');
    }
  }, [authContext?.loading, authContext?.isAuthenticated, router]);

  if (!authContext || !articleContext || authContext.loading || !authContext.user) {
    return <div>Loading...</div>;
  }

  const { user, logout } = authContext;
  const { articles } = articleContext;

  const userArticles = articles
    .filter(article => article.author === user.username)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <User className="h-12 w-12 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold">{user.username}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <Button onClick={logout} variant="outline">Logout</Button>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Your Articles</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userArticles.length > 0 ? (
                  userArticles.map(article => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell className="text-right">
                        {article.published ? (
                          <Badge variant="default">
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      You haven't submitted any articles yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
