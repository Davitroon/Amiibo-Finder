import { useState, useEffect, useRef } from "react";
import { useAmiibo } from "../context/AmiiboContext";
// Import helper functions from the utility file in the same directory
import {
	getFullAmiiboList,
	preloadImage,
	formatTime,
	triggerBrowserNotification,
} from "./utils";

const COOLDOWN_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds

/**
 * Custom hook that manages the logic for the "Mystery Gift" unlock mechanism.
 * Handles the countdown timer, API fetching, random selection, filtering of owned items,
 * and manages UI states (animations, loading, modals).
 */
export const useUnlockLogic = () => {
	// Global Context connection
	const { unlockAmiibo, triggerConfetti, userAmiibos } = useAmiibo();

	// Local UI States
	const [unlockedAmiibo, setUnlockedAmiibo] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpeningAnim, setIsOpeningAnim] = useState(false);
	const [remainingTime, setRemainingTime] = useState<number>(0);

	// Ref to prevent notification trigger on initial page load
	const isFirstCheck = useRef(true);

	// --- TIMER LOGIC ---
	useEffect(() => {
		const checkTimer = () => {
			const lastUnlock = localStorage.getItem("lastUnlockTime");

			if (lastUnlock) {
				const elapsed = Date.now() - parseInt(lastUnlock, 10);
				const left = COOLDOWN_TIME - elapsed;

				if (left > 0) {
					setRemainingTime(left);
					// Reset notification flag while waiting
					localStorage.setItem("amiiboNotificationSent", "false");
				} else {
					setRemainingTime(0);

					// Notification Logic: Only trigger if it's not the initial mount
					// and if we haven't sent it yet for this cycle.
					if (!isFirstCheck.current) {
						const notificationSent = localStorage.getItem(
							"amiiboNotificationSent"
						);

						if (notificationSent !== "true") {
							triggerBrowserNotification();
							localStorage.setItem("amiiboNotificationSent", "true");
						}
					} else {
						// If it's the first check and time is up, assume notification isn't needed immediately
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

	// --- MAIN UNLOCK LOGIC ---
	const handleUnlock = async () => {
		if (isLoading || isOpeningAnim || isLocked) return;

		setIsLoading(true);
		setIsOpeningAnim(true);

		try {
			// 1. Fetch complete list from API (Utility function)
			const fullList = await getFullAmiiboList();

			// 2. Filter out Amiibos already owned by the user
			// We create a Set of IDs (head + tail) for O(1) lookup performance
			const ownedIds = new Set(userAmiibos.map((a) => a.head + a.tail));
			const availableAmiibos = fullList.filter(
				(amiibo: any) => !ownedIds.has(amiibo.head + amiibo.tail)
			);

			// 3. Select Random & Save
			if (availableAmiibos.length > 0) {
				const random =
					availableAmiibos[Math.floor(Math.random() * availableAmiibos.length)];

				// Wait for both the minimum animation time (800ms) and the image preload
				await Promise.all([
					new Promise((resolve) => setTimeout(resolve, 800)),
					preloadImage(random.image),
				]);

				// Reset Timer & Save Timestamp
				localStorage.setItem("lastUnlockTime", Date.now().toString());
				localStorage.setItem("amiiboNotificationSent", "false");
				setRemainingTime(COOLDOWN_TIME);

				const amiiboToSave = {
					...random,
					unlockedAt: new Date().toLocaleDateString(),
				};
				// Clean up unnecessary API properties if needed
				delete amiiboToSave.type;

				unlockAmiibo(amiiboToSave); // Update Global Context
				setUnlockedAmiibo(amiiboToSave); // Update Local UI (Modal)
				triggerConfetti(); // Trigger Effect
			} else {
				alert("Incredible! You have completed the entire collection.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
			// Only stop animation state if logic finished;
			// if locked, it stays locked visually.
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
		formatTime, // Re-exporting utility for the UI component
	};
};
