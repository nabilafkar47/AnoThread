import Link from "next/link";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex flex-col gap-4 sm:gap-6 text-center items-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Ask me anything, <br />
          anonymously 🤫
        </h1>
        <p className="text-muted-foreground">
          Create a public thread. Share the link. <br /> Let anyone ask you
          questions completely anonymously.
        </p>
        <Button className="w-fit" asChild>
          <Link href="/dashboard">Create thread</Link>
        </Button>
      </div>
    </section>
  );
}
