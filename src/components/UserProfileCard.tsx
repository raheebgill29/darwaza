"use client";

import Image from "next/image";

type Props = {
  name: string | null;
  email: string | null;
  onLogout: () => Promise<void> | void;
};

export default function UserProfileCard({ name, email, onLogout }: Props) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-brand-200 bg-brand-base p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-accent/10">
          <Image src="/vercel.svg" alt="Profile" fill className="object-contain p-3" />
        </div>
        <div>
          <p className="text-lg font-semibold text-accent">{name ?? "User"}</p>
          <p className="text-accent/80">{email ?? "No email"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="text-accent font-semibold">Orders</h3>
          <p className="mt-2 text-sm text-accent/70">Orders placed (coming soon)</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="text-accent font-semibold">Account</h3>
          <p className="mt-2 text-sm text-accent/70">Manage addresses and preferences (coming soon)</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-accent px-5 py-2 text-accent transition-colors hover:bg-accent hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}