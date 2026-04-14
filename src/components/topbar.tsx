import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { getAuthUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";
import { House, VenetianMask } from "lucide-react";

export async function Topbar() {
  const authUser = await getAuthUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <VenetianMask/>
          </Link>
          <div className="flex gap-2 items-center">
            {authUser && (
              <Button variant="outline" size="icon-sm" asChild>
                <Link href="/dashboard"><House/></Link>
              </Button>
            )}
            <ModeToggle />
            {authUser ? (
              <LogoutButton />
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
