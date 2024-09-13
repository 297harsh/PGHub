import React, { useState , useEffect } from 'react';
import axios from 'axios';
const serverapiUrl = import.meta.env.VITE_API_URL;

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append('images', image);
    });
    console.log("formData ,",formData)

    try {
      const response = await axios.post(
        `${serverapiUrl}/pgDetails/upload-images`, // your backend API URL
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success) {
        setUploadedImageUrls(response.data.urls); // Cloudinary image URLs
        alert('Images uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Image upload failed!');
    }
  };

  useEffect(()=>{
    console.log(selectedImages);
  },[selectedImages])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Upload Images to Cloudinary</h2>
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        style={{ marginBottom: '20px' }}
      />
      <button onClick={handleUpload} style={{ padding: '10px 20px' }}>
        Upload
      </button>

      {/* Display uploaded images */}
      {uploadedImageUrls.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Uploaded Images:</h3>
          {uploadedImageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`uploaded-${index}`}
              style={{ width: '200px', margin: '10px' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
