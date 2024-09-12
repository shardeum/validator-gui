import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { authService, checkServerAuth } from "../services/auth.service";

export default function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    const isServerAuth = await checkServerAuth();
    if ((!authService.isLogged || !isServerAuth) && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <div>
      {authorized && children}
      {!authorized && <></>}
    </div>
  );
}
