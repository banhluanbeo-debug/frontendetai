"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { id: "dashboard", name: "Dashboard", path: "/admin" },
  { id: "orders", name: "Đơn hàng", path: "/admin/orders" },
  { id: "products", name: "Sản phẩm", path: "/admin/products" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <ul className="space-y-2">
          {menuItems.map((m) => (
            <li key={m.id}>
              <Link href={m.path}>{m.name}</Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
