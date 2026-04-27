# NZ Address Finder

A modern web application for finding and retrieving detailed information about New Zealand addresses using Google Places API. The app features user authentication, real-time address autocomplete, and precise GPS coordinate retrieval.

## 📋 Project Overview

**NZ Address Finder** is a full-stack web application built with Node.js and Express that provides an intuitive interface for searching and locating addresses within New Zealand. It leverages the Google Places API (New) to deliver accurate address suggestions with geographic coordinates (latitude/longitude).

### Key Features

- **User Authentication**: Secure login system with session management
- **Address Autocomplete**: Real-time search suggestions as users type
- **Location Bias**: Search results are intelligently biased toward Auckland, New Zealand
- **GPS Coordinates**: Display precise latitude and longitude for selected addresses
- **Session Token Management**: Optimized Google API billing using session tokens
- **Responsive Design**: Modern, gradient-styled UI with Tailwind CSS
- **Debounced Search**: Prevents excessive API calls with 400ms debounce
- **Loading States**: Visual feedback during API requests

## 🏗️ Project Architecture

### Tech Stack

**Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for routing and middleware
- **Axios** - HTTP client for Google Places API calls
- **JWT** - JSON Web Tokens (jsonwebtoken) for authentication
- **Dotenv** - Environment variable management
- **Body Parser** - Middleware for parsing JSON requests

**Frontend:**
- **HTML5** - Semantic markup
- **Vanilla JavaScript** - Client-side logic (no frameworks)
- **Tailwind CSS** - Utility-first CSS framework
- **Google Places API (New)** - Address data and coordinates

### Project Structure

```
AddressCheckApp/
├── package.json                 # Project metadata and dependencies
├── server.js                    # Express server and API endpoints
├── .env                        # Environment variables (not in repo)
├── public/                     # Frontend static files
│   ├── login.html             # Login page UI
│   ├── login.js               # Login authentication logic
│   ├── search.html            # Search/address page UI
│   ├── search.js              # Search functionality and API calls
│   ├── style.css              # Custom CSS styling
│   └── style_bckp.css         # CSS backup
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

Before running this application, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Places API Key** - Get it from [Google Cloud Console](https://console.cloud.google.com/)
- A code editor (VS Code recommended)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd AddressCheckApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This will install:
   - `express` - Web server framework
   - `axios` - HTTP client for API requests
   - `dotenv` - Environment variable loader
   - `jsonwebtoken` - JWT authentication
   - `body-parser` - JSON request parsing

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   PORT=5000
   ```

   **Note:** The `GOOGLE_PLACES_API_KEY` is required to use the Google Places API. Obtain it from:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the "Places API"
   - Create an API key (Restrict it to Web applications for security)

### Running the Application

1. **Start the server**
   ```bash
   node server.js
   ```

   Expected output:
   ```
   🚀 Server is running at http://localhost:5000/login.html
   ```

2. **Access the application**
   - Open your browser and navigate to: `http://localhost:5000/login.html`

3. **Login credentials**
   - **Username:** `adminuser`
   - **Password:** `password123`

   After successful login, you'll be redirected to the search page.

## 📱 Application Flow

### 1. Login Page (`login.html` / `login.js`)

**Purpose**: Authenticate users before accessing the search functionality

**Features:**
- Username and password input fields
- Form validation (checks for empty fields)
- Error message display for invalid credentials
- Session storage to maintain login state
- Hardcoded credentials for authentication

**Code Flow:**
```
User enters username & password
    ↓
handleLogin() validates input
    ↓
Credentials checked against hardcoded values
    ↓
If valid: Set sessionStorage and redirect to /search.html
If invalid: Display error message
```

### 2. Search Page (`search.html` / `search.js`)

**Purpose**: Provide an interface to search for addresses and display coordinates

**Features:**
- Search input with real-time suggestions
- Address autocomplete dropdown
- Location selection with coordinate display
- Clear button to reset search
- Logout functionality
- Loading spinner during API calls

**Key Functions:**

- **`handleSearch(val)`** - Main search function triggered on user input
  - Validates minimum 3 characters
  - Implements 400ms debounce to reduce API calls
  - Calls `/api/search` backend endpoint
  - Populates results dropdown with suggestions

