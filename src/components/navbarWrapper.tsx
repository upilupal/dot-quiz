"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";


const disableNavbar = ["/login", "/register"];

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  if (disableNavbar.includes(pathname)) {
    return null;
  }
  
  return <Navbar />;
}
