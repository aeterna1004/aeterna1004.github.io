import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PARTNER_1_NAME, PARTNER_2_NAME } from '@/lib/constants'
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
  title: `${PARTNER_1_NAME} & ${PARTNER_2_NAME} - Our Love Story`,
  description: 'Mỗi giây phút bên nhau đều là kỉ niệm đáng trân trọng',
  icons: {
    icon: '/heart-icon.svg',
    apple: '/heart-icon.svg',
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
      <body
        className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
