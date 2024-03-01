import React, { useEffect, useState } from "react";
import axios from "axios";
import PreviewFile from "../PreviewFile/PreviewFile";
import { ENDPOINT_API } from "../../contants";

function Download({ token }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `${ENDPOINT_API}/api/v1/files/get-files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFiles(response.data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [files]);

  const downloadFile = async (uniqueName, originalName) => {
    try {
      const response = await axios.get(
        `${ENDPOINT_API}/api/v1/files/download/${uniqueName}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Files:</h1>
      <ul className="list-group">
        {files.map((file) => (
          <li
            key={file.uniqueName}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <span>{file.originalName}</span>
              <button
                className="btn btn-primary btn-sm ms-3"
                onClick={() => downloadFile(file.uniqueName, file.originalName)}
              >
                Download
              </button>
            </div>
            <PreviewFile
              filename={file.uniqueName}
              extention={file.extention}
              token={token}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Download;
