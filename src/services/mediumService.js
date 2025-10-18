// src/services/mediumService.js

/**
 * Service to fetch and parse Medium blog posts via RSS feed
 */

// Replace with your Medium username
const MEDIUM_USERNAME = 'Daviswollesen';
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

// We'll use RSS2JSON service to convert Medium RSS to JSON
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

export async function fetchMediumPosts() {
  try {
    const response = await fetch(
      `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Medium posts');
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSS feed error');
    }
    
    // Transform Medium posts to match our blog post structure
    return data.items.map((item, index) => ({
      id: index + 1,
      title: item.title,
      date: item.pubDate,
      category: extractCategory(item.categories),
      excerpt: extractExcerpt(item.description),
      url: item.link, // Link to Medium article
      thumbnail: item.thumbnail,
      author: item.author
    }));
    
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}

/**
 * Extract first category from Medium post
 */
function extractCategory(categories) {
  if (!categories || categories.length === 0) return 'Article';
  return categories[0];
}

/**
 * Extract plain text excerpt from HTML description
 */
function extractExcerpt(html) {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Limit to ~150 characters
  if (text.length > 150) {
    return text.substring(0, 150).trim() + '...';
  }
  
  return text;
}