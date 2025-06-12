import React from "react";
import Footer from "./_components/Footer";
import BasicNavbar from "./_components/BasicNavbar";

import PremiumModal from "@/components/premium/PremiumModal";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <BasicNavbar />
      <main className="flex-grow">
        {children}
        <PremiumModal />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