- **`selectAddress(placeId, description)`** - Handles address selection
  - Fetches detailed information via `/api/details`
  - Extracts and displays GPS coordinates
  - Refreshes session token for next search

- **`clearSearch()`** - Resets the search interface
  - Clears input field
  - Hides results dropdown and coordinates
  - Resets session token

- **`logout()`** - Logs out the user
  - Clears localStorage
  - Redirects to login page

### 3. Backend API (`server.js`)

**Purpose**: Handle Google Places API integration and proxy requests safely

**Environment**: Uses `dotenv` to load `GOOGLE_PLACES_API_KEY` from `.env` file

#### Endpoint 1: `POST /api/search`

**Purpose**: Autocomplete address suggestions

**Request Body:**
```json
{
  "input": "Search query",
  "sessionToken": "UUID token"
}
```

**Process:**
1. Receives search input from frontend
2. Calls Google Places Autocomplete API (`/v1/places:autocomplete`)
3. Applies location bias (Auckland region: -36.8485°S, 174.7633°E)
4. Restricts results to New Zealand (`includedRegionCodes: ["nz"]`)
5. Uses session token for billing optimization
6. Returns array of address suggestions

**Response:**
```json
[
  {
    "placePrediction": {
      "text": { "text": "Full Address", "text_truncated": "Short Address" },
      "placeId": "ChIJN..."
    }
  },
  ...
]
```

#### Endpoint 2: `POST /api/details`

**Purpose**: Fetch detailed information for a selected address

**Request Body:**
```json
{
  "placeId": "ChIJN...",
  "sessionToken": "UUID token"
}
```

**Process:**
1. Receives placeId from frontend
2. Calls Google Places Details API (`/v1/places/{placeId}`)
3. Requests specific fields: `id, location, displayName, formattedAddress`
4. Uses same session token for billing continuity
5. Returns place details including GPS coordinates

**Response:**
```json
{
  "id": "places/ChIJN...",
  "location": {
    "latitude": -36.8485,
    "longitude": 174.7633
  },
  "displayName": {
    "text": "Address Name"
  },
  "formattedAddress": "Full Address"
}
```

**Error Handling:** Both endpoints include try-catch blocks that:
- Log detailed error messages to console
- Return appropriate HTTP status codes
- Display user-friendly error messages via toast notifications

## 🎨 User Interface

### Styling (`style.css`)

**Design System:**
- **Color Scheme**: Purple gradient (`#667eea` to `#764ba2`)
- **Font**: Segoe UI system font stack
- **Layout**: CSS Flexbox and Grid
- **Responsive**: Mobile-first approach with Tailwind CSS

**Key UI Components:**

1. **Login Form**
   - Centered card layout
   - Page header with title and subtitle
   - Input fields with focus states
   - Gradient button
   - Error message display

2. **Search Interface**
   - Navigation bar with logout button
   - Search input with rounded borders
   - Results dropdown with scroll
   - Loading spinner
   - Coordinates display box
   - Interactive result items with location icon

### Visual Features:
- Smooth transitions and hover effects on buttons
- Box shadows for depth
- Rounded corners for modern look
- Gradient text for branding
- Focus ring outlines for accessibility
- Custom scrolling for results dropdown

## 🔐 Security Considerations

### Current Implementation:
- Hardcoded credentials (for demo purposes)
- Environment variable protection of API key
- Session token usage for API billing optimization

### Recommendations for Production:
1. Implement proper user authentication (database with hashed passwords)
2. Use JWT tokens with expiration
3. Add CORS restrictions
4. Implement rate limiting on API endpoints
5. Add input validation and sanitization
6. Use HTTPS for all connections
7. Implement proper error handling without exposing sensitive information
8. Add request logging and monitoring

## 🔍 How to Use the Application

### Step-by-Step Usage:

1. **Launch the application**
   ```bash
   node server.js
   ```

2. **Login**
   - Open `http://localhost:5000/login.html`
   - Enter username: `adminuser`
   - Enter password: `password123`
   - Click "Login"

3. **Search for an address**
   - Start typing a New Zealand address (e.g., "Aotea")
   - Minimum 3 characters required for suggestions
   - Wait 400ms after typing stops to see results
   - Results will appear in a dropdown below the search field

