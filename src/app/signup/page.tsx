"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserPlus, AtSign, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';


export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real app, you would send this to your backend for user creation.
    console.log('Signing up with:', { username, email, password });
    
    // Simulate API call for account creation
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Account Created!',
        description: 'You can now log in with your new credentials.',
      });
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
            <CardDescription>Join our community and start sharing your ideas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourusername"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?&nbsp;
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
