import { getTranslations } from 'next-intl/server';
import {
  Code2, Server, Database, Cloud, Wrench,
  type LucideIcon,
} from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServiceItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  featuresEn: string;
  featuresBn: string;
}

interface ServicesData {
  services: ServiceItem[];
  locale: 'en' | 'bn';
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
};

export async function Services({ data }: { data: ServicesData }) {
  const tServices = await getTranslations('Services');

  if (data.services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="border-y border-border bg-muted/20 py-16 sm:py-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {tServices('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">{tServices('title')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.services.map((service) => (
            <ServiceCard key={service.id} service={service} locale={data.locale} featuresLabel={tServices('features')} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({
  service,
  locale,
  featuresLabel,
}: {
  service: ServiceItem;
  locale: 'en' | 'bn';
  featuresLabel: string;
}) {
  const title = locale === 'bn' ? service.titleBn : service.titleEn;
  const description = locale === 'bn' ? service.descriptionBn : service.descriptionEn;
  const featuresRaw = locale === 'bn' ? service.featuresBn : service.featuresEn;
  const features = featuresRaw.split('\n').map((f) => f.trim()).filter(Boolean);

  const Icon = ICON_MAP[service.icon] ?? Code2;

  return (
    <Card className="group relative overflow-hidden border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
      <CardContent className="space-y-4 p-6">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-glow transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {features.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {featuresLabel}
            </p>
            <ul className="space-y-1">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
