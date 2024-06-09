require('dotenv').config();

const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const processCSVData = require('./csvProcessor');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/upload-csv', async (req, res) => {
    const results = [];
    const csvFilePath = process.env.CSV_FILE_PATH;

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                await processCSVData(results);
                res.send('CSV data uploaded successfully.');
            } catch (error) {
                console.error('Error processing CSV data:', error);
                res.status(500).send('Error processing CSV data');
            }
        });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
