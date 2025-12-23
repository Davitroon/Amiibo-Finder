// ---------------------------------------------------------
// LÓGICA PURA Y LLAMADAS A API (Sin React)
// ---------------------------------------------------------

const API_URL = "https://amiiboapi.com/api/amiibo/?page=1&type=figure";

// 1. Fetch y Caché de la lista completa
export const getFullAmiiboList = async () => {
    // Intentar leer de caché
    const storedList = localStorage.getItem("amiiboFinderFullList");
    if (storedList) return JSON.parse(storedList);

    // Si no está, descargar
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        const list = json.amiibo;
        // Guardar en caché
        localStorage.setItem("amiiboFinderFullList", JSON.stringify(list));
        return list;
    } catch (error) {
        console.error("Error fetching amiibos", error);
        throw error; // Lanzamos el error para que el hook lo maneje
    }
};

// 2. Pre-carga de imágenes
export const preloadImage = (src: string) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
    });
};

// 3. Formatear tiempo (HH:MM:SS)
export const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// 4. Notificaciones
export const triggerBrowserNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Amiibo Finder", {
            body: "🎁 Your gift is ready! Click to unlock a new Amiibo.",
            icon: "/favicon.ico", 
        });
    }
};