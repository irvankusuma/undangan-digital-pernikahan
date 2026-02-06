// components/invitation-view/GiftSection.tsx
'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: string;
  bankName?: string | null;
  accountName: string;
  accountNumber: string;
  ewalletType?: string | null;
  qrCodeImage?: string | null;
}

interface GiftSectionProps {
  paymentMethods: PaymentMethod[];
}

export default function GiftSection({ paymentMethods }: GiftSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (paymentMethods.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Amplop Digital
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan hadiah,
          kami menyediakan amplop digital berikut:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all duration-300"
          >
            {/* Type Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {method.type === 'BANK_TRANSFER' ? method.bankName : method.ewalletType}
              </span>
            </div>

            {/* Account Details */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">Nama Penerima</label>
                <p className="text-gray-900 font-semibold">{method.accountName}</p>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Nomor Rekening</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-mono font-semibold flex-1">
                    {method.accountNumber}
                  </p>
                  <button
                    onClick={() => copyToClipboard(method.accountNumber, method.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Salin nomor"
                  >
                    {copiedId === method.id ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {method.qrCodeImage && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={method.qrCodeImage}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Scan QR Code untuk transfer
                </p>
              </div>
            )}

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(method.accountNumber, method.id)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {copiedId === method.id ? (
                <>
                  <Check className="w-5 h-5" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Salin Nomor Rekening
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
