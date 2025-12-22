import AmiiboCard from "./AmiiboCard";

interface Props {
    amiibos: any[];
}

const AmiiboList = ({ amiibos }: Props) => {
    return (
        <div className="amiibo-grid">
            {amiibos.map((amiibo) => (
                <AmiiboCard
                    // Usamos una key única combinando head+tail
                    key={amiibo.head + amiibo.tail}
                    amiibo={amiibo}
                />
            ))}
        </div>
    );
};
export default AmiiboList;