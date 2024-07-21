import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from './firebase-config.js';

export async function chargerSeries(marqueId) {
  const serieSelect = document.getElementById('serie');
  serieSelect.innerHTML = '';
  const seriesSnapshot = await getDocs(query(collection(db, "series"), where("marqueId", "==", marqueId)));
  seriesSnapshot.forEach((doc) => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().nom;
    serieSelect.appendChild(option);
  });
}

