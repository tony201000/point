import { remplirAnnees } from './modules/remplirAnnees.js';
import { chargerMarques } from './modules/chargerMarques.js';

document.addEventListener('DOMContentLoaded', () => {
  remplirAnnees();
  chargerMarques();

  document.getElementById('marque').addEventListener('change', async (e) => {
    const { chargerSeries } = await import('./modules/chargerSeries.js');
    const marqueId = e.target.value;
    chargerSeries(marqueId); 
  });

  document.getElementById('serie').addEventListener('change', async (e) => {
    const { chargerModeles } = await import('./modules/chargerModeles.js');
    const serieId = e.target.value;
    chargerModeles(serieId);
  });

  document.getElementById('figurineForm').addEventListener('submit', async (e) => {
    const { handleFormSubmit } = await import('./modules/handleFormSubmit.js');
    handleFormSubmit(e);
  });
});
