import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Digital Menu App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your restaurant with QR code menus. Easy to manage, beautiful to display.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Restaurant Admin Login
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600">Add, edit, and organize your menu items with our simple admin panel.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">QR Code Access</h3>
            <p className="text-gray-600">Customers scan a QR code to instantly view your digital menu.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Changes to your menu appear instantly - no reprinting needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
