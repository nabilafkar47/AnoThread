import { VenetianMask } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 py-8">
      <p className="text-sm tracking-tight text-muted-foreground">
        &copy; {new Date().getFullYear()} AnoThread
      </p>
    </footer>
  );
}
