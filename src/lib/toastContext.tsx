"use client";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastType = "info" | "success" | "error";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number; // ms
};

type ToastContextType = {
  addToast: (message: string, options?: { type?: ToastType; duration?: number }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, options?: { type?: ToastType; duration?: number }) => {
      const id = ++counter.current;
      const toast: Toast = {
        id,
        message,
        type: options?.type ?? "info",
        duration: options?.duration ?? 3000,
      };
      setToasts((prev) => [...prev, toast]);
      // Auto-remove
      window.setTimeout(() => removeToast(id), toast.duration);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              `pointer-events-auto rounded-lg border px-4 py-3 shadow-sm transition-opacity ` +
              (t.type === "error"
                ? "border-red-300 bg-red-50 text-red-800"
                : t.type === "success"
                ? "border-green-300 bg-green-50 text-green-800"
                : "border-brand-200 bg-brand-base text-accent")
            }
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="rounded-md border border-brand-200 bg-white px-2 py-1 text-xs text-accent hover:bg-white/70"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}