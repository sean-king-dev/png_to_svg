const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const potrace = require('potrace');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    // Convert image to grayscale buffer
    sharp(req.file.path)
        .greyscale()
        .toBuffer()
        .then(buffer => {
            potrace.trace(buffer, { color: 'black', background: 'white' }, (err, svg) => {
                if (err) return res.status(500).send('Error processing image.');

                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.setHeader('Content-Type', 'image/svg+xml');
                res.send(svg);
            });
        })
        .catch(err => res.status(500).send('Error processing image.'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
