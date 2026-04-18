import { useState } from "react";
import axios from "axios";

function ImageUpload({ ticketId, refresh }) {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0) {
      return;
    }

    const uploads = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);

      return axios.post(
        `http://localhost:8080/api/tickets/${ticketId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true
        }
      );
    });

    await Promise.all(uploads);

    setFiles([]);
    refresh();
  };

  return (
    <div>
      <h4>Upload Images</h4>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUpload;