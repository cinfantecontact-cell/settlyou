"use client";

import { useEffect } from "react";

export default function PwaRedirect() {
  useEffect(() => {
    try {
      if (
        window.matchMedia("(display-mode: standalone)").matches &&
        window.location.pathname === "/"
      ) {
        const url = localStorage.getItem("settlyou_upload_url");
        if (url && url.startsWith("/upload/")) window.location.replace(url);
      }
    } catch (e) {}
  }, []);
  return null;
}
