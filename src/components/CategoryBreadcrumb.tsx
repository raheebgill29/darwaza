"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type CategoryBreadcrumbProps = {
  categoryName: string;
};

export default function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-accent/70 hover:text-accent">
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-accent/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </li>
        <li>
          <span className="font-medium text-accent">{categoryName}</span>
        </li>
      </ol>
    </motion.nav>
  );
}