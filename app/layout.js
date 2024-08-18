import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { EventsProvider } from "./context/EventsContext"; // Import the EventsProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Calendar App",
  description: "Add your daily events here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" fixed w-full top-0 left-0 z-10">
          <Navigation />
        </div>
        <EventsProvider>
          <main className="pt-20"> {/* Adjust padding to ensure content isn't hidden behind the fixed navigation */}
            {children}
          </main>
        </EventsProvider>
      </body>
    </html>
  );
}
