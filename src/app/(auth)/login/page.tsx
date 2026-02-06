// app/(auth)/login/page.tsx
// Login Page

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Login Admin
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Halaman login akan segera tersedia
        </p>
        <div className="text-center">
          <a href="/" className="text-purple-600 hover:text-purple-800">
            ← Kembali ke beranda
          </a>
        </div>
      </div>
    </div>
  );
}
