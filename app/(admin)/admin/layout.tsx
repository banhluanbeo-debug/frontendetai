"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";

const menuItems = [
  { id: "dashboard", name: "Dashboard", path: "/admin" },
  { id: "orders", name: "Đơn hàng", path: "/admin/orders" },
  { id: "users", name: "Khách hàng", path: "/admin/users" },
  { id: "movies", name: "Quản lý Phim", path: "/admin/movies" },
  { id: "rooms", name: "Quản lý Phòng", path: "/admin/rooms" },
  { id: "foods", name: "Đồ ăn / Thức uống", path: "/admin/foods" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  // Trang login không cần sidebar và không cần ProtectedRoute
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // Chỉ xóa session admin, không đụng tới 'user' của người dùng thường
    localStorage.removeItem("adminUser");
    // Xóa cookie admin
    document.cookie = "adminLoggedIn=; path=/; max-age=0";
    // Về trang login admin
    router.replace("/admin/login");
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
          {/* Logo */}
          <div className="mb-8 px-2">
            <h2 className="text-xl font-bold text-white">⚙️ Admin Panel</h2>
          </div>

          {/* Menu */}
          <ul className="space-y-1 flex-1">
            {menuItems.map((m) => (
              <li key={m.id}>
                <Link
                  href={m.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition font-medium text-sm ${
                    pathname === m.path
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 mt-4 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

