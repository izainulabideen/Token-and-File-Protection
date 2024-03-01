import axios from "axios";
import React, { useRef } from "react";
import { ENDPOINT_API } from "../../contants";

function Upload({ token }) {
  const fileInputRef = useRef(null);

  const uploadFile = async () => {
    const selectedFile = fileInputRef.current.files[0];
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("fileToUpload", selectedFile);

    try {
      const response = await axios.post(
        `${ENDPOINT_API}/api/v1/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("File uploaded successfully:", response.data);

      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Upload File</h2>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          name="fileToUpload"
          ref={fileInputRef}
        />
      </div>
      <button className="btn btn-primary" onClick={uploadFile}>
        Upload
      </button>
    </div>
  );
}

export default Upload;
