// All Artworks Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Artwork data array (in a real app, this would be fetched from a database)
    let artworks = [
        {
            id: 1,
            title: "Abstract Dreams",
            artist: "Emma Johnson",
            medium: "Oil on Canvas",
            dimensions: "36 x 48 inches",
            price: 2800,
            year: 2023,
            image: "images/artwork1.jpg",
            description: "A vibrant exploration of color and emotion through abstract forms."
        },
        {
            id: 2,
            title: "Serenity by the Lake",
            artist: "Michael Chen",
            medium: "Watercolor",
            dimensions: "18 x 24 inches",
            price: 1200,
            year: 2023,
            image: "images/artwork2.jpg",
            description: "A peaceful landscape capturing the tranquility of dawn over a misty lake."
        },
        {
            id: 3,
            title: "Urban Reflections",
            artist: "Sophia Williams",
            medium: "Acrylic",
            dimensions: "30 x 40 inches",
            price: 1800,
            year: 2022,
            image: "images/artwork3.jpg",
            description: "A contemporary cityscape exploring the interplay of light and architecture."
        },
        {
            id: 4,
            title: "Ephemeral Bloom",
            artist: "David Rodriguez",
            medium: "Mixed Media",
            dimensions: "24 x 36 inches",
            price: 2200,
            year: 2023,
            image: "images/artwork4.jpg",
            description: "An exploration of nature's transient beauty through layers of mixed media."
        },
        {
            id: 5,
            title: "Mystic Mountains",
            artist: "Olivia Kim",
            medium: "Oil on Canvas",
            dimensions: "40 x 60 inches",
            price: 3500,
            year: 2022,
            image: "images/artwork5.jpg",
            description: "A dramatic mountain landscape shrouded in mist and mystery."
        },
        {
            id: 6,
            title: "Harmony in Blue",
            artist: "James Wilson",
            medium: "Digital Art",
            dimensions: "Print: 24 x 36 inches",
            price: 950,
            year: 2023,
            image: "images/artwork6.jpg",
            description: "A digital composition exploring tonal variations of blue in abstract forms."
        },
        {
            id: 7,
            title: "Whispering Pines",
            artist: "Elena Gonzalez",
            medium: "Watercolor",
            dimensions: "16 x 20 inches",
            price: 1100,
            year: 2022,
            image: "images/artwork7.jpg",
            description: "A delicate watercolor capturing the quiet beauty of a pine forest at dusk."
        },
        {
            id: 8,
            title: "Geometric Revelations",
            artist: "Marcus Lee",
            medium: "Acrylic",
            dimensions: "32 x 32 inches",
            price: 1600,
            year: 2023,
            image: "images/artwork8.jpg",
            description: "Bold geometric patterns create dynamic visual rhythms in this contemporary piece."
        },
        {
            id: 9,
            title: "Coastal Dreams",
            artist: "Hannah Taylor",
            medium: "Oil on Canvas",
            dimensions: "24 x 48 inches",
            price: 2400,
            year: 2021,
            image: "images/artwork9.jpg",
            description: "A panoramic seascape capturing the timeless dialogue between land and ocean."
        },
        {
            id: 10,
            title: "Fragments of Memory",
            artist: "Benjamin Adams",
            medium: "Mixed Media",
            dimensions: "36 x 36 inches",
            price: 2100,
            year: 2023,
            image: "images/artwork10.jpg",
            description: "A collage-based exploration of memory, time, and perception."
        },
        {
            id: 11,
            title: "Dancing Light",
            artist: "Leila Hassan",
            medium: "Oil on Canvas",
            dimensions: "30 x 40 inches",
            price: 2600,
            year: 2022,
            image: "images/artwork11.jpg",
            description: "An impressionistic study of light dancing through a forest canopy."
        },
        {
            id: 12,
            title: "Urban Solitude",
            artist: "Thomas Wright",
            medium: "Photography",
            dimensions: "Print: 20 x 30 inches",
            price: 850,
            year: 2023,
            image: "images/artwork12.jpg",
            description: "A striking black and white photograph capturing moments of solitude in the urban landscape."
        },
        {
            id: 13,
            title: "Autumn Rhapsody",
            artist: "Emma Johnson",
            medium: "Watercolor",
            dimensions: "18 x 24 inches",
            price: 1250,
            year: 2022,
            image: "images/artwork13.jpg",
            description: "A celebration of autumn's vibrant palette through expressive watercolor techniques."
        },
        {
            id: 14,
            title: "Metal Dreams",
            artist: "Carlos Mendez",
            medium: "Sculpture",
            dimensions: "18 x 12 x 10 inches",
            price: 3200,
            year: 2023,
            image: "images/artwork14.jpg",
            description: "A contemporary metal sculpture exploring themes of industrialization and nature."
        },
        {
            id: 15,
            title: "Celestial Whispers",
            artist: "Sophia Williams",
            medium: "Digital Art",
            dimensions: "Print: 30 x 40 inches",
            price: 980,
            year: 2023,
            image: "images/artwork15.jpg",
            description: "A digital artwork inspired by cosmic phenomena and celestial bodies."
        },
        {
            id: 16,
            title: "Vibrant Cityscape",
            artist: "Michael Chen",
            medium: "Acrylic",
            dimensions: "36 x 48 inches",
            price: 2300,
            year: 2021,
            image: "images/artwork16.jpg",
            description: "A colorful and energetic interpretation of city life with bold brushwork."
        },
        {
            id: 17,
            title: "Peaceful Pond",
            artist: "Olivia Kim",
            medium: "Oil on Canvas",
            dimensions: "24 x 36 inches",
            price: 1900,
            year: 2022,
            image: "images/artwork17.jpg",
            description: "A serene landscape painting capturing the quiet beauty of a woodland pond."
        },
        {
            id: 18,
            title: "Textural Studies",
            artist: "David Rodriguez",
            medium: "Mixed Media",
            dimensions: "24 x 24 inches",
            price: 1500,
            year: 2023,
            image: "images/artwork18.jpg",
            description: "An exploration of texture and materiality through innovative mixed media techniques."
        }
    ];

    // DOM Elements
    const artworksContainer = document.querySelector('.all-artworks-container');
    const sortSelect = document.getElementById('sort-select');
    const mediumFilter = document.getElementById('medium-filter');
    const pagination = document.querySelector('.pagination');
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // State variables
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredArtworks = [...artworks];
    let sortOrder = 'newest';
    let selectedMedium = 'all';

    // Initialize the page
    initializePage();

    // Initialize page with artworks
    function initializePage() {
        populateMediumFilter();
        setupEventListeners();
        updateArtworks();
    }

    // Populate medium filter with unique options from artwork data
    function populateMediumFilter() {
        const mediums = ['all', ...new Set(artworks.map(artwork => artwork.medium))];
        
        mediums.forEach(medium => {
            const option = document.createElement('option');
            option.value = medium.toLowerCase();
            option.textContent = medium === 'all' ? 'All Mediums' : medium;
            mediumFilter.appendChild(option);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        sortSelect.addEventListener('change', handleSortChange);
        mediumFilter.addEventListener('change', handleMediumFilterChange);
        prevBtn.addEventListener('click', goToPreviousPage);
        nextBtn.addEventListener('click', goToNextPage);
    }

    // Handle sort change
    function handleSortChange(e) {
        sortOrder = e.target.value;
        currentPage = 1;
        updateArtworks();
    }

    // Handle medium filter change
    function handleMediumFilterChange(e) {
        selectedMedium = e.target.value;
        currentPage = 1;
        updateArtworks();
    }

    // Filter and sort artworks based on current selection
    function filterAndSortArtworks() {
        // Filter by medium
        filteredArtworks = artworks.filter(artwork => {
            if (selectedMedium === 'all') return true;
            return artwork.medium.toLowerCase() === selectedMedium;
        });

        // Sort artworks
        filteredArtworks.sort((a, b) => {
            switch(sortOrder) {
                case 'newest':
                    return b.year - a.year;
                case 'oldest':
                    return a.year - b.year;
                case 'price-high':
                    return b.price - a.price;
                case 'price-low':
                    return a.price - b.price;
                case 'title-az':
                    return a.title.localeCompare(b.title);
                case 'title-za':
                    return b.title.localeCompare(a.title);
                default:
                    return b.year - a.year;
            }
        });

        return filteredArtworks;
    }

    // Update displayed artworks
    function updateArtworks() {
        filterAndSortArtworks();
        displayArtworks();
        updatePagination();
    }

    // Display artworks for current page
    function displayArtworks() {
        // Clear current artworks
        artworksContainer.innerHTML = '';

        if (filteredArtworks.length === 0) {
            displayNoResults();
            return;
        }

        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredArtworks.length);
        
        // Create artwork cards for current page
        for (let i = startIndex; i < endIndex; i++) {
            const artwork = filteredArtworks[i];
            const artworkCard = createArtworkCard(artwork);
            artworksContainer.appendChild(artworkCard);
        }
    }

    // Create artwork card element
    function createArtworkCard(artwork) {
        const artworkCard = document.createElement('div');
        artworkCard.classList.add('artwork-card');
        
        artworkCard.innerHTML = `
            <div class="artwork-img">
                <img src="${artwork.image}" alt="${artwork.title}" loading="lazy">
            </div>
            <div class="artwork-info">
                <h3>${artwork.title}</h3>
                <p class="artist">${artwork.artist}</p>
                <p class="medium">${artwork.medium}, ${artwork.year}</p>
                <p class="dimensions">${artwork.dimensions}</p>
                <p class="price">$${artwork.price.toLocaleString()}</p>
                <div class="artwork-actions">
                    <a href="#" class="btn-view-details">View Details</a>
                    <a href="#" class="btn-inquire">Inquire</a>
                </div>
            </div>
        `;
        
        return artworkCard;
    }

    // Display no results message
    function displayNoResults() {
        artworksContainer.innerHTML = `
            <div class="no-results">
                <h3>No artworks found</h3>
                <p>Try adjusting your filters to find more artworks.</p>
                <button class="btn-primary reset-filters">Reset Filters</button>
            </div>
        `;
        
        document.querySelector('.reset-filters').addEventListener('click', resetFilters);
    }

    // Reset all filters
    function resetFilters() {
        sortSelect.value = 'newest';
        mediumFilter.value = 'all';
        sortOrder = 'newest';
        selectedMedium = 'all';
        currentPage = 1;
        updateArtworks();
    }

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
        
        // Hide pagination if no results or only one page
        if (filteredArtworks.length === 0 || totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        } else {
            pagination.style.display = 'flex';
        }
        
        // Update page numbers
        updatePageNumbers(totalPages);
        
        // Update previous and next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Update page number buttons
    function updatePageNumbers(totalPages) {
        pageNumbers.innerHTML = '';
        
        // Determine range of page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust if not showing enough pages at the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-number');
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageBtn);
        }
    }

    // Go to specific page
    function goToPage(page) {
        currentPage = page;
        updateArtworks();
        scrollToTop();
    }

    // Go to previous page
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updateArtworks();
            scrollToTop();
        }
    }

    // Go to next page
    function goToNextPage() {
        const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateArtworks();
            scrollToTop();
        }
    }

    // Scroll to top of artwork section
    function scrollToTop() {
        document.querySelector('.all-artworks').scrollIntoView({ behavior: 'smooth' });
    }
}); 