import { useCallback, useState } from "react";

export type SubscribeStatus = "idle" | "loading" | "success" | "info" | "error";

// Inline newsletter subscribe: posts to the same-origin /api/subscribe proxy
// and exposes a friendly status + message for the form to render.
export function useMailchimpSubscribe() {
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [message, setMessage] = useState("");

  const subscribe = useCallback(async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json()) as { result?: string; msg?: string };
      const msg = data.msg ?? "";
      if (/already subscribed/i.test(msg)) {
        // post-json reports an existing contact as result:"success", so this
        // check must come before the success branch.
        setStatus("info");
        setMessage("You're already on the list. See you at the next game!");
      } else if (data.result === "success") {
        setStatus("success");
        setMessage("You're in! Check your inbox to confirm your subscription.");
      } else {
        setStatus("error");
        setMessage(msg.replace(/<[^>]*>/g, "").trim() || "That didn't go through. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network hiccup. Please try again in a moment.");
    }
  }, []);

  return { status, message, subscribe };
}
