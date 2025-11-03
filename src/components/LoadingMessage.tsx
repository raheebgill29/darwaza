"use client";

import React from "react";

type LoadingMessageProps = {
  message?: string;
  className?: string;
};

export default function LoadingMessage({ message = "Loading...", className = "" }: LoadingMessageProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
      <p className="mt-4 text-accent/80">{message}</p>
    </div>
  );
}

