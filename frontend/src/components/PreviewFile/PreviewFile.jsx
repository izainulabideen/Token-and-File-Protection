import React, { useState } from "react";
import axios from "axios";
import { ENDPOINT_API } from "../../contants";

function PreviewFile({ filename, extention, token }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const fetchFilePreview = () => {
    axios
      .get(`${ENDPOINT_API}/api/v1/files/preview/${filename}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const contentType = response.headers["content-type"];
        setFileType(contentType.split("/")[0]);
        const url = URL.createObjectURL(response.data);
        setFileUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching file preview:", error);
      });
  };

  const cancelPreview = () => {
    setFileUrl(null);
  };

  const renderPreview = () => {
    if (extention === "png" || extention === "jpeg" || extention === "jpg") {
      return <img src={fileUrl} className="img-fluid" alt="File Preview" />;
    } else if (extention === "pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-100 h-100 border-0"
          title="PDF Preview"
        />
      );
    } else {
      return (
        <div>
          <p>Preview not available for this file type.</p>
          <a href={fileUrl} download={filename} className="btn btn-primary">
            Download
          </a>
        </div>
      );
    }
  };

  return (
    <>
      {fileUrl ? (
        <div className="mt-3">
          <button onClick={cancelPreview} className="btn btn-danger me-2">
            Cancel Preview
          </button>
          {renderPreview()}
        </div>
      ) : (
        <button onClick={fetchFilePreview} className="btn btn-primary">
          Preview
        </button>
      )}
    </>
  );
}

export default PreviewFile;
