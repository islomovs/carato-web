import { Suspense } from "react";
import AuthMobileScreen from "@/components/shared/auth-modal/AuthMobileScreen";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthMobileScreen />
    </Suspense>
  );
}
