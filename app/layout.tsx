import './globals.css';

export const metadata = {
  title: 'Undangan Digital',
  description: 'Undangan digital pernikahan'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}