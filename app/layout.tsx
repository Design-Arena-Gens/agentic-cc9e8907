import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Агент поиска мастеров маникюра/педикюра',
  description: 'Автоматизированный поиск и отправка сообщений мастерам',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
