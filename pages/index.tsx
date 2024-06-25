import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Overview() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);
}
