"use client";

export default function DashboardPage() {
  return (
    <div className="p-6" title="Dashboard">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Người dùng</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
