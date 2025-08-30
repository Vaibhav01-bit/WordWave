
"use client";

import { useContext } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { ArticleContext } from '@/context/ArticleContext';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function SubmitPage() {
  const articleContext = useContext(ArticleContext);
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  if (!articleContext || !authContext) {
    return <div>Loading...</div>;
  }

  const { addArticle } = articleContext;
  const { user } = authContext;

  const onSubmit: SubmitHandler<ArticleFormValues> = (data) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to submit an article.",
        });
        return;
    }
    addArticle(data, user.username);
    toast({
      title: 'Article Submitted!',
      description: 'Your article has been sent for admin approval.',
    });
    form.reset();
    router.push('/profile');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Submit an Article</CardTitle>
          <CardDescription>Share your knowledge with the community. Your submission will be reviewed by an admin before publishing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a catchy title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your article content here..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Review
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
