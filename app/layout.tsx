import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
})

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Nhật Trường & Cẩm Thuý - Our Love Story',
  description: 'Mỗi giây phút bên nhau đều là kỉ niệm đáng trân trọng',
  icons: {
    icon: '/icon_fixed.png?v=1',
    apple: '/apple-icon.png?v=1',
  },
}

export const viewport: Viewport = {
  themeColor: '#fdf2f4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
