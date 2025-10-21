
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Search, Newspaper, Mail, MessageSquare, ArrowRight, X } from 'lucide-react';

interface IntroductoryPageProps {
  onClose: () => void;
}

export default function IntroductoryPage({ onClose }: IntroductoryPageProps) {
  const [step, setStep] = useState(0);

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-brand-primary" />,
      title: 'Featured Articles',
      description: 'Discover our best content, hand-picked by our editors.',
    },
    {
      icon: <Search className="h-8 w-8 text-brand-primary" />,
      title: 'Search',
      description: 'Find articles on any topic with our powerful search engine.',
    },
    {
      icon: <Newspaper className="h-8 w-8 text-brand-primary" />,
      title: 'Categories',
      description: 'Explore articles organized by topic and category.',
    },
    {
      icon: <Mail className="h-8 w-8 text-brand-primary" />,
      title: 'Subscriptions',
      description: 'Subscribe to our newsletter to get the latest articles delivered to your inbox.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-brand-primary" />,
      title: 'Commenting',
      description: 'Join the conversation by leaving comments on your favorite articles.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl relative bg-brand-background border-brand-accent/50">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-brand-foreground/80 hover:text-brand-primary" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-brand-primary">Welcome to WordWave!</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="text-center">
              <p className="text-brand-foreground/80 mb-8">Your new favorite place to read, write, and explore.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg transition-colors hover:bg-brand-accent/10">
                    {feature.icon}
                    <h3 className="font-semibold mt-2 text-brand-foreground">{feature.title}</h3>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(1)} className="bg-brand-primary text-white hover:bg-brand-primary/90">
                Show Me How It Works <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-brand-primary">How It Works</h2>
              <ul className="space-y-4 text-brand-foreground/80">
                <li className="flex items-start gap-4">
                  <span className="font-bold text-brand-accent text-lg">1.</span>
                  <div>
                    <h4 className="font-semibold text-brand-foreground">Browse & Discover</h4>
                    <p>Start by browsing our featured articles, or use the search bar to find something specific.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-brand-accent text-lg">2.</span>
                  <div>
                    <h4 className="font-semibold text-brand-foreground">Engage & Interact</h4>
                    <p>Like and comment on articles to share your thoughts with the community.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-brand-accent text-lg">3.</span>
                  <div>
                    <h4 className="font-semibold text-brand-foreground">Subscribe & Stay Updated</h4>
                    <p>Subscribe to our newsletter to get the latest posts delivered straight to your inbox.</p>
                  </div>
                </li>
              </ul>
              <div className="flex justify-center gap-4 mt-8">
                <Button onClick={onClose} className="bg-brand-primary text-white hover:bg-brand-primary/90">Start Browsing</Button>
                <Button variant="outline" onClick={onClose} className="border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white">Subscribe</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
