import { useState, useEffect } from "react";
import { useAmiibos } from "../context/AmiiboContext";

const COOLDOWN_TIME = 2 * 60 * 60 * 1000; 

export const useUnlockLogic = () => {
    // CAMBIO: Extraemos triggerConfetti del contexto
    const { unlockAmiibo, triggerConfetti } = useAmiibos(); 
    
    const [unlockedAmiibo, setUnlockedAmiibo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpeningAnim, setIsOpeningAnim] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    
    // ELIMINADO: const [showConfetti, setShowConfetti] = useState(false); ya no hace falta localmente

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

    useEffect(() => {
        const checkTimer = () => {
            const lastUnlock = localStorage.getItem("lastUnlockTime");
            if (lastUnlock) {
                const elapsed = Date.now() - parseInt(lastUnlock, 10);
                const left = COOLDOWN_TIME - elapsed;
                setRemainingTime(left > 0 ? left : 0);
            }
        };

        checkTimer();
        const interval = setInterval(checkTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const isLocked = remainingTime > 0;

    const handleUnlock = async () => {
        if (isLoading || isOpeningAnim || isLocked) return;

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

            localStorage.setItem("lastUnlockTime", Date.now().toString());
            setRemainingTime(COOLDOWN_TIME);

            const amiiboToSave = { 
                ...random, 
                unlockedAt: new Date().toLocaleDateString()
            };
            delete amiiboToSave.type;

            unlockAmiibo(amiiboToSave);
            setUnlockedAmiibo(amiiboToSave);
            
            // CAMBIO: Disparamos el confeti GLOBAL
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

    // ELIMINADO: handleConfettiComplete ya no se necesita aquí

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