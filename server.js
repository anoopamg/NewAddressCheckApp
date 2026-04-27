require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express(); 

app.use(express.json());
app.use(express.static('public'));

/**
 * FIXED: Fetch GPS coordinates (Place Details New)
 * URL must be ://googleapis.com{placeId}
 * FieldMask must include 'location' to get Lat/Long
 */
app.post('/api/details', async (req, res) => {
    try {
        const { placeId, sessionToken } = req.body;
        const response = await axios.get(
            `https://places.googleapis.com/v1/places/${placeId}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
                    'X-Goog-FieldMask': 'id,location,displayName,formattedAddress' 
                },
                params: { sessionToken } 
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Details API Error:", error.response?.data || error.message);
        res.status(500).send("Details API Error");
    }
});

/**
 * FIXED: Search route (Autocomplete New)
 * URL must be ://googleapis.com
 * FieldMask must be 'suggestions'
 */
app.post('/api/search', async (req, res) => {
    try {
        const { input, sessionToken } = req.body;
        const response = await axios.post(
            'https://places.googleapis.com/v1/places:autocomplete',
            {
                input: input,
                sessionToken: sessionToken,
                includedRegionCodes: ["nz"],
                locationBias: {
                    circle: {
                        center: { latitude: -36.8485, longitude: 174.7633 }, // Auckland Bias
                        radius: 50000.0
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
                    'X-Goog-FieldMask': 'suggestions'
                }
            }
        );
       // Return suggestions to frontend
        res.json(response.data.suggestions || []);
        
    } catch (error) {
        // Log the actual error from Google for debugging
        console.error("Autocomplete API Error:", error.response?.data || error.message);
        res.status(500).send("Autocomplete API Error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}/login.html`);
});
