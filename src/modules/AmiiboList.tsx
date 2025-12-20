import AmiiboCard from "./AmiiboCard";
import { useAmiibos } from "../context/AmiiboContext";

interface Props {
    setSelectedAmiibo: (amiibo: any) => void;
}

const AmiiboList = ({setSelectedAmiibo}: Props) => {
	const { userAmiibos } = useAmiibos();

	return (
		<div className="amiibo-grid">
			{userAmiibos.map((amiibo) => (
				<AmiiboCard
					key={amiibo.head + amiibo.tail}
					amiibo={amiibo}
					onClick={() => setSelectedAmiibo(amiibo)}
				/>
			))}
		</div>
	);
};

export default AmiiboList;
