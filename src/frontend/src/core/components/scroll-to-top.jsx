import { useEffect } from "react";
import { useParams } from "react-router";

export default function ScrollToTop() {
  const { pathname } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
