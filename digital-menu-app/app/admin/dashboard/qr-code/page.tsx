'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [restaurantSlug, setRestaurantSlug] = useState('');
  const [networkIp, setNetworkIp] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchRestaurantData();
    // Extract network IP from window.location if available
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      setNetworkIp(hostname);
    }
  }, []);

  const fetchRestaurantData = async () => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (!restaurantId) return;

    const { data, error } = await supabase
      .from('restaurants')
      .select('slug')
      .eq('id', restaurantId)
      .single();

    if (!error && data) {
      setRestaurantSlug(data.slug);
      const url = `${window.location.origin}/menu/${data.slug}`;
      setMenuUrl(url);

      // Use custom URL if set, otherwise use default
      const savedCustomUrl = localStorage.getItem('customMenuUrl');
      if (savedCustomUrl) {
        setCustomUrl(savedCustomUrl);
        generateQRCode(`${savedCustomUrl}/menu/${data.slug}`);
      } else {
        generateQRCode(url);
      }
    }
  };

  const generateQRCode = async (url: string) => {
    if (canvasRef.current) {
      try {
        await QRCode.toCanvas(canvasRef.current, url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        const dataUrl = canvasRef.current.toDataURL();
        setQrCodeUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `${restaurantSlug}-menu-qr-code.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const copyMenuUrl = () => {
    const urlToCopy = customUrl ? `${customUrl}/menu/${restaurantSlug}` : menuUrl;
    navigator.clipboard.writeText(urlToCopy);
    alert('Menu URL copied to clipboard!');
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setCustomUrl(newUrl);
  };

  const handleRegenerateQR = () => {
    if (customUrl) {
      localStorage.setItem('customMenuUrl', customUrl);
      generateQRCode(`${customUrl}/menu/${restaurantSlug}`);
    } else {
      localStorage.removeItem('customMenuUrl');
      generateQRCode(menuUrl);
    }
  };

  const useNetworkIp = () => {
    const port = window.location.port || '3000';
    const networkUrl = `http://192.168.8.101:${port}`;
    setCustomUrl(networkUrl);
    localStorage.setItem('customMenuUrl', networkUrl);
    generateQRCode(`${networkUrl}/menu/${restaurantSlug}`);
  };

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Menu QR Code</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">QR Code</h3>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <canvas ref={canvasRef} />
            </div>
            <button
              onClick={downloadQRCode}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Download QR Code
            </button>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Customers scan this QR code to view your menu
            </p>
          </div>
        </div>

        {/* Menu URL */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Menu URL</h3>
          <div className="space-y-4">
            {/* Network IP Helper */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">📱 Testing on Phone?</h4>
              <p className="text-sm text-yellow-800 mb-3">
                The QR code currently points to localhost, which won't work on your phone.
                Click below to use your network IP instead:
              </p>
              <button
                onClick={useNetworkIp}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm"
              >
                Use Network IP (http://192.168.8.101)
              </button>
            </div>

            {/* Custom URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom URL (for production deployment):
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={handleCustomUrlChange}
                  placeholder="https://yourdomain.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleRegenerateQR}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Regenerate QR Code
                </button>
              </div>
            </div>

            {/* Current Menu URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current menu URL:
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={customUrl ? `${customUrl}/menu/${restaurantSlug}` : menuUrl}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                />
                <button
                  onClick={copyMenuUrl}
                  className="bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">How to use:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Download the QR code using the button above</li>
                <li>Print the QR code and place it on your restaurant tables</li>
                <li>Customers can scan it with their phone camera</li>
                <li>They&apos;ll instantly see your digital menu</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Tips:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Print the QR code in high quality for easy scanning</li>
                <li>Place QR codes on table tents or menus</li>
                <li>Make sure the QR code is clearly visible</li>
                <li>Test the QR code with your phone before printing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
