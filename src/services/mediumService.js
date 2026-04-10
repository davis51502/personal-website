// src/services/mediumService.js

/**
 * Service to fetch and parse Medium blog posts via RSS feed
 */

const MEDIUM_USERNAME = 'Daviswollesen';
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
const ALL_ORIGINS_API = 'https://api.allorigins.win/get';

export async function fetchMediumPosts() {
  const cacheBuster = Date.now();
  const proxiedFeedUrl =
    `${ALL_ORIGINS_API}?url=${encodeURIComponent(MEDIUM_RSS_URL)}&cacheBust=${cacheBuster}`;

  try {
    const response = await fetch(proxiedFeedUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium RSS: ${response.status}`);
    }

    const payload = await response.json();
    const rssContent = payload.contents;

    if (!rssContent) {
      throw new Error('Medium RSS response was empty');
    }

    return parseMediumRss(rssContent);
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}

function parseMediumRss(rssContent) {
  const parser = new DOMParser();
  const rssDocument = parser.parseFromString(rssContent, 'text/xml');
  const parserError = rssDocument.querySelector('parsererror');

  if (parserError) {
    throw new Error('Unable to parse Medium RSS feed');
  }

  const items = Array.from(rssDocument.querySelectorAll('item'));

  return items
    .map((item, index) => {
      const title = getTextContent(item, 'title');
      const date = getTextContent(item, 'pubDate');
      const url = getTextContent(item, 'link');
      const author = getTextContent(item, 'dc\\:creator, creator');
      const categories = Array.from(item.querySelectorAll('category'))
        .map(category => category.textContent?.trim())
        .filter(Boolean);
      const htmlContent =
        getTextContent(item, 'content\\:encoded, encoded') ||
        getTextContent(item, 'description');

      return {
        id: getTextContent(item, 'guid') || `${url}-${index}`,
        title,
        date,
        category: extractCategory(categories),
        excerpt: extractExcerpt(htmlContent),
        url,
        thumbnail: extractThumbnail(htmlContent),
        author
      };
    })
    .filter(post => post.title && post.url)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getTextContent(parent, selector) {
  return parent.querySelector(selector)?.textContent?.trim() || '';
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
