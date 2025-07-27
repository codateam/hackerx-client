import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import ReduxProvider from "@/store/redux-provider";
import { ReduxPersistGate } from "@/store/persist-gate";
import { ReactQueryProvider } from "@/lib/react-query";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "QuizMaster | Home",
  description: "An online quiz platform for students and teachers",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#f3f3fb] text-black lg:min-h-screen antialiased`}
        suppressHydrationWarning={true}
      >
        <ReduxProvider>
          <ReduxPersistGate>
            <ReactQueryProvider>
              <div>{children}</div>
              <ToastContainer />
            </ReactQueryProvider>
          </ReduxPersistGate>
        </ReduxProvider>
      </body>
    </html>
  );
}
