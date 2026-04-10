// src/services/mediumService.js

/**
 * Service to fetch and parse Medium blog posts via RSS feed
 */

const MEDIUM_USERNAME = 'Daviswollesen';
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

export async function fetchMediumPosts() {
  const cacheBustedFeedUrl = `${MEDIUM_RSS_URL}?cachebust=${Date.now()}`;
  const requestUrl =
    `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(cacheBustedFeedUrl)}`;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch Medium posts: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'ok' || !Array.isArray(data.items)) {
    throw new Error('RSS feed error');
  }

  return data.items
    .map((item, index) => ({
      id: item.guid || item.link || `medium-post-${index}`,
      title: item.title,
      date: item.pubDate,
      category: extractCategory(item.categories),
      excerpt: extractExcerpt(item.description || item.content),
      url: item.link,
      thumbnail: item.thumbnail || extractThumbnail(item.description || item.content),
      author: item.author
    }))
    .filter(post => post.title && post.url)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
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
  if (!html) return '';

  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');
  const text = document.body.textContent?.replace(/\s+/g, ' ').trim() || '';

  if (text.length > 150) {
    return text.substring(0, 150).trim() + '...';
  }

  return text;
}

function extractThumbnail(html) {
  if (!html) return '';

  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  return document.querySelector('img')?.getAttribute('src') || '';
}
