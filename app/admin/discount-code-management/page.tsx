"use client"
import { useState, useEffect } from 'react';
import Layout from '../../../components/AdminLayout';


type DiscountCode = {
  _id: string;
  code: string;
  discount: number;
  validUntil: string;
};

export default function DiscountCodeManagement() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/discount-codes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCodes(data);
        } else {
          throw new Error('Failed to fetch discount codes');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Discount Codes</h2>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Create New
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {codes.map((code) => (
                <tr key={code._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{code.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{code.discount}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(code.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}