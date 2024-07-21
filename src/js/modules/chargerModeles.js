import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from './firebase-config.js';

export async function chargerModeles(serieId) {
  const modeleSelect = document.getElementById('modele');
  modeleSelect.innerHTML = '';
  const modelesSnapshot = await getDocs(query(collection(db, "modeles"), where("serieId", "==", serieId)));
  modelesSnapshot.forEach((doc) => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().nom;
    modeleSelect.appendChild(option);
  });
}
