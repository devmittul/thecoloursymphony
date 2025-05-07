// Admin Login and Dashboard Functionality

// Global variables
let artworks = [];
let currentEditId = null;

// Firebase variables
let storageRef;
let firebaseStorage;

// Initialize Firebase if available
function initFirebase() {
    try {
        // Check if Firebase is loaded
        if (typeof firebase !== 'undefined') {
            // Initialize Firebase Storage reference
            firebaseStorage = firebase.storage();
            storageRef = firebaseStorage.ref();
            console.log('Firebase Storage initialized');
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// Check authentication state as soon as the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase components
    initFirebase();
    
    // Using local storage auth as fallback
    checkAuth();
    
    // Initialize sidebar navigation highlighting
    highlightCurrentPage();
    
    // Load artworks from localStorage
    loadArtworks();
    
    // Initialize add artwork form
    setupArtworkForm();
});

// Helper to highlight the current page in the navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    
    const navLinks = document.querySelectorAll('.admin-sidebar-menu a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === filename) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear localStorage
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

// Check if user is logged in (for protected pages)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // Don't check auth on login or index page
    if (currentPage === 'login.html' || currentPage === 'index.html') {
        return;
    }
    
    // If not logged in, redirect to login
    if (!isLoggedIn) {
        // Use session storage to prevent redirect loops
        const hasRedirected = sessionStorage.getItem('redirect_to_login');
        if (!hasRedirected) {
            sessionStorage.setItem('redirect_to_login', 'true');
            window.location.href = 'login.html';
        }
    } else {
        // Clear the redirect flag when successfully logged in
        sessionStorage.removeItem('redirect_to_login');
    }
}

// Mobile navigation toggle
const mobileToggleBtn = document.createElement('button');
mobileToggleBtn.className = 'mobile-toggle';
mobileToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';

const adminHeader = document.querySelector('.admin-header');
if (adminHeader) {
    adminHeader.prepend(mobileToggleBtn);
    
    mobileToggleBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('active');
    });
}

