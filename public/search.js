let timeout = null;
let currentSessionToken = crypto.randomUUID();

/**
 * Main search function triggered by user typing
 */
async function handleSearch(val) {
    const resultsList = document.getElementById('results');
    const clearBtn = document.getElementById('clear-btn');
    const coordDisplay = document.getElementById('coord-display');
    const loader = document.getElementById('loader');

    // 1. Initial UI Toggles
    if (val.length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
        coordDisplay.style.display = 'none';
        resultsList.style.display = 'none';
        return;
    }

    // 2. Minimum length check
    if (val.length < 3) {
        resultsList.innerHTML = '';
        resultsList.style.display = 'none';
        return;
    }

    // 3. Debounce the search (waits 400ms after last keystroke)
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
        // Show loader, hide clear button briefly
        loader.style.display = 'block';
        clearBtn.style.display = 'none';

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // For JWT middleware
                },
                body: JSON.stringify({
                    input: val,
                    sessionToken: currentSessionToken
                })
            });

            if (!res.ok) throw new Error('Search request failed');

            const suggestions = await res.json();

            if (suggestions && suggestions.length > 0) {
                resultsList.style.display = 'block';
                // Map Google Places (New) data structure with better formatting
                resultsList.innerHTML = suggestions.map(s => {
                    const text = s.placePrediction.text.text;
                    const mainText = s.placePrediction.text.text_truncated || text;
                    const placeId = s.placePrediction.placeId;
                    
                    return `
                        <li class="result-item" onclick="selectAddress('${placeId.replace(/'/g, "\\'")}', '${text.replace(/'/g, "\\'")}')" title="${text}">
                            <div class="result-icon">📍</div>
                            <div class="result-text">
                                <div class="result-main">${mainText}</div>
                            </div>
                        </li>
                    `;
                }).join('');
            } else {
                resultsList.style.display = 'none';
                resultsList.innerHTML = '';
            }
        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            // Always hide loader and show clear button when finished
            loader.style.display = 'none';
            clearBtn.style.display = 'block';
        }
    }, 400);
}

/**
 * Triggered when a user clicks an address from the dropdown
 */
async function selectAddress(placeId, description) {
    const loader = document.getElementById('loader');
    const resultsList = document.getElementById('results');
    const queryInput = document.getElementById('query');

    queryInput.value = description;
    resultsList.style.display = 'none';
    loader.style.display = 'block';

    try {
        const res = await fetch('/api/details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                placeId: placeId,
                sessionToken: currentSessionToken
            })
        });

        if (!res.ok) throw new Error('Details request failed');

        const data = await res.json();

        // Display coordinates from Places (New) format (latitude/longitude)
        if (data.location) {
            const display = document.getElementById('coord-display');
            const latLongText = document.getElementById('lat-long');

            display.style.display = 'block';
            latLongText.innerText = `Lat: ${data.location.latitude}, Long: ${data.location.longitude}`;
        }
    } catch (err) {
        console.error("Details Error:", err);
    } finally {
        loader.style.display = 'none';
    }

    // Refresh Session Token for the next search flow (Google billing requirement)
    currentSessionToken = crypto.randomUUID();
}

/**
 * Resets the search interface
 */
function clearSearch() {
    document.getElementById('query').value = '';
    document.getElementById('results').style.display = 'none';
    document.getElementById('coord-display').style.display = 'none';
    document.getElementById('clear-btn').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    currentSessionToken = crypto.randomUUID();
}

/**
 * Logs out the user
 */
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
