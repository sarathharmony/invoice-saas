export const metadata = { title: 'invoice-saas' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#0b0b11',
          color: '#eaeaf0',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
