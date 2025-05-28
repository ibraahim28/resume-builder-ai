import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import PremiumModal from "@/components/premium/PremiumModal";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="flex-grow">
        {children}
        <PremiumModal />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
