
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";
import { useSession } from "next-auth/react";
import { handleSignOut } from "@/app/actions/authActions";
import { auth } from "../../auth";

const Navbar = async () => {
  const session = await auth();
  console.log({ session });
  return (
    <nav className="flex justify-between items-center py-3 px-4 h-16 fixed top-0 left-0 right-0">
      <Link href={"/"} className="text-xl font-bold">
        DotQuizz
      </Link>

      {!session ? (
        <Link href="/login">
          <Button variant="default">Sign In</Button>
        </Link>
      ) : (
        <div className="flex items-center gap-8">
        <p className="font-bold">Hi, {session?.user?.name}!</p>
        <form action={handleSignOut}>
          <Button variant="default" type="submit">
            Sign Out
          </Button>
        </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
