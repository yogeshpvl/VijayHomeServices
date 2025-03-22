import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { config } from "../../services/config";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

function QFooterImg() {
  const [image, setImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const selectedCategory = localStorage.getItem("selectedCategory");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/quotation-header-footer/category?type=footer&category=${selectedCategory}`
      );
      const data = await response.json();
      setExistingImages(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return toast.error("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", "footer");
    formData.append("category", selectedCategory);

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/quotation-header-footer/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("✅ Header image uploaded!");
        setImage(null);
        fetchImages();
      } else {
        toast.error("❌ Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    await fetch(`${config.API_BASE_URL}/quotation-header-footer/${id}`, {
      method: "DELETE",
    });
    fetchImages();
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-semibold mb-4">Upload Quote Header Image</h2>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded-md"
        />
        <Button onClick={handleImageUpload}>Upload</Button>
      </div>

      <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Preview</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {existingImages.length > 0 ? (
              existingImages.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2 break-all">{item.image_url}</td>
                  <td className="px-4 py-2">
                    <img
                      src={item.image_url}
                      alt="Header"
                      className="w-24 h-auto rounded shadow"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <FaTrash
                      className="cursor-pointer hover:text-red-600"
                      size={16}
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No header images uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QFooterImg;
