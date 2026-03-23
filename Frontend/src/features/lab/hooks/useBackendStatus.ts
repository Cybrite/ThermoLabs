import { useEffect, useState } from "react";
import { API_BASE_URL, BACKEND_POLL_INTERVAL_MS } from "../constants";
import type { BackendStatus } from "../types";

export const useBackendStatus = () => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [backendMessage, setBackendMessage] = useState("Waiting for status");

  useEffect(() => {
    const controller = new AbortController();

    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as { message?: string };
        setBackendStatus("online");
        setBackendMessage(payload.message ?? "Backend reachable");
      } catch {
        setBackendStatus("offline");
        setBackendMessage("Cannot reach backend server at port 5000");
      }
    };

    checkBackend();
    const poll = window.setInterval(checkBackend, BACKEND_POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(poll);
    };
  }, []);

  return {
    backendStatus,
    backendMessage,
  };
};
