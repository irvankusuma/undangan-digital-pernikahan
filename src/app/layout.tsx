// app/layout.tsx
// Root Layout - Required by Next.js

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wedding Invitation System',
  description: 'Create beautiful digital wedding invitations',
  keywords: ['wedding', 'invitation', 'digital invitation', 'undangan pernikahan'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
