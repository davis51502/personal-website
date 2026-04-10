// src/services/mediumService.js

/**
 * Fetch Medium posts from a same-origin JSON file generated during deployment.
 */

const MEDIUM_POSTS_PATH = '/medium-posts.json';

export async function fetchMediumPosts() {
  const response = await fetch(`${MEDIUM_POSTS_PATH}?t=${Date.now()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Medium posts: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.posts)) {
    throw new Error('Medium posts payload is invalid');
  }

  return data.posts;
}
