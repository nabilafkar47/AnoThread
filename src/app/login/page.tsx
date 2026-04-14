import { GalleryVerticalEnd, VenetianMask } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <VenetianMask className="size-5" />
          AnoThread
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
