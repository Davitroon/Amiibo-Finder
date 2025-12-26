import AmiiboCard from "./AmiiboCard";

/**
 * Props definition for the AmiiboList component.
 */
interface Props {
    /** The array of Amiibo objects to be rendered in the grid. */
    amiibos: any[];
}

/**
 * Component that renders a responsive grid of Amiibo cards.
 * It iterates over the provided data array and renders an AmiiboCard for each item.
 */
const AmiiboList = ({ amiibos }: Props) => {
    return (
        <div className="amiibo-grid">
            {amiibos.map((amiibo) => (
                <AmiiboCard
                    // Using a unique key combination of head + tail IDs provided by the API
                    key={amiibo.head + amiibo.tail}
                    amiibo={amiibo}
                />
            ))}
        </div>
    );
};

export default AmiiboList;