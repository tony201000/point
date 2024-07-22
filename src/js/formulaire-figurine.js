// Importation des modules Firebase nécessaires
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from './firebase-config.js';

// Initialisation de Firestore et du Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Fonction pour ajouter une nouvelle figurine
export async function ajouterFigurine(figurineData, imagePrincipale, imagesSupplementaires) {
    try {
        // Vérifier si la figurine existe déjà
        const figurineExistante = await verifierFigurineExistante(figurineData.code_barre);
        if (figurineExistante) {
            throw new Error("Cette figurine existe déjà dans la base de données.");
        }

        // Uploader l'image principale
        const imagePrincipaleUrl = await uploadImage(imagePrincipale);

        // Uploader les images supplémentaires
        const imagesSupplementairesUrls = await Promise.all(
            Array.from(imagesSupplementaires).map(uploadImage)
        );

        // Ajouter la figurine à Firestore
        const docRef = await addDoc(collection(db, "figurines"), {
            ...figurineData,
            imagePrincipaleUrl,
            imagesSupplementairesUrls,
            dateAjout: new Date()
        });

        console.log("Figurine ajoutée avec succès, ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la figurine:", error);
        throw error;
    }
}

// Fonction pour vérifier si une figurine existe déjà
async function verifierFigurineExistante(codeBarre) {
    const q = query(collection(db, "figurines"), where("code_barre", "==", codeBarre));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Fonction pour uploader une image
async function uploadImage(imageFile) {
    const storageRef = ref(storage, `figurines/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
}

// Fonction pour récupérer toutes les figurines
export async function recupererFigurines() {
    try {
        const querySnapshot = await getDocs(collection(db, "figurines"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erreur lors de la récupération des figurines:", error);
        throw error;
    }
}

// Fonction pour générer les options d'années
function genererOptionsAnnees() {
    const anneeActuelle = new Date().getFullYear();
    const selectAnnee = document.getElementById('annee');
    for (let annee = anneeActuelle; annee >= 1900; annee--) {
        const option = document.createElement('option');
        option.value = annee;
        option.textContent = annee;
        selectAnnee.appendChild(option);
    }
}

// Écouteur d'événement pour le formulaire
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulaire-figurine');
    if (form) {
        genererOptionsAnnees();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const figurineData = Object.fromEntries(formData.entries());
            const imagePrincipale = formData.get('image_principale');
            const imagesSupplementaires = formData.getAll('images_supplementaires');

            try {
                await ajouterFigurine(figurineData, imagePrincipale, imagesSupplementaires);
                alert("Figurine ajoutée avec succès !");
                form.reset();
            } catch (error) {
                alert(`Erreur : ${error.message}`);
            }
        });
    }
});