import { Toaster } from 'react-hot-toast';
import localFont from "next/font/local";
import NavBar from './components/NavBar';
import Providers from './providers';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Combat Gains",
  description: "Track your martial arts and strength training progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NavBar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
