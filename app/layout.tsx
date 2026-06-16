import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"]
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Shrasti Enterprises - Premium Packaging Solutions',
  description: 'Industrial grade manufacturer of BOPP tapes, stretch films, and custom poly liners based in SIDCUL Haridwar.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`scroll-smooth bg-[#02050e] ${playfair.variable} ${dmSans.variable} ${geistMono.variable}`}
    >
      <body className="text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-300">
        {children}
        <Analytics />
      </body>
    </html>
  )
}