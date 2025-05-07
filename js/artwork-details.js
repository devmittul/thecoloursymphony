/**
 * Artwork Details Page JavaScript
 * Handles loading artwork data and interactions for the artwork details page
 */

document.addEventListener("DOMContentLoaded", function() {
    // Sample artwork data - in a real application this would come from a database/JSON file
    const artworksData = [
        {
            id: 1,
            title: "Ethereal Dreams",
            image: "images/painting1.jpg",
            medium: "Acrylic on Canvas",
            year: "2025",
            description: [
                "A vibrant exploration of dreamscapes and subconscious imagery. This piece invites viewers to lose themselves in layers of ethereal color and form.",
                "The artwork draws inspiration from the liminal space between wakefulness and sleep, where reality blends with imagination. Each brushstroke is deliberately placed to guide the viewer through a journey of self-discovery.",
                "With this piece, the artist challenges conventional perceptions of space and time, encouraging a more intuitive and emotional engagement with the visual elements."
            ],
            featured: true,
            tags: ["abstract", "vibrant", "dreamscape"]
        },
        {
            id: 2,
            title: "Serene Horizon",
            image: "images/painting2.jpg",
            medium: "Oil on Canvas",
            year: "2025",
            description: [
                "A contemplative landscape that explores the boundary between earth and sky, reality and imagination.",
                "The horizon line serves as both a visual anchor and a metaphorical threshold, inviting viewers to look beyond what is immediately visible.",
                "Colors shift subtly across the canvas, creating a sense of atmospheric depth and emotional resonance."
            ],
            featured: false,
            tags: ["landscape", "serene", "horizon"]
        },
        {
            id: 3,
            title: "Inner Light",
            image: "images/painting3.jpg",
            medium: "Mixed Media",
            year: "2025",
            description: [
                "An exploration of inner luminosity and spiritual awakening through multiple layers of texture and translucent color.",
                "This mixed media piece incorporates traditional painting techniques alongside experimental materials to create a sense of depth and revelation.",
                "The central glow emerges from darkness, symbolizing hope, knowledge, and the journey toward self-understanding."
            ],
            featured: true,
            tags: ["spiritual", "abstract", "luminous"]
        },
        {
            id: 4,
            title: "Cosmic Whispers",
            image: "images/painting4.jpg",
            medium: "Acrylic on Canvas",
            year: "2025",
            description: [
                "An abstract interpretation of cosmic forces and celestial movements, capturing the dance of galaxies and stellar phenomena.",
                "Swirling patterns and dynamic brushwork create a sense of movement and energy across the canvas.",
                "The color palette draws from deep space imagery while adding an emotional dimension that connects the cosmic to the human experience."
            ],
            featured: false,
            tags: ["cosmic", "abstract", "celestial"]
        },
        {
            id: 5,
            title: "Blooming Silence",
            image: "images/painting5.jpg",
            medium: "Watercolor",
            year: "2025",
            description: [
                "A delicate watercolor exploration of floral forms that emerge from negative space and washes of transparent color.",
                "The composition balances precise botanical elements with areas of ambiguity, creating a contemplative viewing experience.",
                "The work invites quiet reflection on the relationship between presence and absence in both art and life."
            ],
            featured: false,
            tags: ["floral", "watercolor", "minimalist"]
        },
        {
            id: 6,
            title: "Temporal Fragments",
            image: "images/painting6.jpg",
            medium: "Mixed Media Collage",
            year: "2025",
            description: [
                "A layered exploration of memory, time, and personal history through collaged elements and expressive mark-making.",
                "The fragmented composition reflects the non-linear nature of memory and the ways we construct narratives from pieces of experience.",
                "Textural elements add tactile dimension to the visual experience, grounding abstract concepts in material reality."
            ],
            featured: true,
            tags: ["collage", "memory", "fragmentary"]
        }
    ];

    // Get the artwork ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const artworkId = parseInt(urlParams.get('id')) || 1; // Default to first artwork if no ID provided
    
    // Find the artwork in our data
    const artwork = artworksData.find(item => item.id === artworkId) || artworksData[0];
    
    // Update page with artwork details
    loadArtworkDetails(artwork);
    
    // Generate related artworks (excluding current one)
    loadRelatedArtworks(artwork.id, artworksData);
    
    // Set up navigation buttons
    setupNavigationButtons(artwork.id, artworksData.length);
});

