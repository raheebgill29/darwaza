"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  active?: "products" | "category" | "orders" | null;
  onSelect?: (key: string) => void;
};

export default function AdminSidebar({ active, onSelect }: Props) {
  const pathname = usePathname();

  const topLinks = useMemo(
    () => [
      { key: "dashboard", label: "Dashboard", href: "/admin-dashboard" },
      { key: "orders", label: "Orders", href: "/admin-dashboard/orders" },
    ],
    []
  );

  const groups = useMemo(
    () => [
      {
        key: "products",
        label: "Products",
        children: [
          { key: "view-products", label: "View Products", href: "/admin-dashboard/view-products" },
          { key: "add-product", label: "Add Product", href: "/admin-dashboard/add-product" },
        ],
      },
      {
        key: "categories",
        label: "Categories",
        children: [
          { key: "view-categories", label: "View Categories", href: "/admin-dashboard/view-categories" },
          { key: "add-category", label: "Add Category", href: "/admin-dashboard/add-category" },
        ],
      },
    ],
    []
  );

  const isHrefActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const [open, setOpen] = useState<Record<string, boolean>>({ products: false, categories: false });

  useEffect(() => {
    // Auto-expand groups if current route matches any child
    const nextOpen: Record<string, boolean> = { products: false, categories: false };
    for (const g of groups) {
      nextOpen[g.key] = g.children.some((c) => isHrefActive(c.href));
    }
    setOpen((prev) => ({ ...prev, ...nextOpen }));
  }, [pathname, groups]);

  const toggleGroup = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const itemClasses = (activeItem: boolean) =>
    "block rounded-md px-3 py-2 text-sm " +
    (activeItem ? "bg-brand-base text-accent font-medium" : "text-accent hover:bg-brand-50");

  return (
    <aside
      className="w-64 self-stretch border-r border-brand-200 bg-brand-base/40 px-3 py-4"
      aria-label="Admin sidebar navigation"
    >
      <nav className="flex h-full flex-col items-stretch">
        <div className="mb-2 px-2">
          <h2 className="text-sm font-semibold text-accent">Admin Navigation</h2>
        </div>

        <ul className="space-y-1">
          {topLinks.slice(0, 1).map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => onSelect?.(item.key)}
                aria-current={isHrefActive(item.href) ? "page" : undefined}
                className={itemClasses(isHrefActive(item.href))}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-2 space-y-2">
          {groups.map((group) => {
            const isExpanded = !!open[group.key];
            const controlsId = `group-${group.key}-list`;
            return (
              <div key={group.key} className="rounded-md">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={controlsId}
                  onClick={() => toggleGroup(group.key)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-accent hover:bg-brand-50"
                >
                  <span className="font-medium">{group.label}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={"h-4 w-4 transition-transform " + (isExpanded ? "rotate-90" : "rotate-0")}
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isExpanded && (
                  <ul id={controlsId} className="mt-1 space-y-1 pl-3">
                    {group.children.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={child.href}
                          onClick={() => onSelect?.(child.key)}
                          aria-current={isHrefActive(child.href) ? "page" : undefined}
                          className={itemClasses(isHrefActive(child.href))}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <ul className="mt-4 space-y-1">
          {topLinks.slice(1).map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => onSelect?.(item.key)}
                aria-current={isHrefActive(item.href) ? "page" : undefined}
                className={itemClasses(isHrefActive(item.href))}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex-1" />
      </nav>
    </aside>
  );
}