// Utility function to show alerts/notifications
function showAlert(message, type = 'info') {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `admin-alert ${type}`;
    alertElement.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close"><i class="fas fa-times"></i></button>
    `;
    
    // Append to body
    document.body.appendChild(alertElement);
    
    // Show with animation
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
    
    // Hide after timeout
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = alertElement.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    });
}

// Add CSS for alerts
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .admin-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease-out;
    }
    
    .admin-alert.show {
        transform: translateX(0);
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .alert-content i {
        font-size: 1.2rem;
    }
    
    .alert-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: #666;
    }
    
    .admin-alert.success {
        border-left: 4px solid #28a745;
    }
    
    .admin-alert.success i {
        color: #28a745;
    }
    
    .admin-alert.error {
        border-left: 4px solid #dc3545;
    }
    
    .admin-alert.error i {
        color: #dc3545;
    }
    
    .admin-alert.info {
        border-left: 4px solid #17a2b8;
    }
    
    .admin-alert.info i {
        color: #17a2b8;
    }
`;
document.head.appendChild(alertStyles);

// Function to set up the Add Artwork form
function setupArtworkForm() {
    const artworkForm = document.getElementById('editArtworkForm');
    const imageInputField = document.getElementById('artworkImage');
    const imageUploadContainer = document.getElementById('imageUploadContainer');
    
    if (!artworkForm || !imageInputField || !imageUploadContainer) return;
    
    // Create the image upload container
    imageUploadContainer.innerHTML = `
        <div class="drag-drop-area" id="dragDropArea">
            <div class="upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <div class="upload-text">
                <p>Tap to select image</p>
                <p>- or -</p>
                <p>Drag & drop image here</p>
            </div>
            <button type="button" class="mobile-upload-btn" id="uploadButton">
                <i class="fas fa-camera"></i> Select from Device
            </button>
            <input type="file" id="fileInput" accept="image/*" style="display: none;">
        </div>
        <div class="image-preview-container" id="imagePreviewContainer" style="display: none;">
            <img id="imagePreview" src="" alt="Image Preview">
            <div class="image-controls">
                <button type="button" class="admin-btn" id="removeImageBtn" style="margin-top: 10px; background-color: #dc3545;">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        </div>
        <p class="form-help">Upload your artwork image here.</p>
    `;
    
    // Set up the drag and drop functionality
    const dragDropArea = document.getElementById('dragDropArea');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    // Make the entire drop area clickable to select a file on mobile
    dragDropArea.addEventListener('click', function(e) {
        // Prevent click on the upload button from triggering this too
        if (e.target !== uploadButton && !uploadButton.contains(e.target)) {
            fileInput.click();
        }
    });
    
    // Handle tap on the upload button
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dragDropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dragDropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    dragDropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleFiles(files);
        }
    }
    
    // Handle files from file input
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });
    
    // Process the files
    function handleFiles(files) {
        const file = files[0]; // Just take the first file
        
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Show the image preview
                imagePreview.src = e.target.result;
                dragDropArea.style.display = 'none';
                imagePreviewContainer.style.display = 'block';
                
                if (firebaseStorage) {
                    // Store file in memory for later upload to Firebase
                    imagePreview.file = file;
                    // Set a temporary path (will be replaced when actually uploaded)
                    imageInputField.value = `uploading:${file.name}`;
                } else {
                    // Fallback for when Firebase isn't available
                    const fileName = `../images/${file.name}`;
                    imageInputField.value = fileName;
                }
            };
            
            reader.readAsDataURL(file);
        } else {
            showAlert('Please select an image file (JPG, PNG, etc).', 'error');
        }
    }
    
    // Remove image button
    removeImageBtn.addEventListener('click', function() {
        // Clear the preview
        imagePreview.src = '';
        imagePreviewContainer.style.display = 'none';
        dragDropArea.style.display = 'block';
        
        // Clear the input value
        imageInputField.value = '';
    });
    
    // Handle form submission
    artworkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate the form
        if (!validateArtworkForm()) {
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = {
            id: Date.now(), // Generate a unique ID
            title: document.getElementById('artworkTitle').value,
            medium: document.getElementById('artworkMedium').value,
            year: document.getElementById('artworkYear').value,
            description: document.getElementById('artworkDescription').value,
            creationDate: document.getElementById('artworkDate').value,
            image: document.getElementById('artworkImage').value,
            featured: document.getElementById('artworkFeatured').checked
        };
        
        // Function to save the artwork data
        const saveArtworkData = (imageUrl) => {
            // Update image URL if provided
            if (imageUrl) {
                formData.image = imageUrl;
            }
            
            // Load existing artworks
            let artworks = [];
            const storedArtworks = localStorage.getItem('artworks');
            
            if (storedArtworks) {
                artworks = JSON.parse(storedArtworks);
            }
            
            // Display image upload information
            const imageInfoElement = document.createElement('div');
            imageInfoElement.className = 'image-upload-info';
            imageInfoElement.innerHTML = `
                <h3><i class="fas fa-info-circle"></i> Image Upload Information</h3>
                <p>Your artwork metadata has been saved, but there are additional steps needed for the image:</p>
                <ol>
                    <li><strong>Current image path:</strong> ${formData.image}</li>
                    <li>Remember that images are NOT automatically uploaded to GitHub</li>
                    <li>You need to manually copy your image file to the "images" folder in your project</li>
                    <li>When exporting to GitHub, only the image path is stored, not the actual image file</li>
                </ol>
                <p>To fully deploy your artwork:</p>
                <ol>
                    <li>Save your image to the "images" folder</li>
                    <li>Use the "Export Data for GitHub" button on the Manage Artworks page</li>
                    <li>Upload both the JSON data and your image files to GitHub</li>
                </ol>
            `;
            
            // Insert after the form
            const formParent = artworkForm.parentNode;
            formParent.insertBefore(imageInfoElement, artworkForm.nextSibling);
            
            // Format for storage
            const newArtwork = {
                id: formData.id,
                title: formData.title,
                artist: "Admin User", // Default artist name
                year: formData.year,
                medium: formData.medium,
                dimensions: "", // Could add this to the form
                description: formData.description,
                price: 0, // Could add this to the form
                currency: "USD",
                inventory: {
                    originals: 1,
                    prints: 0,
                    available: true
                },
                categories: [],
                materials: [],
                featured: formData.featured,
                images: [
                    { path: formData.image, isPrimary: true }
                ],
                has360View: false,
                dateAdded: formData.creationDate || new Date().toISOString().split('T')[0]
            };
            
            // Add the new artwork to the local storage
            artworks.push(newArtwork);
            
            // Save artwork data using database utilities if available
            if (window.dbUtils) {
                window.dbUtils.saveArtworks(artworks);
                console.log('Artwork saved using database utilities');
            } else {
                // Fallback to localStorage only
                localStorage.setItem('artworks', JSON.stringify(artworks));
            }
            
            // Set timestamp to indicate update
            localStorage.setItem('artworksLastUpdated', Date.now().toString());
            
            // Set flag to indicate data needs publishing to GitHub
            localStorage.setItem('artworksNeedPublishing', 'true');
            
            // Dispatch custom event for any listeners
            if (typeof window.parent !== 'undefined') {
                const event = new CustomEvent('artworksUpdated');
                window.parent.document.dispatchEvent(event);
            }
            
            // Show success message
            showAlert('Artwork saved successfully! Remember to publish your changes and upload your image files.', 'success');
            
            // Reset form and UI
            artworkForm.reset();
            imagePreview.src = '';
            imagePreviewContainer.style.display = 'none';
            dragDropArea.style.display = 'block';
            imageInputField.value = '';
            
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Remove the image upload info after 60 seconds
            setTimeout(() => {
                if (imageInfoElement && imageInfoElement.parentNode) {
                    imageInfoElement.parentNode.removeChild(imageInfoElement);
                }
            }, 60000);
        };
        
        // If we're using Firebase and have an image to upload
        if (firebaseStorage && imagePreview.file) {
            // Upload to Firebase Storage
            try {
                const metadata = {
                    contentType: imagePreview.file.type
                };
                
                // Generate a unique filename
                const filename = `artwork_${formData.id}_${imagePreview.file.name}`;
                const artworkImagesRef = storageRef.child(`artworks/${filename}`);
                
                artworkImagesRef.put(imagePreview.file, metadata)
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(downloadURL => {
                        // Save artwork with Firebase Storage URL
                        saveArtworkData(downloadURL);
                    })
                    .catch(error => {
                        console.error('Firebase upload failed:', error);
                        // Save anyway with local path as fallback
                        showAlert('Could not upload to Firebase. Saving with local image path instead.', 'info');
                        const fallbackPath = `../images/${imagePreview.file.name}`;
                        saveArtworkData(fallbackPath);
                    });
            } catch (error) {
                console.error('Firebase error:', error);
                // Fallback to local save
                showAlert('Firebase error occurred. Saving with local image path instead.', 'info');
                const fallbackPath = `../images/${imagePreview.file.name}`;
                saveArtworkData(fallbackPath);
            }
        } else {
            // Fallback to local save without Firebase
            setTimeout(() => {
                saveArtworkData();
            }, 800);
        }
    });
    
    // Validate the form
    function validateArtworkForm() {
        const title = document.getElementById('artworkTitle').value;
        const medium = document.getElementById('artworkMedium').value;
        const year = document.getElementById('artworkYear').value;
        const description = document.getElementById('artworkDescription').value;
        const image = document.getElementById('artworkImage').value;
        
        if (!title || !medium || !year || !description) {
            showAlert('Please fill out all required fields.', 'error');
            return false;
        }
        
        if (!image) {
            showAlert('Please upload an image for the artwork.', 'error');
            return false;
        }
        
        return true;
    }
}

