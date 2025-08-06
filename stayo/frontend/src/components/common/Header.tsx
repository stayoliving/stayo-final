import React from "react";
import "./Styles.css";
import Navbar from "./Navbar";

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "9096420463", path: "/about", type: "mobNo" },
    { name: "WhatsApp", path: "/", type: "whatsapp", phone: "9096420463" },
    { name: "Pay Rent/Deposit", path: "/pay" },
    { name: "About Us", path: "/about" },
  ];
  return (
    <div className="header">
      <Navbar navItems={navItems} onOpenSidebar={onOpenSidebar} />
    </div>
  );
}
