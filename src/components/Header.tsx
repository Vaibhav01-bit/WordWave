
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useContext } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from './icons/Logo';
import { AuthContext } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }
  
  const { isAuthenticated, logout, user } = authContext;

  const navLinks = isAuthenticated ? [
    { href: '/', label: 'Home' },
    { href: '/submit', label: 'Submit Article' },
    { href: '/profile', label: 'Profile' },
    ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
  ] : [
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
      onClick={() => setMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">WordWave</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.username}</span>
            </div>
          )}
          {navLinks.map(link => <NavLink key={link.href} {...link} />)}
           {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex justify-between items-center p-4 -m-4 mb-4 border-b">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold text-sm">WordWave</span>
                  </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close Menu</span>
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                 {isAuthenticated && (
                    <Button variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }} className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
