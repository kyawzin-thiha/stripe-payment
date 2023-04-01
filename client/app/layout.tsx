import "./globals.scss";

export const metadata = {
  title: 'Stripe Payment Testing',
  description: 'This is testing website for stripe payment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
