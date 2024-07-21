import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from './firebase-config.js';

export async function handleFormSubmit(e) {
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

    const imagePrincipaleRef = ref(storage, `images/${docRef.id}/imagePrincipale`);
    await uploadBytes(imagePrincipaleRef, imagePrincipale);
    console.log("Image principale uploadée");

    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(storage, `images/${docRef.id}/image_${i}`);
      await uploadBytes(imageRef, images[i]);
    }
    console.log("Images supplémentaires uploadées");
  } catch (error) {
    console.error("Erreur lors de l'ajout du document: ", error);
  }
}
