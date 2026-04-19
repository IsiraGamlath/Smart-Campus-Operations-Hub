import { useState } from "react";
import axios from "axios";

function ImageUpload({ ticketId, refresh }) {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();

    files.forEach(file => {
      formData.append("files", file);
    });

    await axios.post(
      `http://localhost:8080/api/tickets/${ticketId}/upload`,
      formData
    );

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