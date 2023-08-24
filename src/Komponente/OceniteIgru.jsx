import React, { useState } from 'react';
import '../App.css'; 

const OceniteIgru = () => {
  const [ocena, setOcena] = useState(0);

  const handleOcenaChange = (novaOcena) => {
    setOcena(novaOcena);
  };

  return (
    <div className="ocenite-igru">
      <h2>Ocenite igru Tetris</h2>
      <div className="zvezde">
        {[1, 2, 3, 4, 5].map((brojZvezda) => (
          <span
            key={brojZvezda}
            className={`zvezda ${brojZvezda <= ocena ? 'selektovana' : ''}`}
            onClick={() => handleOcenaChange(brojZvezda)}
          >
            ★
          </span>
        ))}
      </div>
      {ocena > 0 && <p>Vaša ocena: {ocena}</p>}
    </div>
  );
};

export default OceniteIgru;