4. **View coordinates**
   - Click on an address from the dropdown
   - GPS coordinates will display below in blue box
   - Coordinates show as: "Lat: -XX.XXXX, Long: XXX.XXXX"

5. **Clear search**
   - Click the "✕" button to reset the search
   - Or start typing a new search query

6. **Logout**
   - Click the "Logout" button in the top-right navigation
   - You'll be redirected to the login page

## 🐛 Debugging

### Common Issues and Solutions:

**Issue: "Details API Error" or "Autocomplete API Error"**
- **Check**: Google Places API key is valid in `.env`
- **Check**: API is enabled in Google Cloud Console
- **Check**: API key restrictions allow your app's requests
- **Verify**: Network tab in browser DevTools shows actual error from Google

**Issue: Search results not appearing**
- **Check**: You've typed at least 3 characters
- **Check**: Waited for debounce timeout (400ms)
- **Check**: Network request succeeds in browser DevTools
- **Check**: Google API has billing enabled (free tier may be limited)

**Issue: Session token errors**
- **Check**: Browser console for specific error messages
- **Check**: Server logs for detailed error information

**Enable Debug Logging:**
Open browser DevTools (F12) and check:
- **Console tab**: JavaScript errors and logs
- **Network tab**: API request/response details
- **Application tab**: SessionStorage and LocalStorage values

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                            │
│  Login.html ──────────→ Search.html ←──────── Style.css    │
└─────────────────────────────────────────────────────────────┘
              ↓ (Submit Login)               ↓ (Type Address)
┌─────────────────────────────────────────────────────────────┐
│                    Client Scripts                            │
│     login.js ────→ validateCredentials    search.js         │
└─────────────────────────────────────────────────────────────┘
              ↓ (Authenticate)               ↓ (API Call)
┌─────────────────────────────────────────────────────────────┐
│                   Node.js Server                             │
│  Verify Login ────→ sessionStorage    /api/search          │
│                                       /api/details          │
└─────────────────────────────────────────────────────────────┘
                                          ↓ (Proxy Request)
┌─────────────────────────────────────────────────────────────┐
│            Google Places API (New)                          │
│  /v1/places:autocomplete                                    │
│  /v1/places/{placeId}                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Dependencies Explained

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework for routing and middleware |
| `axios` | ^1.15.2 | HTTP client for making API requests |
| `dotenv` | ^17.4.2 | Load environment variables from .env file |
| `jsonwebtoken` | ^9.0.3 | JWT token generation and verification |
| `body-parser` | ^2.2.2 | Parse incoming JSON request bodies |

## 🎓 Key Concepts Demonstrated

1. **Full-Stack Development**: Frontend and backend integration
2. **API Integration**: Proxying third-party APIs securely
3. **Client-Side Optimization**: Debouncing API calls
4. **Session Management**: Using tokens for billing optimization
5. **Error Handling**: Try-catch blocks and error logging
6. **Responsive Design**: Mobile-friendly UI with Tailwind CSS
7. **Authentication**: User login flow with sessionStorage
8. **Geolocation**: Working with latitude/longitude data
9. **Async/Await**: Modern async JavaScript patterns
10. **REST API**: Creating and consuming HTTP endpoints

## 🚀 Performance Optimizations

- **Debouncing**: 400ms wait after user stops typing prevents excessive API calls
- **Session Tokens**: Reused for multiple operations, optimizing Google API billing
- **Lazy Rendering**: Results only shown when API returns suggestions
- **CSS Gradients**: GPU-accelerated with native CSS
- **Efficient DOM Manipulation**: Minimal reflows and repaints

## 🔄 Version History

- **v1.0.0** - Initial release with Google Places API (New) integration

## 📝 Notes for Interviewers

This project demonstrates:
- Full-stack JavaScript proficiency (Node.js + Vanilla JS frontend)
- RESTful API design and integration
- Error handling and resilience
- User authentication and session management
- Working with third-party APIs (Google Places)
- Modern CSS and responsive design
- Security best practices (environment variables, API key protection)
- Code organization and maintainability
- Async programming patterns

## 📞 Support

For questions or issues:
1. Check the Debugging section above
2. Review browser and server console logs
3. Verify Google Places API configuration
4. Ensure all dependencies are installed correctly


---

**Created for Interview Submission** | Built with Node.js + Express + Google Places API
