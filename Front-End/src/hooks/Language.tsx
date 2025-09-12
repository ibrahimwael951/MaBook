import { useMemo } from "react";

export function useDetectLanguage(text: string) {
  return useMemo(() => {
    if (!text) return "other";
    const arabic = /[\u0600-\u06FF]/;
    if (arabic.test(text)) return "ar";
    return "en";
  }, [text]);
}
