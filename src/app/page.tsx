import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-950">
    <Card className='w-[500px] h-[350px] flex justify-center items-center'>
      <Link href={"/quiz"}>
        <Button>
          Start quiz
        </Button>
      </Link>
    </Card>
  </div>
  );
}