// Load artworks from localStorage
function loadArtworks() {
    // Try to load using database utilities if available
    if (window.dbUtils) {
        console.log('Using database utilities to load artworks');
        window.dbUtils.loadArtworks()
            .then(loadedArtworks => {
                artworks = loadedArtworks;
                console.log('Artworks loaded from database:', artworks.length);
            })
            .catch(error => {
                console.error('Error loading artworks from database:', error);
                // Fallback to localStorage
                fallbackToLocalStorage();
            });
    } else {
        // Fallback to the original localStorage method
        fallbackToLocalStorage();
    }
    
    // Helper function for localStorage fallback
    function fallbackToLocalStorage() {
        // Load from localStorage
        const storedArtworks = localStorage.getItem('artworks');
        
        if (storedArtworks) {
            artworks = JSON.parse(storedArtworks);
        } else {
            // Initialize with empty array if no artworks exist
            artworks = [];
            localStorage.setItem('artworks', JSON.stringify(artworks));
        }
    }
}

// Alias for showAlert
function showNotification(message, type = 'info') {
    showAlert(message, type);
}

// Add this CSS to style the image upload info box
const imageUploadInfoStyles = document.createElement('style');
imageUploadInfoStyles.textContent = `
    .image-upload-info {
        margin: 20px 0;
        padding: 15px;
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        border-radius: 4px;
    }
    
    .image-upload-info h3 {
        margin-top: 0;
        color: #856404;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .image-upload-info p {
        margin: 10px 0;
        color: #333;
    }
    
    .image-upload-info ol {
        margin: 10px 0;
        padding-left: 20px;
    }
    
    .image-upload-info li {
        margin-bottom: 5px;
    }
    
    .image-upload-info strong {
        font-weight: 500;
    }
`;
document.head.appendChild(imageUploadInfoStyles); 