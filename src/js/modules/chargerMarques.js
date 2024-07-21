import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase-config.js';

export async function chargerMarques() {
  const marqueSelect = document.getElementById('marque');
  const marquesSnapshot = await getDocs(collection(db, "marques"));
  marquesSnapshot.forEach((doc) => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().nom;
    marqueSelect.appendChild(option);
  });
}
