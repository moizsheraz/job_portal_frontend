"use client";

import { useState, useEffect } from "react";
import Layout from "../../../components/AdminLayout";
import { Trash, X } from "lucide-react";

type Advertisement = {
  _id: string;
  image: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdvertisementManagement() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adToDelete, setAdToDelete] = useState<Advertisement | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-all-adverts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAds(data);
      } else {
        throw new Error("Failed to fetch advertisements");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCreateAd = async () => {
    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/create-advert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageBase64: base64String,
            }),
          }
        );

        if (response.ok) {
          setSuccess("Advertisement created successfully");
          fetchAds();
          setImageFile(null);
          // Clear file input
          const fileInput = document.getElementById("adImage") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
          setTimeout(() => setSuccess(""), 3000);
        } else {
          throw new Error("Failed to create advertisement");
        }
      };
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (ad: Advertisement) => {
    setAdToDelete(ad);
    setShowDeleteModal(true);
  };

  const handleDeleteAd = async () => {
    if (!adToDelete) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/delete-advert/${adToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Advertisement deleted successfully");
        fetchAds();
        setShowDeleteModal(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Failed to delete advertisement");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && ads.length === 0) {
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
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
            <p>{error}</p>
            <button
              className="text-red-700"
              onClick={() => setError("")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex justify-between items-center">
            <p>{success}</p>
            <button
              className="text-green-700"
              onClick={() => setSuccess("")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg text-yellow-700 font-medium">Advertisements</h3>
            <div className="flex items-center space-x-4">
              <input
                id="adImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="adImage"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 cursor-pointer text-sm"
              >
                Select Image
              </label>
              <button
                onClick={handleCreateAd}
                disabled={loading || !imageFile}
                className={`px-4 py-2 text-sm text-white rounded ${
                  loading || !imageFile
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Uploading..." : "Upload Ad"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${ad.image}`}
                        alt="Ad"
                        className="h-16 w-auto rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ad.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteClick(ad)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Delete Ad"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {ads.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No advertisements found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-red-600">Delete Advertisement</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Are you sure you want to delete this advertisement?</p>
              <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAd}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}