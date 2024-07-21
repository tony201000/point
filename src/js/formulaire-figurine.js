// src/js/app.js
import { db, storage } from './firebase-config.js';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

//application de vue
import Vue from 'vue';

new Vue({
  el: '#app',
  data() {
    return {
      // Données du formulaire 
    };
  },
  methods: {
    async submitForm() {
      // Traitement du formulaire
    }
  }
});

// Fonction pour remplir les années
function remplirAnnees() {
  const anneeSelect = document.getElementById('annee');
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    anneeSelect.appendChild(option);
  }
}

// Appel de la fonction pour remplir les années
remplirAnnees();

// Fonction pour charger les marques
async function chargerMarques() {
  const marqueSelect = document.getElementById('marque');
  const marquesSnapshot = await getDocs(collection(db, "marques"));
  marquesSnapshot.forEach((doc) => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().nom;
    marqueSelect.appendChild(option);
  });
}

// Appel de la fonction pour charger les marques
chargerMarques();

// Écouteur pour changer la série en fonction de la marque
document.getElementById('marque').addEventListener('change', async (e) => {
  const marqueId = e.target.value;
  const serieSelect = document.getElementById('serie');
  serieSelect.innerHTML = '';
  const seriesSnapshot = await getDocs(query(collection(db, "series"), where("marqueId", "==", marqueId)));
  seriesSnapshot.forEach((doc) => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().nom;
    serieSelect.appendChild(option);
  });
});

// Écouteur pour changer le modèle en fonction de la série
document.getElementById('serie').addEventListener('change', async (e) => {
  const serieId = e.target.value;
  const modeleSelect = document.getElementById('modele');
  modeleSelect.innerHTML = '';
  const modelesSnapshot = await getDocs(query(collection(db, "modeles"), where("serieId", "==", serieId)));
  modelesSnapshot.forEach((doc) => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().nom;
    modeleSelect.appendChild(option);
  });
});

// Écouteur pour soumettre le formulaire
document.getElementById('figurineForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const marque = document.getElementById('marque').value;
  const serie = document.getElementById('serie').value;
  const modele = document.getElementById('modele').value;
  const nomPersonnage = document.getElementById('nomPersonnage').value;
  const codeBarre = document.getElementById('codeBarre').value;
  const edition = document.getElementById('edition').value;
  const annee = document.getElementById('annee').value;
  const materiau = document.getElementById('materiau').value;
  const imagePrincipale = document.getElementById('imagePrincipale').files[0];
  const images = document.getElementById('images').files;

  try {
    // Ajouter les données de la figurine dans Firestore
    const docRef = await addDoc(collection(db, "figurines"), {
      marque,
      serie,
      modele,
      nomPersonnage,
      codeBarre,
      edition,
      annee,
      materiau
    });
    console.log("Document écrit avec ID: ", docRef.id);

    // Uploader l'image principale dans Firebase Storage
    const imagePrincipaleRef = ref(storage, `images/${docRef.id}/imagePrincipale`);
    await uploadBytes(imagePrincipaleRef, imagePrincipale);
    console.log("Image principale uploadée");

    // Uploader les images supplémentaires dans Firebase Storage
    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(storage, `images/${docRef.id}/image_${i}`);
      await uploadBytes(imageRef, images[i]);
    }
    console.log("Images supplémentaires uploadées");
  } catch (error) {
    console.error("Erreur lors de l'ajout du document: ", error);
  }
});
