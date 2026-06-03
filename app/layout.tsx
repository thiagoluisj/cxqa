import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CXQA — UX Quality Assurance',
  description: 'Sistema de gestão de ocorrências UX/QA para designers de produto',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
