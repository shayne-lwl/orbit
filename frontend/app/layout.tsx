import "./global.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { AuthenticationProvider } from "./hooks/AuthenticationProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthenticationProvider>
          <NavigationBar />
          {children}
        </AuthenticationProvider>
      </body>
    </html>
  );
}
