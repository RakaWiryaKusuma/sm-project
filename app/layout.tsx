// app/layout.tsx - FIXED
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { ArticleProvider } from './contexts/ArticleContext';

export const metadata: Metadata = {
  title: {
    default: 'SEIJA Magazine - Student Creative Platform',
    template: '%s | SEIJA Magazine'
  },
  description: 'Platform kreatif untuk siswa SIJA menampilkan karya tulis, desain, puisi, dan project coding',
  keywords: ['magazine', 'student', 'creative', 'writing', 'design', 'coding'],
  authors: [{ name: 'SIJA Students' }],
  // HAPUS viewport dari sini
  robots: 'index, follow',
  openGraph: {
    title: 'SEIJA Magazine',
    description: 'Platform kreatif untuk siswa SIJA',
    type: 'website',
    locale: 'id_ID',
  },
};

// TAMBAHKAN viewport export terpisah
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ArticleProvider>
            {children}
          </ArticleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}