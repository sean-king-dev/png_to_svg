import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [svg, setSvg] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setSvg(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/convert', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            const svgBlob = new Blob([response.data], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);

            setSvg(svgUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!svg) return;

        const link = document.createElement('a');
        link.href = svg;
        link.download = 'converted.svg';
        link.click();
    };

    return (
        <div className="App">
            <h1>PNG to SVG Converter</h1>
            <input type="file" accept="image/png" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Converting...' : 'Convert'}
            </button>
            {svg && (
                <>
                    <h2>Converted SVG:</h2>
                    <img src={svg} alt="Converted SVG" />
                    <button onClick={handleDownload}>Download SVG</button>
                </>
            )}
        </div>
    );
}

export default App;
