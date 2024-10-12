"use client";
// import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
// import { SafeUser } from "@/types";
import React from "react";

// interface NavbarProps {
//   currentUser: SafeUser | null;
// }

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-3 px-4 bg-white shadow-md h-16 fixed top-0 left-0 right-0">
      <Link href={"/"} className="text-xl font-bold">
        DotQuizz
      </Link>

      <Button type="submit" onClick={() => {}}>
        Sign Out
      </Button>

      <Button onClick={() => {}}>Sign In</Button>
    </nav>
  );
};

export default Navbar;
