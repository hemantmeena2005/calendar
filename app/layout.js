import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { EventsProvider } from "./context/EventsContext"; // Import the EventsProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Calendar App",
  description: "Add your daily events here ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Navigation />
        <EventsProvider> {/* Wrap children with EventsProvider */}
          {children}
        </EventsProvider>
      </body>
    </html>
  );
}
