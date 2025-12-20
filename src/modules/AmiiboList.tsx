import AmiiboCard from "./AmiiboCard";

// En AmiiboList.tsx
interface Props {
    amiibos: any[]; // Nueva prop
    setSelectedAmiibo: (amiibo: any) => void;
}

const AmiiboList = ({ amiibos, setSelectedAmiibo }: Props) => {
    // Ya no usamos userAmiibos del contexto aquí, usamos la lista filtrada
    return (
        <div className="amiibo-grid">
            {amiibos.map((amiibo) => (
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