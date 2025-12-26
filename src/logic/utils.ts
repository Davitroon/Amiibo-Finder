const API_URL = "https://amiiboapi.com/api/amiibo/?page=1&type=figure";

/**
 * Fetches the complete list of Amiibos from the API.
 * Implements a caching strategy using LocalStorage to minimize network requests.
 * @returns A promise that resolves to the array of Amiibos.
 */
export const getFullAmiiboList = async () => {
    // Try reading from cache first
    const storedList = localStorage.getItem("amiiboFinderFullList");
    if (storedList) return JSON.parse(storedList);

    // If not found in cache, download from API
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        const list = json.amiibo;
        
        // Save to cache for future use
        localStorage.setItem("amiiboFinderFullList", JSON.stringify(list));
        return list;
    } catch (error) {
        console.error("Error fetching amiibos", error);
        throw error; // Rethrow so the hook can handle the UI state
    }
};

/**
 * Preloads an image into the browser cache to ensure smooth rendering
 * before displaying it in the UI.
 * @param src - The URL of the image to preload.
 * @returns A promise that resolves when the image is loaded (or fails).
 */
export const preloadImage = (src: string) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to prevent blocking the UI
    });
};

/**
 * Formats a duration in milliseconds into a standard time string.
 * @param ms - The time in milliseconds.
 * @returns A string in the format "HH:MM:SS".
 */
export const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Triggers a native browser notification if the user has granted permission.
 * Used to alert the user when the cooldown timer has finished.
 */
export const triggerBrowserNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Amiibo Finder", {
            body: "🎁 Your gift is ready! Click to unlock a new Amiibo.",
            icon: "/favicon.ico", 
        });
    }
};