import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function LocaleLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="flex min-h-[88vh] items-center justify-center px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-6 text-center">
          <Skeleton className="mx-auto h-7 w-48 rounded-full" />
          <Skeleton className="mx-auto h-16 w-3/4" />
          <Skeleton className="mx-auto h-8 w-1/2" />
          <Skeleton className="mx-auto h-20 w-full max-w-2xl" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-40 rounded-md" />
            <Skeleton className="h-12 w-40 rounded-md" />
            <Skeleton className="h-12 w-40 rounded-md" />
          </div>
        </div>
      </section>

      {/* About skeleton */}
      <Container className="py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="mx-auto h-8 w-32" />
          <div className="flex flex-col items-center gap-6 text-center">
            <Skeleton className="h-36 w-36 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full max-w-2xl" />
          </div>
        </div>
      </Container>

      {/* Skills skeleton */}
      <Container className="py-16">
        <div className="space-y-6">
          <Skeleton className="mx-auto h-8 w-48" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
