'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Bot, Brain, Zap, Gauge, Save, Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/form-layout';
import { updateAntiBotSettings } from '@/lib/actions/anti-bot';

export function AntiBotConfigCard({
  antiBotEnabled,
  aiCrawlerRestricted,
  aggressiveBotProtection,
  rateLimitingEnabled,
}: {
  antiBotEnabled: boolean;
  aiCrawlerRestricted: boolean;
  aggressiveBotProtection: boolean;
  rateLimitingEnabled: boolean;
}) {
  const [bot, setBot] = React.useState(antiBotEnabled);
  const [ai, setAi] = React.useState(aiCrawlerRestricted);
  const [aggressive, setAggressive] = React.useState(aggressiveBotProtection);
  const [rateLimit, setRateLimit] = React.useState(rateLimitingEnabled);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (bot) formData.set('antiBotEnabled', 'on');
      if (ai) formData.set('aiCrawlerRestricted', 'on');
      if (aggressive) formData.set('aggressiveBotProtection', 'on');
      if (rateLimit) formData.set('rateLimitingEnabled', 'on');

      const result = await updateAntiBotSettings(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save anti-bot settings');
        toast.error(result.error ?? 'Failed to save anti-bot settings');
      } else {
        toast.success('Anti-bot settings saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-4 w-4 text-brand-blue" aria-hidden="true" />
              Anti-Bot Protection
            </CardTitle>
            <CardDescription>Reduce automated bots, scrapers, and AI crawlers</CardDescription>
          </div>
          <Badge className={bot ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
            {bot ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Master toggle */}
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="antiBotEnabled" className="flex items-center gap-1.5 text-sm font-medium">
                <Bot className="h-3.5 w-3.5" />
                Anti-Bot Protection
              </Label>
              <p className="text-xs text-muted-foreground">
                Enables bot detection signals (suspicious user agents, missing headers, automated patterns)
              </p>
            </div>
            <Switch id="antiBotEnabled" checked={bot} onCheckedChange={setBot} />
          </div>

          {/* AI Crawler Restriction */}
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="aiCrawlerRestricted" className="flex items-center gap-1.5 text-sm font-medium">
                <Brain className="h-3.5 w-3.5" />
                AI Crawler Restriction
              </Label>
              <p className="text-xs text-muted-foreground">
                Blocks known AI crawlers (GPTBot, ClaudeBot, CCBot, Bytespider, etc.) via robots.txt + server-side
              </p>
            </div>
            <Switch id="aiCrawlerRestricted" checked={ai} onCheckedChange={setAi} />
          </div>

          {/* Aggressive Bot Protection */}
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="aggressiveBotProtection" className="flex items-center gap-1.5 text-sm font-medium">
                <Zap className="h-3.5 w-3.5" />
                Aggressive Bot Protection
              </Label>
              <p className="text-xs text-muted-foreground">
                Stricter checks: headless browser detection, missing Accept headers, empty Referer on POST
              </p>
            </div>
            <Switch id="aggressiveBotProtection" checked={aggressive} onCheckedChange={setAggressive} />
          </div>

          {/* Rate Limiting */}
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="rateLimitingEnabled" className="flex items-center gap-1.5 text-sm font-medium">
                <Gauge className="h-3.5 w-3.5" />
                Rate Limiting
              </Label>
              <p className="text-xs text-muted-foreground">
                Limits: 5 login attempts/min, 3 contact submits/min, 30 requests/min for sensitive endpoints
              </p>
            </div>
            <Switch id="rateLimitingEnabled" checked={rateLimit} onCheckedChange={setRateLimit} />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSubmitting ? 'Saving...' : 'Save Anti-Bot Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
