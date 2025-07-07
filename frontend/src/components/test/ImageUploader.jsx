import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const [imageGcs, setImageGcs] = useState(null);
    const [imageUrlGcs, setImageUrlGcs] = useState("");

    const handleChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleGcsChange = (e) => {
        setImageGcs(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await axios.post("http://localhost:8222/api/v1/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setImageUrl(response.data); // URL to access image
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const handleGcsUpload = async () => {
        const formData = new FormData();
        formData.append("file", imageGcs);

        try {
            const response = await axios.post("http://localhost:8222/api/v1/gcs/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setImageUrlGcs(response.data); // URL to access image
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    return <>
        <div>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>

            {imageUrl && (
                <div>
                    <p>Uploaded Image:</p>
                    <img src={imageUrl} alt="Uploaded" style={{ width: 200 }} />
                </div>
            )}
        </div>

        <div>
            <input type="file" onChange={handleGcsChange} />
            <button onClick={handleGcsUpload}>Upload Gcs</button>

            {imageUrlGcs && (
                <div>
                    <p>Uploaded Image Gcs:</p>
                    <img src={imageUrlGcs} alt="Uploaded Gcs" style={{ width: 200 }} />
                </div>
            )}
        </div>
    </>
}

export default ImageUploader;
