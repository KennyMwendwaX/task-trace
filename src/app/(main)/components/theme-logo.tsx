"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeLogo({ width = 30, height = 30, alt = "Logo" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} />;
  }

  const logoSrc =
    resolvedTheme === "dark" ? "/logo-light.svg" : "/logo-dark.svg";

  const styling = `rounded-md ${
    resolvedTheme === "dark" ? "bg-white" : "bg-black"
  }`;
  return (
    <Image
      className={styling}
      src={logoSrc}
      width={width}
      height={height}
      alt={alt}
    />
  );
}
