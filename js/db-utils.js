/**
 * The Color Symphony - Database Utilities
 * 
 * This file contains utilities for managing artwork data using GitHub as a backend.
 * It provides functions to load artworks, save artworks, and synchronize with GitHub.
 */

// Database configuration
const DB_CONFIG = {
  owner: 'devmittul', // GitHub username
  repo: 'thecoloursymphony', // Repository name
  path: 'data/artworks.json', // Path to the JSON file in the repo
  branch: 'master' // Branch name
};

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Load artworks from the local cache or GitHub
 * @param {boolean} forceRefresh - Whether to bypass cache and fetch from GitHub
 * @returns {Promise<Array>} - Promise resolving to array of artworks
 */
async function loadArtworks(forceRefresh = false) {
  try {
    // Check if we have cached data and it's still valid
    const cachedData = localStorage.getItem('artworksCache');
    const cacheTimestamp = localStorage.getItem('artworksCacheTimestamp');
    const now = Date.now();
    
    // Use cache if available and not forcing refresh
    if (cachedData && cacheTimestamp && !forceRefresh) {
      if (now - parseInt(cacheTimestamp) < CACHE_DURATION) {
        console.log('Using cached artwork data');
        return JSON.parse(cachedData);
      }
    }
    
    // Fallback to local data file first
    console.log('Fetching artwork data from local JSON file');
    const response = await fetch('../data/artworks.json');
    
    if (response.ok) {
      const data = await response.json();
      
      // Cache the data
      localStorage.setItem('artworksCache', JSON.stringify(data.artworks));
      localStorage.setItem('artworksCacheTimestamp', now.toString());
      
      // For compatibility with existing code
      localStorage.setItem('artworks', JSON.stringify(data.artworks));
      
      console.log('Successfully loaded artworks from local JSON');
      return data.artworks;
    } else {
      throw new Error('Failed to load from local JSON');
    }
  } catch (error) {
    console.error('Error loading artworks:', error);
    
    // Fallback to localStorage if available
    const storedArtworks = localStorage.getItem('artworks');
    if (storedArtworks) {
      console.log('Falling back to localStorage data');
      return JSON.parse(storedArtworks);
    }
    
    // Return empty array if all else fails
    return [];
  }
}

/**
 * Save artworks to localStorage and update cache
 * @param {Array} artworks - Array of artwork objects to save
 */
function saveArtworks(artworks) {
  try {
    // Save to localStorage for compatibility with existing code
    localStorage.setItem('artworks', JSON.stringify(artworks));
    
    // Update cache
    localStorage.setItem('artworksCache', JSON.stringify(artworks));
    localStorage.setItem('artworksCacheTimestamp', Date.now().toString());
    
    // Set update flag for publishing
    localStorage.setItem('artworksNeedPublishing', 'true');
    
    console.log('Saved artworks to localStorage and updated cache');
    return true;
  } catch (error) {
    console.error('Error saving artworks:', error);
    return false;
  }
}

/**
 * Prepare artwork data for publishing
 * @returns {Object} - Artwork data formatted for JSON file
 */
function prepareArtworkData() {
  const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
  return {
    artworks: artworks,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Export data to a downloadable JSON file that can be manually committed to GitHub
 */
function exportArtworkData() {
  const data = prepareArtworkData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'artworks.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Reset the publishing flag
  localStorage.setItem('artworksNeedPublishing', 'false');
}

// Export functions for use in other files
window.dbUtils = {
  loadArtworks,
  saveArtworks,
  exportArtworkData
}; 