'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface TestimonialItem {
  id: string;
  authorName: string;
  authorRoleEn: string | null;
  authorRoleBn: string | null;
  companyEn: string | null;
  companyBn: string | null;
  avatarUrl: string | null;
  contentEn: string;
  contentBn: string;
  rating: number;
}

interface TestimonialsData {
  testimonials: TestimonialItem[];
  locale: 'en' | 'bn';
}

export function Testimonials({ data }: { data: TestimonialsData }) {
  const t = useTranslations('Testimonials');
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = React.useState(0);
  const [autoPlay, setAutoPlay] = React.useState(true);

  // Filter active testimonials (server should already filter, but client-side safety)
  const items = data.testimonials;
  const count = items.length;

  // Auto-advance every 6 seconds
  React.useEffect(() => {
    if (!autoPlay || count <= 1 || prefersReduced) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoPlay, count, prefersReduced]);

  // Pause on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  if (count === 0) {
    return null;
  }

  const current_item = items[current] ?? items[0]!;
  const authorRole = data.locale === 'bn' ? current_item.authorRoleBn : current_item.authorRoleEn;
  const company = data.locale === 'bn' ? current_item.companyBn : current_item.companyEn;
  const content = data.locale === 'bn' ? current_item.contentBn : current_item.contentEn;

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container>
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {t('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">{t('title')}</h2>
        </div>

        <div className="relative mx-auto w-full max-w-5xl">
          {/* Card */}
          <Card className="border-border bg-card shadow-card">
            <CardContent className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current_item.id}
                  initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Quote icon */}
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-primary/30" aria-hidden="true" />
                    {/* Rating stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={idx < current_item.rating ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4 text-muted-foreground/30'}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <blockquote className="text-body-lg leading-relaxed text-foreground">
                    "{content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <Avatar className="h-12 w-12 border border-border">
                      {current_item.avatarUrl ? (
                        <AvatarImage src={current_item.avatarUrl} alt={current_item.authorName} />
                      ) : (
                        <AvatarFallback className="bg-gradient-brand text-sm font-semibold text-white">
                          {current_item.authorName
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p.charAt(0).toUpperCase())
                            .join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{current_item.authorName}</p>
                      {(authorRole || company) && (
                        <p className="text-xs text-muted-foreground">
                          {[authorRole, company].filter(Boolean).join(' @ ')}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation arrows */}
          {count > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-card-hover"
                onClick={() => setCurrent((c) => (c - 1 + count) % count)}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-background shadow-card-hover"
                onClick={() => setCurrent((c) => (c + 1) % count)}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Dots */}
        {count > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === current ? 'w-8 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
