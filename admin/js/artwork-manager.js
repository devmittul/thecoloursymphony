/**
 * Advanced Artwork Management System
 * Provides multi-select, batch operations, and enhanced metadata management
 */

// Store selected artwork IDs
let selectedArtworks = new Set();
let allArtworks = [];
let filteredArtworks = [];
let categories = ['Abstract', 'Landscape', 'Portrait', 'Still Life', 'Sculpture', 'Photography', 'Mixed Media'];
let currentPage = 1;
let itemsPerPage = 10;

// Initialize the artwork manager
function initArtworkManager() {
    loadArtworks();
    setupEventListeners();
    setupDragDropUploader();
    updateBatchActionButtons();
}

// Load artworks from localStorage or API
function loadArtworks() {
    // For demo, we'll use localStorage, but in production, this would be an API call
    const storedArtworks = localStorage.getItem('artworks');
    
    if (storedArtworks) {
        allArtworks = JSON.parse(storedArtworks);
    } else {
        // Sample data
        allArtworks = [
            {
                id: 1,
                title: "Ethereal Dreams",
                artist: "Jane Doe",
                year: "2025",
                medium: "Oil on Canvas",
                dimensions: "24 x 36 inches",
                description: "An abstract representation of dreams and consciousness.",
                price: 1200,
                currency: "USD",
                inventory: {
                    originals: 1,
                    prints: 25,
                    available: true
                },
                categories: ["Abstract", "Contemporary"],
                materials: ["Oil Paint", "Canvas"],
                featured: true,
                images: [
                    { path: "../images/artwork1.jpg", isPrimary: true },
                    { path: "../images/artwork1_detail.jpg", isPrimary: false }
                ],
                has360View: false,
                dateAdded: "2025-02-01",
                customFields: {
                    exhibition: "Spring Collection 2025",
                    framingOptions: "White, Black, Natural Wood"
                }
            },
            {
                id: 2,
                title: "Mountain Serenity",
                artist: "John Smith",
                year: "2024",
                medium: "Acrylic on Canvas",
                dimensions: "30 x 40 inches",
                description: "A peaceful mountain landscape at sunset.",
                price: 950,
                currency: "USD",
                inventory: {
                    originals: 1,
                    prints: 50,
                    available: true
                },
                categories: ["Landscape", "Realism"],
                materials: ["Acrylic Paint", "Canvas"],
                featured: false,
                images: [
                    { path: "../images/artwork2.jpg", isPrimary: true }
                ],
                has360View: false,
                dateAdded: "2024-11-15",
                customFields: {
                    inspiration: "Rocky Mountains",
                    lightfastRating: "Excellent"
                }
            }
        ];
        saveArtworks();
    }
    
    // Initialize the filtered artworks
    filteredArtworks = [...allArtworks];
    
    // Render the artworks
    renderArtworks();
    updateCategoryFilters();
}

// Save artworks to localStorage
function saveArtworks() {
    localStorage.setItem('artworks', JSON.stringify(allArtworks));
}

