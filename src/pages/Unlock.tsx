import { useState } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import Modal from "../modules/Modal";

const Unlock = () => {
	const { unlockAmiibo } = useAmiibos();
	const [unlockedAmiibo, setUnlockedAmiibo] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Lógica de obtención de datos
	const handleUnlock = async () => {
		setIsLoading(true);
		let fullList = [];

		// Intentar leer caché o fetch API
		const storedList = localStorage.getItem("amiiboFinderFullList");

		if (storedList) {
			fullList = JSON.parse(storedList);

		} else {
			try {
				const res = await fetch(
					"https://amiiboapi.com/api/amiibo/?page=1&type=figure"
				);
				const json = await res.json();
				fullList = json.amiibo;
				localStorage.setItem("amiiboFinderFullList", JSON.stringify(fullList));

			} catch (error) {
				console.error("Error fetching amiibos", error);
				setIsLoading(false);
				return;
			}
		}

		if (fullList.length > 0) {
			const random = fullList[Math.floor(Math.random() * fullList.length)];

			unlockAmiibo(random);
			setUnlockedAmiibo(random);
		}
		setIsLoading(false);
	};

	return (
		<div>
			<h2>Unlock new Amiibos</h2>
			<hr />

			<div style={{ display: "flex", gap: "1rem", marginTop: "20px" }}>
				<button onClick={handleUnlock} disabled={isLoading}>
					{isLoading ? "Unlocking..." : "Unlock new amiibo"}
				</button>
			</div>

			{/* Reutilizamos el mismo componente Modal */}
			<Modal
				isOpen={!!unlockedAmiibo}
				onClose={() => setUnlockedAmiibo(null)}
				amiibo={unlockedAmiibo}
			/>
		</div>
	);
};

export default Unlock;
