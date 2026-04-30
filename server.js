require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express(); 

app.use(express.json());
app.use(express.static('public'));

/**
 * Fetch GPS coordinates (Place Details New)
 * Includes status pass-through and API Key override for testing
 */
app.post('/api/details', async (req, res) => {
    try {
        const { placeId, sessionToken } = req.body;

        if (!placeId) return res.status(400).json({ error: "placeId is required" });

        // Logic: Use header key if provided (for invalid key tests), else use .env
        const apiKey = req.headers['x-test-api-key'] || process.env.GOOGLE_PLACES_API_KEY;

        const response = await axios.get(
            `https://places.googleapis.com/v1/places/${placeId}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'id,location,displayName,formattedAddress' 
                },
                params: { sessionToken } 
            }
        );
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || "Details API Error";
        
        console.error(`Details API Error (${status}):`, message);
        res.status(status).json({ error: message });
    }
});

/**
 * Search route (Autocomplete New)
 * Includes status pass-through and API Key override for testing
 */
app.post('/api/search', async (req, res) => {
    try {
        const { input, sessionToken } = req.body;

        if (!input || input.length < 3) {
            return res.status(400).json({ error: "Search input must be at least 3 characters" });
        }

        // Logic: Use header key if provided (for invalid key tests), else use .env
        const apiKey = req.headers['x-test-api-key'] || process.env.GOOGLE_PLACES_API_KEY;

        const response = await axios.post(
            'https://places.googleapis.com/v1/places:autocomplete',
            {
                input: input,
                sessionToken: sessionToken,
                includedRegionCodes: ["nz"],
                locationBias: {
                    circle: {
                        center: { latitude: -36.8485, longitude: 174.7633 },
                        radius: 50000.0
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'suggestions'
                }
            }
        );
        res.json(response.data.suggestions || []);
        
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || "Autocomplete API Error";
        
        console.error(`Autocomplete API Error (${status}):`, message);
        res.status(status).json({ error: message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}/login.html`);
});