/**
 * Loads the details of the specified artwork onto the page
 * @param {Object} artwork - The artwork data object
 */
function loadArtworkDetails(artwork) {
    // Update document title
    document.title = `${artwork.title} - The Color Symphony`;
    
    // Update breadcrumb
    const breadcrumbTitle = document.getElementById('artwork-title-breadcrumb');
    if (breadcrumbTitle) breadcrumbTitle.textContent = artwork.title;
    
    // Update image
    const artworkImage = document.getElementById('artwork-image');
    if (artworkImage) {
        artworkImage.src = artwork.image;
        artworkImage.alt = artwork.title;
    }
    
    // Update title
    const artworkTitle = document.getElementById('artwork-title');
    if (artworkTitle) artworkTitle.textContent = artwork.title;
    
    // Update medium and year
    const artworkMedium = document.getElementById('artwork-medium');
    if (artworkMedium) artworkMedium.textContent = `${artwork.medium}, ${artwork.year}`;
    
    // Show/hide featured badge
    const artworkFeatured = document.getElementById('artwork-featured');
    if (artworkFeatured) {
        artworkFeatured.style.display = artwork.featured ? 'inline-flex' : 'none';
    }
    
    // Update description
    const artworkDescription = document.getElementById('artwork-description');
    if (artworkDescription) {
        // Clear existing content
        artworkDescription.innerHTML = '';
        
        // Add each paragraph
        artwork.description.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            artworkDescription.appendChild(p);
        });
    }
}

/**
 * Loads related artworks into the related artworks section
 * @param {number} currentId - The ID of the current artwork to exclude
 * @param {Array} allArtworks - Array of all artwork data objects
 */
function loadRelatedArtworks(currentId, allArtworks) {
    const relatedContainer = document.getElementById('related-artworks');
    if (!relatedContainer) return;
    
    // Clear existing content
    relatedContainer.innerHTML = '';
    
    // Filter out current artwork and get up to 4 related works
    const relatedWorks = allArtworks
        .filter(art => art.id !== currentId)
        .slice(0, 4);
    
    // Create and append cards for each related artwork
    relatedWorks.forEach((art, index) => {
        const card = document.createElement('div');
        card.className = 'related-artwork-card';
        card.style.animationDelay = `${0.1 * (index + 1)}s`;
        
        card.innerHTML = `
            <div class="related-artwork-image">
                <img src="${art.image}" alt="${art.title}">
            </div>
            <div class="related-artwork-details">
                <h3>${art.title}</h3>
                <p class="related-artwork-medium">${art.medium}, ${art.year}</p>
                <a href="artwork-details.html?id=${art.id}" class="view-btn">View Artwork</a>
            </div>
        `;
        
        relatedContainer.appendChild(card);
    });
}

/**
 * Sets up the previous and next navigation buttons
 * @param {number} currentId - The ID of the current artwork
 * @param {number} totalArtworks - Total number of artworks available
 */
function setupNavigationButtons(currentId, totalArtworks) {
    const prevBtn = document.getElementById('prev-artwork');
    const nextBtn = document.getElementById('next-artwork');
    
    if (!prevBtn || !nextBtn) return;
    
    // Disable prev button if we're at the first artwork
    prevBtn.disabled = currentId <= 1;
    
    // Disable next button if we're at the last artwork
    nextBtn.disabled = currentId >= totalArtworks;
    
    // Add click event listeners
    prevBtn.addEventListener('click', function() {
        if (currentId > 1) {
            window.location.href = `artwork-details.html?id=${currentId - 1}`;
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentId < totalArtworks) {
            window.location.href = `artwork-details.html?id=${currentId + 1}`;
        }
    });
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // Left arrow for previous
        if (e.key === 'ArrowLeft' && currentId > 1) {
            window.location.href = `artwork-details.html?id=${currentId - 1}`;
        }
        // Right arrow for next
        else if (e.key === 'ArrowRight' && currentId < totalArtworks) {
            window.location.href = `artwork-details.html?id=${currentId + 1}`;
        }
    });
} 