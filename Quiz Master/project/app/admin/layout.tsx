import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - QuizMaster Pro',
  description: 'Secure administrative panel for QuizMaster Pro quiz application',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}