import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
