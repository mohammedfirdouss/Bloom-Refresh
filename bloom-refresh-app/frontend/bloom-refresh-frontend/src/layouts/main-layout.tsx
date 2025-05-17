import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer"; 

export function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