// Render artworks to the page
function renderArtworks() {
    const tableBody = document.getElementById('artworkTableBody');
    if (!tableBody) return;
    
    // Clear the table
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedArtworks = filteredArtworks.slice(startIndex, endIndex);
    
    // Add rows for each artwork
    paginatedArtworks.forEach(artwork => {
        const row = document.createElement('tr');
        const isSelected = selectedArtworks.has(artwork.id);
        
        if (isSelected) {
            row.classList.add('selected');
        }
        
        row.innerHTML = `
            <td class="checkbox-col">
                <input type="checkbox" class="artwork-select" data-id="${artwork.id}" 
                    ${isSelected ? 'checked' : ''} aria-label="Select ${artwork.title}">
            </td>
            <td class="thumbnail-col">
                <img src="${artwork.images[0].path}" alt="${artwork.title}" class="artwork-thumbnail">
                ${artwork.images.length > 1 ? `<span class="multi-images-badge" title="${artwork.images.length} images available">${artwork.images.length}</span>` : ''}
                ${artwork.has360View ? '<span class="view-360-badge" title="360° view available"><i class="fas fa-sync-alt"></i></span>' : ''}
            </td>
            <td>
                <div class="artwork-title">${artwork.title}</div>
                <div class="artwork-artist">${artwork.artist}</div>
            </td>
            <td>
                <div>${artwork.medium}</div>
                <div class="artwork-year">${artwork.year}</div>
                <div class="artwork-dimensions">${artwork.dimensions}</div>
            </td>
            <td>
                <div class="price-display">${artwork.currency} ${artwork.price}</div>
                <div class="inventory-display">
                    <span class="inventory-badge ${artwork.inventory.available ? 'in-stock' : 'out-of-stock'}">
                        ${artwork.inventory.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </td>
            <td>
                <div class="category-tags">
                    ${artwork.categories.map(category => 
                        `<span class="category-tag">${category}</span>`
                    ).join('')}
                </div>
            </td>
            <td>
                <div class="feature-toggle">
                    <label class="switch">
                        <input type="checkbox" class="feature-checkbox" data-id="${artwork.id}" 
                            ${artwork.featured ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit-artwork" data-id="${artwork.id}" aria-label="Edit ${artwork.title}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon view-artwork" data-id="${artwork.id}" aria-label="View ${artwork.title}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon delete-artwork" data-id="${artwork.id}" aria-label="Delete ${artwork.title}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update pagination
    updatePagination();
    
    // Attach event listeners to checkboxes and buttons
    attachRowEventListeners();
}

// Setup event listeners for the page
function setupEventListeners() {
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllArtworks');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const checkboxes = document.querySelectorAll('.artwork-select');
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const artworkId = parseInt(checkbox.dataset.id);
                
                if (isChecked) {
                    selectedArtworks.add(artworkId);
                } else {
                    selectedArtworks.delete(artworkId);
                }
            });
            
            updateBatchActionButtons();
            highlightSelectedRows();
        });
    }
    
    // Batch action buttons
    document.getElementById('batchFeature')?.addEventListener('click', batchFeature);
    document.getElementById('batchUnfeature')?.addEventListener('click', batchUnfeature);
    document.getElementById('batchCategorize')?.addEventListener('click', showBatchCategorizeModal);
    document.getElementById('batchDelete')?.addEventListener('click', showBatchDeleteModal);
    
    // Search and filters
    document.getElementById('artworkSearch')?.addEventListener('input', applyFilters);
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    document.getElementById('yearFilter')?.addEventListener('change', applyFilters);
    document.getElementById('featuredFilter')?.addEventListener('change', applyFilters);
    
    // Pagination
    document.getElementById('prevPage')?.addEventListener('click', goToPrevPage);
    document.getElementById('nextPage')?.addEventListener('click', goToNextPage);
    
    // Modal close buttons
    document.querySelectorAll('.close-modal, .cancel-btn').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Batch categorize confirm button
    document.getElementById('confirmCategorize')?.addEventListener('click', batchCategorize);
    
    // Batch delete confirm button
    document.getElementById('confirmBatchDelete')?.addEventListener('click', batchDelete);
}

// Attach event listeners to table rows
function attachRowEventListeners() {
    // Checkbox selection
    document.querySelectorAll('.artwork-select').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const artworkId = parseInt(this.dataset.id);
            
            if (this.checked) {
                selectedArtworks.add(artworkId);
            } else {
                selectedArtworks.delete(artworkId);
            }
            
            updateBatchActionButtons();
            highlightSelectedRows();
        });
    });
    
    // Feature toggles
    document.querySelectorAll('.feature-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const artworkId = parseInt(this.dataset.id);
            const artwork = allArtworks.find(a => a.id === artworkId);
            
            if (artwork) {
                artwork.featured = this.checked;
                saveArtworks();
            }
        });
    });
    
    // Action buttons
    document.querySelectorAll('.edit-artwork').forEach(button => {
        button.addEventListener('click', function() {
            const artworkId = parseInt(this.dataset.id);
            editArtwork(artworkId);
        });
    });
    
    document.querySelectorAll('.view-artwork').forEach(button => {
        button.addEventListener('click', function() {
            const artworkId = parseInt(this.dataset.id);
            viewArtwork(artworkId);
        });
    });
    
    document.querySelectorAll('.delete-artwork').forEach(button => {
        button.addEventListener('click', function() {
            const artworkId = parseInt(this.dataset.id);
            showSingleDeleteModal(artworkId);
        });
    });
}

// Highlight selected rows
function highlightSelectedRows() {
    const rows = document.querySelectorAll('#artworkTableBody tr');
    
    rows.forEach(row => {
        const checkbox = row.querySelector('.artwork-select');
        if (checkbox) {
            const artworkId = parseInt(checkbox.dataset.id);
            
            if (selectedArtworks.has(artworkId)) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        }
    });
}

// Update batch action buttons based on selection
function updateBatchActionButtons() {
    const count = selectedArtworks.size;
    const batchButtons = document.querySelectorAll('.batch-action');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedCount) {
        selectedCount.textContent = `${count} item${count !== 1 ? 's' : ''} selected`;
    }
    
    batchButtons.forEach(button => {
        button.disabled = count === 0;
    });
}

// Update the pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    
    if (!paginationElement) return;
    
    // Clear pagination
    paginationElement.innerHTML = '';
    
    // Previous page button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
    prevButton.className = 'pagination-button';
    prevButton.id = 'prevPage';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', goToPrevPage);
    paginationElement.appendChild(prevButton);
    
    // Page numbers
    const pageNumbersContainer = document.createElement('div');
    pageNumbersContainer.className = 'page-numbers';
    
    // Determine which page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4 && totalPages > 5) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-number';
        
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        
        pageButton.addEventListener('click', () => goToPage(i));
        pageNumbersContainer.appendChild(pageButton);
    }
    
    paginationElement.appendChild(pageNumbersContainer);
    
    // Next page button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextButton.className = 'pagination-button';
    nextButton.id = 'nextPage';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', goToNextPage);
    paginationElement.appendChild(nextButton);
}

// Go to previous page
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderArtworks();
    }
}

// Go to next page
function goToNextPage() {
    const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        renderArtworks();
    }
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderArtworks();
}

// Setup drag and drop file uploader
function setupDragDropUploader() {
    const dropZone = document.getElementById('imageDropZone');
    const fileInput = document.getElementById('imageUpload');
    const previewContainer = document.getElementById('imagePreviewContainer');
    
    if (!dropZone || !fileInput || !previewContainer) return;
    
    // Highlight drop zone on drag over
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    // Remove highlight on drag leave
    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('dragover');
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Handle click to select files
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Handle selected files
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });
    
    // Handle the selected files
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Check if file is an image
            if (!file.type.match('image.*')) continue;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <div class="preview-controls">
                        <button type="button" class="preview-control-btn crop-btn" title="Crop Image">
                            <i class="fas fa-crop-alt"></i>
                        </button>
                        <button type="button" class="preview-control-btn primary-btn" title="Set as Primary Image">
                            <i class="fas fa-star"></i>
                        </button>
                        <button type="button" class="preview-control-btn remove-btn" title="Remove Image">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="is-primary-badge">Primary</div>
                `;
                
                // Add to preview container
                previewContainer.appendChild(previewItem);
                
                // Attach event listeners for preview controls
                const removeBtn = previewItem.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    previewItem.remove();
                });
                
                const primaryBtn = previewItem.querySelector('.primary-btn');
                primaryBtn.addEventListener('click', function() {
                    // Remove primary from all others
                    document.querySelectorAll('.image-preview-item').forEach(item => {
                        item.classList.remove('is-primary');
                    });
                    
                    // Set this as primary
                    previewItem.classList.add('is-primary');
                });
                
                const cropBtn = previewItem.querySelector('.crop-btn');
                cropBtn.addEventListener('click', function() {
                    // Show crop interface (simplified for this example)
                    alert('Crop functionality would be implemented here');
                });
            };
            
            reader.readAsDataURL(file);
        }
    }
}

