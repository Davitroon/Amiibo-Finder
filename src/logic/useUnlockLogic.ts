import { useState, useEffect, useRef } from "react";
import { useAmiibo } from "../context/AmiiboContext";
// Importamos las funciones del archivo de al lado (punto para referenciar misma carpeta)
import {
	getFullAmiiboList,
	preloadImage,
	formatTime,
	triggerBrowserNotification,
} from "./utils";

const COOLDOWN_TIME = 2 * 60 * 60 * 1000;

export const useUnlockLogic = () => {
	// Conexión con el Contexto Global
	const { unlockAmiibo, triggerConfetti, userAmiibos } = useAmiibo();

	// Estados locales de la UI
	const [unlockedAmiibo, setUnlockedAmiibo] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpeningAnim, setIsOpeningAnim] = useState(false);
	const [remainingTime, setRemainingTime] = useState<number>(0);
	const isFirstCheck = useRef(true);

	// --- LÓGICA DEL TEMPORIZADOR ---
	useEffect(() => {
		const checkTimer = () => {
			const lastUnlock = localStorage.getItem("lastUnlockTime");

			if (lastUnlock) {
				const elapsed = Date.now() - parseInt(lastUnlock, 10);
				const left = COOLDOWN_TIME - elapsed;

				if (left > 0) {
					setRemainingTime(left);
					localStorage.setItem("amiiboNotificationSent", "false");
				} else {
					setRemainingTime(0);
					// Lógica de notificación
					if (!isFirstCheck.current) {
						const notificationSent = localStorage.getItem(
							"amiiboNotificationSent"
						);
						if (notificationSent !== "true") {
							triggerBrowserNotification(); // <--- Función importada
							localStorage.setItem("amiiboNotificationSent", "true");
						}
					} else {
						localStorage.setItem("amiiboNotificationSent", "true");
					}
				}
			}
			isFirstCheck.current = false;
		};

		checkTimer();
		const interval = setInterval(checkTimer, 1000);
		return () => clearInterval(interval);
	}, []);

	const isLocked = remainingTime > 0;

	// --- LÓGICA PRINCIPAL DE APERTURA ---
	const handleUnlock = async () => {
		if (isLoading || isOpeningAnim || isLocked) return;

		setIsLoading(true);
		setIsOpeningAnim(true);

		try {
			// 1. Obtenemos lista (Función importada)
			const fullList = await getFullAmiiboList();

			// 2. Filtramos repetidos (userAmiibos viene del Context)
			const ownedIds = new Set(userAmiibos.map((a) => a.head + a.tail));
			const availableAmiibos = fullList.filter(
				(amiibo: any) => !ownedIds.has(amiibo.head + amiibo.tail)
			);

			// 3. Elegimos y guardamos
			if (availableAmiibos.length > 0) {
				const random =
					availableAmiibos[Math.floor(Math.random() * availableAmiibos.length)];

				// Esperamos animación + carga (Función importada)
				await Promise.all([
					new Promise((resolve) => setTimeout(resolve, 800)),
					preloadImage(random.image),
				]);

				// Guardar timestamp
				localStorage.setItem("lastUnlockTime", Date.now().toString());
				localStorage.setItem("amiiboNotificationSent", "false");
				setRemainingTime(COOLDOWN_TIME);

				const amiiboToSave = {
					...random,
					unlockedAt: new Date().toLocaleDateString(),
				};
				delete amiiboToSave.type;

				unlockAmiibo(amiiboToSave); // Actualiza Context
				setUnlockedAmiibo(amiiboToSave); // Actualiza UI Local
				triggerConfetti(); // Lanza Confeti
			} else {
				alert("¡Increíble! Has completado la colección entera.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
			if (isLocked) setIsOpeningAnim(false);
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
		formatTime, // Exportamos la función importada para que la use el componente
	};
};
