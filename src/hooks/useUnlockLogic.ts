import { useState, useEffect } from "react";
import { useAmiibos } from "../context/AmiiboContext";

const COOLDOWN_TIME = 2 * 60 * 60 * 1000; // 2 Horas

export const useUnlockLogic = () => {
    const { unlockAmiibo, triggerConfetti } = useAmiibos();
    
    const [unlockedAmiibo, setUnlockedAmiibo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpeningAnim, setIsOpeningAnim] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const preloadImage = (src: string) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve;
        });
    };

    // --- NOTIFICATIONS HELPERS ---
    const requestNotificationPermission = () => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    };

    const triggerNotification = () => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Amiibo Finder", {
                body: "🎁 Your gift is ready! Click to unlock a new Amiibo.",
                icon: "/favicon.ico", // Puedes poner la ruta de tu imagen de regalo aquí
            });
        }
    };

    useEffect(() => {
        // Pedimos permiso al montar el hook
        requestNotificationPermission();

        const checkTimer = () => {
            const lastUnlock = localStorage.getItem("lastUnlockTime");
            
            if (lastUnlock) {
                const elapsed = Date.now() - parseInt(lastUnlock, 10);
                const left = COOLDOWN_TIME - elapsed;

                if (left > 0) {
                    setRemainingTime(left);
                } else {
                    // El tiempo ha terminado
                    setRemainingTime(0);

                    // --- LÓGICA DE NOTIFICACIÓN ---
                    // Verificamos si ya enviamos la notificación para este ciclo
                    const notificationSent = localStorage.getItem("amiiboNotificationSent");
                    
                    // Si NO se ha enviado y el tiempo llegó a 0...
                    if (notificationSent !== "true") {
                        triggerNotification();
                        // Marcamos que ya avisamos para no repetir
                        localStorage.setItem("amiiboNotificationSent", "true");
                    }
                }
            }
        };

        checkTimer();
        const interval = setInterval(checkTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const isLocked = remainingTime > 0;

    const handleUnlock = async () => {
        if (isLoading || isOpeningAnim || isLocked) return;

        // Pedimos permiso también al hacer clic por si el navegador lo bloqueó antes
        requestNotificationPermission();

        setIsLoading(true);
        setIsOpeningAnim(true);

        let fullList = [];
        const storedList = localStorage.getItem("amiiboFinderFullList");

        try {
            if (storedList) {
                fullList = JSON.parse(storedList);
            } else {
                const res = await fetch("https://amiiboapi.com/api/amiibo/?page=1&type=figure");
                const json = await res.json();
                fullList = json.amiibo;
                localStorage.setItem("amiiboFinderFullList", JSON.stringify(fullList));
            }
        } catch (error) {
            console.error("Error fetching amiibos", error);
            setIsLoading(false);
            setIsOpeningAnim(false);
            return;
        }

        if (fullList.length > 0) {
            const random = fullList[Math.floor(Math.random() * fullList.length)];

            const animationDelay = new Promise((resolve) => setTimeout(resolve, 800));
            const imageLoad = preloadImage(random.image);

            await Promise.all([animationDelay, imageLoad]);

            // Guardamos timestamp del desbloqueo
            localStorage.setItem("lastUnlockTime", Date.now().toString());
            
            // RESETEAMOS LA NOTIFICACIÓN PARA EL PRÓXIMO CICLO
            localStorage.setItem("amiiboNotificationSent", "false"); 
            
            setRemainingTime(COOLDOWN_TIME);

            const amiiboToSave = { 
                ...random, 
                unlockedAt: new Date().toLocaleDateString()
            };
            delete amiiboToSave.type;

            unlockAmiibo(amiiboToSave);
            setUnlockedAmiibo(amiiboToSave);
            
            triggerConfetti();
            
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setIsOpeningAnim(false);
        }
    };

    const closeModal = () => {
        setUnlockedAmiibo(null);
        setIsOpeningAnim(false);
    };

    return {
        unlockedAmiibo,
        isLoading,
        isOpeningAnim,
        remainingTime,
        isLocked,
        handleUnlock,
        closeModal,
        formatTime,
    };
};