// Apply filters to artworks
function applyFilters() {
    const searchTerm = document.getElementById('artworkSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const yearFilter = document.getElementById('yearFilter')?.value || '';
    const featuredFilter = document.getElementById('featuredFilter')?.value || '';
    
    filteredArtworks = allArtworks.filter(artwork => {
        // Search term filter
        const matchesSearch = 
            artwork.title.toLowerCase().includes(searchTerm) ||
            artwork.artist.toLowerCase().includes(searchTerm) ||
            artwork.medium.toLowerCase().includes(searchTerm) ||
            artwork.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = !categoryFilter || 
            artwork.categories.some(category => category.toLowerCase() === categoryFilter.toLowerCase());
        
        // Year filter
        const matchesYear = !yearFilter || artwork.year === yearFilter;
        
        // Featured filter
        const matchesFeatured = 
            featuredFilter === '' || 
            (featuredFilter === 'featured' && artwork.featured) || 
            (featuredFilter === 'not-featured' && !artwork.featured);
        
        return matchesSearch && matchesCategory && matchesYear && matchesFeatured;
    });
    
    // Reset to first page and render
    currentPage = 1;
    renderArtworks();
}

// Update category filter options based on available categories
function updateCategoryFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Get all unique categories
    const uniqueCategories = new Set();
    
    allArtworks.forEach(artwork => {
        artwork.categories.forEach(category => {
            uniqueCategories.add(category);
        });
    });
    
    // Clear existing options except for the empty option
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add options for each unique category
    Array.from(uniqueCategories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Edit artwork
function editArtwork(artworkId) {
    const artwork = allArtworks.find(a => a.id === artworkId);
    if (!artwork) return;
    
    // In a real application, you would redirect to an edit page or show a modal
    // For this example, we'll just alert
    alert(`Edit Artwork: ${artwork.title}`);
}

// View artwork details
function viewArtwork(artworkId) {
    const artwork = allArtworks.find(a => a.id === artworkId);
    if (!artwork) return;
    
    // In a real application, you would show a modal or navigate to a details page
    // For this example, we'll just alert
    alert(`View Artwork: ${artwork.title}`);
}

// Show modal to confirm single artwork deletion
function showSingleDeleteModal(artworkId) {
    selectedArtworks.clear();
    selectedArtworks.add(artworkId);
    showBatchDeleteModal();
}

// Show batch delete confirmation modal
function showBatchDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const deleteItemsList = document.getElementById('deleteItemsList');
    
    if (!deleteModal || !deleteItemsList) return;
    
    // Clear the list
    deleteItemsList.innerHTML = '';
    
    // Add items to the list
    const selectedArtworksList = allArtworks.filter(artwork => selectedArtworks.has(artwork.id));
    
    selectedArtworksList.forEach(artwork => {
        const listItem = document.createElement('li');
        listItem.textContent = artwork.title;
        deleteItemsList.appendChild(listItem);
    });
    
    // Show the modal
    deleteModal.classList.add('show');
}

// Show batch categorize modal
function showBatchCategorizeModal() {
    const categorizeModal = document.getElementById('categorizeModal');
    const categorySelect = document.getElementById('batchCategorySelect');
    
    if (!categorizeModal || !categorySelect) return;
    
    // Clear existing options
    categorySelect.innerHTML = '';
    
    // Add options for each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Show the modal
    categorizeModal.classList.add('show');
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Batch feature artworks
function batchFeature() {
    updateFeatureStatus(true);
}

// Batch unfeature artworks
function batchUnfeature() {
    updateFeatureStatus(false);
}

// Update featured status for selected artworks
function updateFeatureStatus(featured) {
    allArtworks.forEach(artwork => {
        if (selectedArtworks.has(artwork.id)) {
            artwork.featured = featured;
        }
    });
    
    saveArtworks();
    renderArtworks();
}

// Batch categorize artworks
function batchCategorize() {
    const categorySelect = document.getElementById('batchCategorySelect');
    const actionType = document.querySelector('input[name="categoryAction"]:checked')?.value;
    
    if (!categorySelect || !actionType) return;
    
    const selectedCategory = categorySelect.value;
    
    allArtworks.forEach(artwork => {
        if (selectedArtworks.has(artwork.id)) {
            if (actionType === 'add') {
                // Add category if it doesn't exist
                if (!artwork.categories.includes(selectedCategory)) {
                    artwork.categories.push(selectedCategory);
                }
            } else if (actionType === 'replace') {
                // Replace all categories
                artwork.categories = [selectedCategory];
            } else if (actionType === 'remove') {
                // Remove the category
                artwork.categories = artwork.categories.filter(category => category !== selectedCategory);
            }
        }
    });
    
    saveArtworks();
    closeAllModals();
    renderArtworks();
    updateCategoryFilters();
}

// Batch delete artworks
function batchDelete() {
    allArtworks = allArtworks.filter(artwork => !selectedArtworks.has(artwork.id));
    
    saveArtworks();
    selectedArtworks.clear();
    closeAllModals();
    renderArtworks();
    updateBatchActionButtons();
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initArtworkManager); 