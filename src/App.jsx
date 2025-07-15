import  { useState, useEffect } from 'react';

// Main App component
const App = () => {
    // State variables to manage application data and UI
    const [locationInfo, setLocationInfo] = useState(''); // Stores the HTML string for location details
    const [message, setMessage] = useState("Click 'Get My Location' to find out where you are!"); // Stores messages for the user
    const [messageType, setMessageType] = useState('info'); // Type of message (info, success, error)
    const [isLoading, setIsLoading] = useState(false); // Controls the visibility of the loading spinner

    // Function to display messages to the user
    const showMessage = (text, type = 'info') => {
        setMessage(text);
        setMessageType(type);
    };

    // Function to hide the message box
    const hideMessageBox = () => {
        setMessage('');
        setMessageType('info'); 
    };

    // Success callback for geolocation API
    const success = (position) => {
        setIsLoading(false); 
        hideMessageBox(); 

        const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;

        // Construct HTML for location details
        let infoHtml = `
            <p><strong>Latitude:</strong> ${latitude.toFixed(6)}°</p>
            <p><strong>Longitude:</strong> ${longitude.toFixed(6)}°</p>
            <p><strong>Accuracy:</strong> &plusmn;${accuracy.toFixed(2)} meters</p>
        `;

        if (altitude !== null) {
            infoHtml += `<p><strong>Altitude:</strong> ${altitude.toFixed(2)} meters</p>`;
        }
        if (heading !== null) {
            infoHtml += `<p><strong>Heading:</strong> ${heading.toFixed(2)} degrees</p>`;
        }
        if (speed !== null) {
            infoHtml += `<p><strong>Speed:</strong> ${speed.toFixed(2)} m/s</p>`;
        }

        setLocationInfo(infoHtml);
        showMessage('Location fetched successfully!', 'success'); 
    };

    // Error callback for geolocation API
    const error = (err) => {
        setIsLoading(false); 
        setLocationInfo(''); 

        let errorMessage = 'An unknown error occurred.';
        switch (err.code) {
            case err.PERMISSION_DENIED:
                errorMessage = "Permission denied: You have denied access to your location. Please enable location services for this site in your browser settings.";
                break;
            case err.POSITION_UNAVAILABLE:
                errorMessage = "Position unavailable: Your location information is currently unavailable.";
                break;
            case err.TIMEOUT:
                errorMessage = "Timeout: The request to get user location timed out. Please try again.";
                break;
            case err.UNKNOWN_ERROR:
                errorMessage = "Unknown error: An unknown error occurred while trying to retrieve your location.";
                break;
            default:
                errorMessage = `Error (${err.code}): ${err.message}`; // Fallback for other errors
        }
        showMessage(errorMessage, 'error'); // Show error message
        console.error(`Geolocation error (${err.code}): ${err.message}`);
    };

    // Function to handle the "Get My Location" button click
    const getLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true); 
            setLocationInfo('');  
            hideMessageBox();    

            // Request current position
            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true, 
                timeout: 10000,           
                maximumAge: 0             
            });
        } else {
            showMessage("Geolocation is not supported by your browser. Please use a modern browser.", 'error');
        }
    };

    // useEffect hook to display initial message when the component mounts
    useEffect(() => {
    }, []);

    return (
        <div className="min-h-screen flex justify-center items-center p-4 bg-gray-100 font-inter">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Where Am I?</h1>

                {/* Message Box */}
                {message && (
                    <div className={`message-box p-4 rounded-lg mt-6 text-left ${
                        messageType === 'info' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                        messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                        'bg-green-100 text-green-800 border border-green-300'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Location Information Display */}
                {locationInfo && (
                    <div className="location-info mt-6 text-left text-gray-700 text-lg" dangerouslySetInnerHTML={{ __html: locationInfo }}>
                    </div>
                )}

                <div className="flex justify-center items-center mt-8">
                    <button
                        id="getLocationBtn"
                        onClick={getLocation}
                        disabled={isLoading}
                        className={`
                            button bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-8 rounded-xl
                            font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-lg
                            hover:opacity-90 hover:translate-y-[-2px] hover:shadow-xl
                            active:translate-y-0 active:shadow-md
                            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                    >
                        Get My Location
                    </button>
                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="loading-spinner ml-4 border-4 border-gray-200 border-l-indigo-500 rounded-full w-6 h-6 animate-spin"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
