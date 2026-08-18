import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2 } from 'lucide-react';
import { SkillProgressBar } from './skill-progress-bar';

interface SkillItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
  descriptionEn: string | null;
  descriptionBn: string | null;
  level: number;
  order: number;
}

interface SkillsData {
  skills: SkillItem[];
  locale: 'en' | 'bn';
}

const CATEGORY_ORDER = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

export async function Skills({ data }: { data: SkillsData }) {
  const tSkills = await getTranslations('Skills');

  // Group by category
  const grouped = new Map<string, SkillItem[]>();
  for (const skill of data.skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill);
    grouped.set(skill.category, list);
  }

  // Sort categories in our preferred order
  const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
    const aIdx = CATEGORY_ORDER.indexOf(a);
    const bIdx = CATEGORY_ORDER.indexOf(b);
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  if (data.skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="border-y border-border bg-muted/20 py-16 sm:py-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {tSkills('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">{tSkills('title')}</h2>
        </div>

        <div className="space-y-10">
          {sortedCategories.map((category) => {
            const items = grouped.get(category) ?? [];
            const sortedItems = items.sort((a, b) => a.order - b.order);
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider">
                    <Code2 className="h-3 w-3" />
                    {category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{items.length} technologies</span>
                  <div className="ml-auto h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {sortedItems.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} locale={data.locale} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function SkillCard({ skill, locale }: { skill: SkillItem; locale: 'en' | 'bn' }) {
  const description = locale === 'bn' ? skill.descriptionBn : skill.descriptionEn;
  return (
    <Card className="group border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {skill.logoUrl ? (
            <img
              src={skill.logoUrl}
              alt={skill.name}
              className="h-8 w-8 shrink-0 rounded-md object-contain p-0.5"
              loading="lazy"
            />
          ) : (
            // Clean Code2 fallback for techs without an official logo (REST APIs, bcrypt, Auth.js)
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Code2 className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-semibold text-foreground">{skill.name}</p>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground" title={description}>
                {description}
              </p>
            )}
          </div>
        </div>
        {/* Progress bar + percentage on the same line */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <SkillProgressBar level={skill.level} />
          </div>
          <span className="shrink-0 font-mono text-[10px] font-semibold text-foreground">{skill.level}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
