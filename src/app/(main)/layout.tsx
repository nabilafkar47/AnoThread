import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
