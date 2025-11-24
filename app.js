// app.js

// 🔑 VOTRE CONFIGURATION FIREBASE (Clés insérées ici)
const firebaseConfig = {
  apiKey: "AIzaSyCLj6pNzKmc-sAF1arwxcp6R6xjNh8sC1Q",
  authDomain: "pwa-notes-demo.firebaseapp.com",
  projectId: "pwa-notes-demo",
  storageBucket: "pwa-notes-demo.firebasestorage.app",
  messagingSenderId: "370489126678",
  appId: "1:370489126678:web:cd3f28623529a7ce136a37"
};

// Initialisation de Firebase
// NOTE: Nous utilisons la version 'compat' dans le script HTML pour la simplicité.
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const notesCollection = db.collection('notes'); // Collection créée précédemment

const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');

// 1. Logique d'ajout (lors de l'envoi du formulaire)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    
    try {
        // Envoi des données vers Firestore
        await notesCollection.add({
            title: title,
            content: content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        form.reset();
        console.log("Note ajoutée à Firestore.");

    } catch (error) {
        console.error("Erreur lors de l'ajout à Firestore:", error);
        alert("Erreur lors de l'enregistrement de la note !");
    }
});

// 2. Logique d'affichage (écoute en temps réel)
// OnSnapshot écoute les changements et met à jour l'interface
notesCollection.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    let html = '';
    
    if (snapshot.empty) {
        notesList.innerHTML = '<p>Aucune note enregistrée pour l\'instant.</p>';
        return;
    }

    snapshot.forEach(doc => {
        const note = doc.data();
        html += `
            <div class="note">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            </div>
        `;
    });

    notesList.innerHTML = html;
});
