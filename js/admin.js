// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDpw2Gf69O6MD2wZi4j3gS5hXL0Bh1K6QQ",
    authDomain: "thecoloursymphony.firebaseapp.com",
    projectId: "thecoloursymphony",
    storageBucket: "thecoloursymphony.firebasestorage.app",
    messagingSenderId: "1001319980140",
    appId: "1:1001319980140:web:97becfd137af89e06d8c49"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    });
});

// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const contentSections = document.querySelectorAll('.content-section');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active content section
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === tabId) {
                section.classList.add('active');
            }
        });
    });
});

// Website Settings Functionality
const websiteSettingsForm = document.getElementById('websiteSettingsForm');
const logoDropZone = document.getElementById('logoDropZone');
const logoInput = document.getElementById('logoInput');
const currentLogo = document.getElementById('currentLogo');

// Load existing settings
async function loadWebsiteSettings() {
    try {
        const doc = await db.collection('settings').doc('website').get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('websiteName').value = data.name || '';
            document.getElementById('tagline').value = data.tagline || '';
            document.getElementById('description').value = data.description || '';
            document.getElementById('primaryColor').value = data.primaryColor || '#000000';
            document.getElementById('secondaryColor').value = data.secondaryColor || '#ffffff';
            document.getElementById('accentColor').value = data.accentColor || '#28a745';
            document.getElementById('layoutStyle').value = data.layoutStyle || 'grid';
            document.getElementById('itemsPerPage').value = data.itemsPerPage || 12;
            document.getElementById('instagram').value = data.instagram || '';
            document.getElementById('facebook').value = data.facebook || '';
            document.getElementById('twitter').value = data.twitter || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('address').value = data.address || '';
            if (data.logoUrl) {
                currentLogo.src = data.logoUrl;
            }
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Logo upload handling
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    logoDropZone.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    logoDropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    logoDropZone.addEventListener(eventName, unhighlight, false);
});

logoDropZone.addEventListener('drop', handleLogoDrop, false);
logoDropZone.addEventListener('click', () => logoInput.click());
logoInput.addEventListener('change', handleLogoSelect);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    logoDropZone.classList.add('dragover');
}

function unhighlight(e) {
    logoDropZone.classList.remove('dragover');
}

function handleLogoDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleLogoFiles(files);
}

function handleLogoSelect(e) {
    const files = e.target.files;
    handleLogoFiles(files);
}

function handleLogoFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentLogo.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file');
        }
    }
}

// Save website settings
websiteSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const logoFile = logoInput.files[0];
        let logoUrl = currentLogo.src;

        if (logoFile) {
            const storageRef = storage.ref();
            const logoRef = storageRef.child(`settings/logo_${Date.now()}`);
            await logoRef.put(logoFile);
            logoUrl = await logoRef.getDownloadURL();
        }

        await db.collection('settings').doc('website').set({
            name: document.getElementById('websiteName').value,
            tagline: document.getElementById('tagline').value,
            description: document.getElementById('description').value,
            logoUrl: logoUrl,
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            accentColor: document.getElementById('accentColor').value,
            layoutStyle: document.getElementById('layoutStyle').value,
            itemsPerPage: parseInt(document.getElementById('itemsPerPage').value),
            instagram: document.getElementById('instagram').value,
            facebook: document.getElementById('facebook').value,
            twitter: document.getElementById('twitter').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Website settings saved successfully!');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
    }
});

// Artwork Management Functionality
const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

// Drag and drop functionality for artwork
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('dragover');
    }, false);
});

dropZone.addEventListener('drop', handleArtworkDrop, false);
dropZone.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', handleArtworkSelect);

function handleArtworkDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleArtworkFiles(files);
}

function handleArtworkSelect(e) {
    const files = e.target.files;
    handleArtworkFiles(files);
}

function handleArtworkFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <span class="remove-image" onclick="removeImage()">Remove Image</span>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file');
        }
    }
}

function removeImage() {
    imagePreview.innerHTML = '';
    imageInput.value = '';
}

// Form submission for artwork
document.getElementById('artworkForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const year = document.getElementById('year').value;
    const medium = document.getElementById('medium').value;
    const description = document.getElementById('description').value;
    const imageFile = imageInput.files[0];

    if (!imageFile) {
        alert('Please select an image');
        return;
    }

    try {
        // Upload image to Firebase Storage
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`artworks/${Date.now()}_${imageFile.name}`);
        await imageRef.put(imageFile);
        const imageUrl = await imageRef.getDownloadURL();

        // Save artwork data to Firestore
        await db.collection('artworks').add({
            title,
            artist,
            year,
            medium,
            description,
            imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Artwork added successfully!');
        e.target.reset();
        imagePreview.innerHTML = '';
        loadArtworks();
    } catch (error) {
        console.error('Error adding artwork:', error);
        alert('Error adding artwork. Please try again.');
    }
});

// Load existing artworks
async function loadArtworks() {
    const artworksList = document.getElementById('artworksList');
    artworksList.innerHTML = '';

    try {
        const snapshot = await db.collection('artworks')
            .orderBy('createdAt', 'desc')
            .get();

        snapshot.forEach(doc => {
            const artwork = doc.data();
            const artworkItem = document.createElement('div');
            artworkItem.className = 'artwork-item';
            artworkItem.innerHTML = `
                <img src="${artwork.imageUrl}" alt="${artwork.title}">
                <h3>${artwork.title}</h3>
                <p>${artwork.artist} (${artwork.year})</p>
                <p>${artwork.medium}</p>
                <button onclick="deleteArtwork('${doc.id}')" class="delete-btn">Delete</button>
            `;
            artworksList.appendChild(artworkItem);
        });
    } catch (error) {
        console.error('Error loading artworks:', error);
    }
}

// Delete artwork
async function deleteArtwork(id) {
    if (confirm('Are you sure you want to delete this artwork?')) {
        try {
            await db.collection('artworks').doc(id).delete();
            loadArtworks();
            alert('Artwork deleted successfully!');
        } catch (error) {
            console.error('Error deleting artwork:', error);
            alert('Error deleting artwork. Please try again.');
        }
    }
}

// Initialize
loadWebsiteSettings();
loadArtworks(); 