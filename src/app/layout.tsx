import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ArticleProvider } from '@/context/ArticleContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'WordWave',
  description: 'A blogging and article platform by WordWave.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-gradient-to-r from-background to-animated-background animate-gradient-move min-h-screen flex flex-col">
        <AuthProvider>
          <ArticleProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </ArticleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
