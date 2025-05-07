// Custom Cursor
const cursor = document.querySelector('.cursor');
const header = document.querySelector('header');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Hide cursor when it leaves the window
document.addEventListener('mouseout', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseover', () => {
    cursor.style.opacity = '0.7';
});

// Interactive elements cursor effect
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .gallery-item');

interactiveElements.forEach(el => {
    el.addEventListener('mouseover', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.border = '1px solid white';
        cursor.style.backgroundColor = 'rgba(156, 109, 255, 0.2)';
    });
    el.addEventListener('mouseout', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.border = '2px solid var(--accent-color)';
        cursor.style.backgroundColor = 'transparent';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for the fixed header
                behavior: 'smooth'
            });
            
            // Update active navigation link
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Update active navigation link on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href') === '#' + sectionId) {
                    navLink.classList.add('active');
                }
            });
        }
    });
});

// Gallery item hover effect
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        // Here you would typically send the email to a server
        console.log('Newsletter subscription for:', email);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for subscribing to our newsletter!';
        
        this.reset();
        this.parentNode.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    });
}

// Animations on scroll
const animateOnScroll = () => {
    // Elements to animate: .gallery-card, .about-image, .about-text p, .section-title
    const sections = document.querySelectorAll('.gallery, .about, .featured-quote, footer');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('in-view');
        }
    });
    
    // Animate individual elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.animate), .fade-in:not(.animate), .view-all:not(.animate)');
    animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
            el.classList.add('animate');
            
            // For gallery cards, add staggered animation
            if (el.classList.contains('gallery-card')) {
                const cards = document.querySelectorAll('.gallery-card.animate');
                
                cards.forEach((card, index) => {
                    card.style.transitionDelay = `${0.1 * (index % 6)}s`;
                });
            }
        }
    });
};

// Add animate-on-scroll class to elements that should animate
document.querySelectorAll('.gallery-card, .about-image, .about-text p, .section-title, .view-all, footer .footer-content > *').forEach(el => {
    el.classList.add('animate-on-scroll');
});

// Call animateOnScroll on page load and scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', () => {
    // Small delay to ensure everything is loaded
    setTimeout(animateOnScroll, 300);
    
    // Load and display artworks from localStorage
    loadAndDisplayArtworks();
});

// Image loading animation
const artworkImages = document.querySelectorAll('.artwork img');
artworkImages.forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Load and display artworks from the admin panel
function loadAndDisplayArtworks() {
    const artworksContainer = document.querySelector('.gallery-container');
    if (!artworksContainer) return;

    // Load artworks from localStorage
    let artworks = [];
    const storedArtworks = localStorage.getItem('artworks');
    
    if (storedArtworks) {
        try {
            artworks = JSON.parse(storedArtworks);
        } catch (error) {
            console.error("Error parsing artworks:", error);
        }
    }
    
    // Create sample artworks if none exist
    if (artworks.length === 0) {
        const sampleArtworks = [
            {
                id: 1,
                title: "Sunrise over Mountains",
                artist: "Emily Johnson",
                year: "2022",
                medium: "Oil on Canvas",
                dimensions: "24 x 36 inches",
                description: "A vibrant depiction of sunrise illuminating a mountain range.",
                featured: true,
                images: [
                    { path: "images/painting1.jpg", isPrimary: true }
                ]
            },
            {
                id: 2,
                title: "Ocean Waves at Sunset",
                artist: "Michael Chen",
                year: "2023",
                medium: "Acrylic",
                dimensions: "18 x 24 inches",
                description: "Powerful ocean waves crashing against rocks at sunset.",
                featured: false,
                images: [
                    { path: "images/painting2.jpg", isPrimary: true }
                ]
            }
        ];
        
        // Save sample artworks to localStorage
        localStorage.setItem('artworks', JSON.stringify(sampleArtworks));
        artworks = sampleArtworks;
    }
    
    // Clear container first
    artworksContainer.innerHTML = '';
    
    // Sort artworks - featured first, then by date
    artworks.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    });
    
    // Display artworks
    artworks.forEach(artwork => {
        // Create artwork element
        const artworkElement = document.createElement('div');
        artworkElement.className = 'gallery-item fade-in';
        
        // Get image path, ensuring it works for both admin and main site paths
        let imagePath = '';
        if (artwork.images && artwork.images.length > 0) {
            imagePath = artwork.images[0].path;
            
            // Handle paths that might have been set in admin panel
            if (imagePath.startsWith('../images/')) {
                imagePath = imagePath.replace('../images/', 'images/');
            } else if (!imagePath.includes('/')) {
                imagePath = 'images/' + imagePath;
            }
        } else {
            imagePath = 'images/placeholder.jpg';
        }
        
        // Create HTML content
        artworkElement.innerHTML = `
            <div class="gallery-image">
                <img src="${imagePath}" alt="${artwork.title}" loading="lazy">
            </div>
            <div class="gallery-info">
                <h3>${artwork.title}</h3>
                <p>${artwork.medium}, ${artwork.year}</p>
                <button class="view-details" data-id="${artwork.id}">View Details</button>
            </div>
        `;
        
        // Add to container
        artworksContainer.appendChild(artworkElement);
        
        // Add click event for artwork details
        const viewDetailsBtn = artworkElement.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', () => {
            openArtworkModal(artwork);
        });
    });
}

