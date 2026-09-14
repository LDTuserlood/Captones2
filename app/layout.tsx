import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'FallGuard — Theo dõi & cảnh báo té ngã',
  description: 'Bản demo đồ án: phát hiện té ngã, quản lý sự kiện và quy trình xác nhận của caregiver.',
  icons: { icon: '/favicon.svg' }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
