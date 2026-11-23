import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A Little Surprise Awaits You ❤️',
  description: 'A special birthday journey created just for you with love.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1b0307',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden">
      <body className="h-full w-full overflow-hidden bg-burgundy-velvet text-cream-50 antialiased select-none">
        {children}
      </body>
    </html>
  );
}
