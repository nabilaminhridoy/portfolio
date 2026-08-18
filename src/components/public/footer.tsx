import { getTranslations } from 'next-intl/server';

/**
 * Footer — extremely clean and minimal.
 * Contains ONLY the dynamic copyright line.
 *
 * Social media belongs ONLY in the Contact section (Get in Touch → Follow me).
 * No brand name, no description, no Quick Links, no Resources, no Connect,
 * no "Built with..." text.
 */
export async function Footer() {
  const tFooter = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary py-6">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-secondary-foreground/70">
          {tFooter('rights', { year })}
        </p>
      </div>
    </footer>
  );
}
