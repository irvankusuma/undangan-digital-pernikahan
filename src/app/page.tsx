// app/page.tsx
// Landing Page

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Wedding Invitation
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              System
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Buat undangan digital pernikahan yang indah dan modern. 
            Bagikan dengan mudah melalui link unik.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Login Admin
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-300 hover:border-purple-600 transition-all duration-300 hover:scale-105"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon="🎵"
              title="Musik Otomatis"
              description="Tambahkan musik dari YouTube yang autoplay saat undangan dibuka"
            />
            <FeatureCard
              icon="📊"
              title="Tracking Pengunjung"
              description="Lihat statistik pengunjung undangan Anda secara real-time"
            />
            <FeatureCard
              icon="💰"
              title="Amplop Digital"
              description="Terima hadiah melalui transfer bank atau e-wallet"
            />
            <FeatureCard
              icon="📱"
              title="Responsive Design"
              description="Tampil sempurna di semua perangkat, HP hingga desktop"
            />
            <FeatureCard
              icon="📍"
              title="Google Maps"
              description="Integrasi Google Maps untuk petunjuk lokasi acara"
            />
            <FeatureCard
              icon="✉️"
              title="Caption Generator"
              description="Generate caption undangan untuk WhatsApp, Instagram, SMS"
            />
          </div>

          {/* Footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>© 2024 Wedding Invitation System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
