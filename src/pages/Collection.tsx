import { useState } from 'react';
import { useAmiibos } from '../context/AmiiboContext';
import AmiiboCard from '../modules/AmiiboCard';
import Modal from '../modules/Modal';

const Collection = () => {
  const { userAmiibos } = useAmiibos();
  const [selectedAmiibo, setSelectedAmiibo] = useState<any>(null);

  return (
    <div>
      <h2>My Collection</h2>
      <hr />
      
      <section className="amiibo-grid">
        {userAmiibos.length > 0 ? (
          userAmiibos.map((amiibo) => (
            <AmiiboCard 
              key={amiibo.head + amiibo.tail} 
              amiibo={amiibo} 
              onClick={() => setSelectedAmiibo(amiibo)}
            />
          ))
        ) : (
          <p>No hay amiibos desbloqueados. ¡Ve a la página Unlock!</p>
        )}
      </section>

      <Modal 
        isOpen={!!selectedAmiibo} 
        onClose={() => setSelectedAmiibo(null)} 
        amiibo={selectedAmiibo} 
      />
    </div>
  );
};

export default Collection;