// Generate a random review text
function generateRandomReview() {
    const reviews = [
        "A masterpiece of color and emotion!",
        "Breathtaking tranquility captured perfectly.",
        "Powerful expression of human essence.",
        "A journey through the cosmos with each stroke.",
        "Delicate mastery of light and shadow.",
        "Bold and energetic exploration of form.",
        "Evokes deep emotions with subtle details.",
        "Truly captivating perspective on nature.",
        "A brilliant composition of color and texture.",
        "Transports viewers to another dimension."
    ];
    
    return reviews[Math.floor(Math.random() * reviews.length)];
}

// Apply site settings from admin panel
function applySiteSettings() {
    // Get site settings from localStorage
    const storedSettings = localStorage.getItem('siteSettings');
    if (!storedSettings) return;
    
    const settings = JSON.parse(storedSettings);
    
    // Update site title and subtitle
    document.title = `${settings.siteTitle} - ${settings.siteSubtitle}`;
    const logoTitle = document.querySelector('.logo h1');
    if (logoTitle) logoTitle.textContent = settings.siteTitle;
    
    // Update hero content
    const heroQuote = document.querySelector('.hero-content p.animate-text');
    if (heroQuote) heroQuote.textContent = settings.heroQuote;
    
    // Update about section
    const aboutTextElements = document.querySelectorAll('.about-text p:not(.section-subtitle)');
    if (aboutTextElements.length > 0) {
        // Remove existing paragraphs
        aboutTextElements.forEach(el => el.remove());
        
        // Add new paragraphs
        const aboutTextContainer = document.querySelector('.about-text');
        if (aboutTextContainer) {
            const paragraphs = settings.aboutText.split('\n\n');
            paragraphs.forEach(paragraph => {
                if (paragraph.trim() !== '') {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    p.classList.add('animate-on-scroll');
                    
                    // Insert before the signature if it exists, otherwise append
                    const signature = aboutTextContainer.querySelector('.signature');
                    if (signature) {
                        aboutTextContainer.insertBefore(p, signature);
                    } else {
                        aboutTextContainer.appendChild(p);
                    }
                }
            });
        }
    }
    
    // Update footer info
    const footerLogo = document.querySelector('.footer-logo h2');
    if (footerLogo) footerLogo.textContent = settings.siteTitle;
    
    // Update social media links
    const socialLinks = {
        instagram: document.querySelector('a[href*="instagram.com"]'),
        facebook: document.querySelector('a[href*="facebook.com"]'),
        twitter: document.querySelector('a[href*="twitter.com"]')
    };
    
    if (socialLinks.instagram && settings.social.instagram) {
        socialLinks.instagram.href = settings.social.instagram;
    }
    
    if (socialLinks.facebook && settings.social.facebook) {
        socialLinks.facebook.href = settings.social.facebook;
    }
    
    if (socialLinks.twitter && settings.social.twitter) {
        socialLinks.twitter.href = settings.social.twitter;
    }
}

// Initialize the page with a subtle loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add a class to indicate the page has loaded
    setTimeout(() => {
        document.querySelector('.gallery').classList.add('in-view');
        document.querySelector('footer').classList.add('in-view');
        
        // Make View All button visible
        const viewAllBtn = document.querySelector('.view-all');
        if (viewAllBtn) {
            viewAllBtn.classList.add('animate');
        }
        
        // Animate hero section elements
        const heroElements = document.querySelectorAll('.hero .animate-text');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 300);
        });
        
        // Run animation on scroll after a small delay
        setTimeout(animateOnScroll, 300);
        
        // Apply site settings from admin panel
        applySiteSettings();
        
        // Load and display artworks from admin panel
        loadAndDisplayArtworks();
    }, 500);
});

// Page transitions
const pageTransition = () => {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    setTimeout(() => {
        transition.style.opacity = '0';
        
        setTimeout(() => {
            transition.remove();
        }, 500);
    }, 500);
};

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all links that navigate to other pages
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        // Skip links that open in new tabs or are downloads
        if (link.getAttribute('target') === '_blank' || link.getAttribute('download')) return;
        
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Start page transition
pageTransition();

            // Navigate to the new page after transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

if (menuBtn) {
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

    // Close mobile menu when a nav link is clicked
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});
}

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Helper function to highlight current navigation based on URL
function highlightNavigation() {
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkUrl = link.getAttribute('href');
        
        // Check if the link URL is in the current URL path
        if (currentUrl.includes(linkUrl) && linkUrl !== '/') {
            link.classList.add('active');
        } else if (currentUrl === '/' && linkUrl === '/') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Call the highlight function on page load
document.addEventListener('DOMContentLoaded', highlightNavigation);

// Fix for mobile viewport height issues
function setVH() {
    // First get the viewport height and multiply it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the --vh value initially and update on resize
window.addEventListener('resize', setVH);
setVH();

// Function to update the gallery links for static view
function updateStaticGalleryLinks() {
    // No need to modify this if you're using static HTML
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    updateStaticGalleryLinks();
    
    // Add event listener for escape key to close mobile menu
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            menuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Ensure "View All" button is visible
    const viewAllBtn = document.querySelector('.view-all');
    if (viewAllBtn) {
        viewAllBtn.style.opacity = '1';
        viewAllBtn.style.visibility = 'visible';
        viewAllBtn.classList.add('animate');
    }
    
    // Ensure footer is visible
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.opacity = '1';
        footer.style.visibility = 'visible';
        footer.classList.add('in-view');
    }
}); 