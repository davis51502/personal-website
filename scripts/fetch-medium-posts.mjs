import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'public', 'medium-posts.json');

const MEDIUM_USERNAME = 'Daviswollesen';
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

async function main() {
  try {
    const response = await fetch(MEDIUM_RSS_URL, {
      headers: {
        'User-Agent': 'personal-website-medium-sync/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium RSS: ${response.status}`);
    }

    const xml = await response.text();
    const posts = parseMediumRss(xml);
    const payload = {
      source: MEDIUM_RSS_URL,
      generatedAt: new Date().toISOString(),
      posts
    };

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    console.log(`Wrote ${posts.length} Medium posts to ${outputPath}`);
  } catch (error) {
    console.error('Failed to refresh Medium posts:', error.message);

    try {
      await readFile(outputPath, 'utf8');
      console.log(`Keeping existing Medium posts file at ${outputPath}`);
    } catch {
      process.exitCode = 1;
    }
  }
}

function parseMediumRss(xml) {
  const items = matchAll(xml, /<item\b[\s\S]*?<\/item>/g);

  return items
    .map((item, index) => {
      const title = decodeHtml(stripCdata(extractTag(item, 'title')));
      const date = normalizeDate(stripCdata(extractTag(item, 'pubDate')));
      const url = decodeHtml(stripCdata(extractTag(item, 'link')));
      const guid = decodeHtml(stripCdata(extractTag(item, 'guid')));
      const author = decodeHtml(stripCdata(extractTag(item, 'dc:creator')));
      const categories = matchAll(item, /<category\b[^>]*>([\s\S]*?)<\/category>/g)
        .map(category => decodeHtml(stripCdata(category)))
        .filter(Boolean);
      const htmlContent =
        stripCdata(extractTag(item, 'content:encoded')) ||
        stripCdata(extractTag(item, 'description'));

      return {
        id: guid || url || `medium-post-${index}`,
        title,
        date,
        category: categories[0] || 'Article',
        excerpt: extractExcerpt(htmlContent),
        url,
        thumbnail: extractThumbnail(htmlContent),
        author
      };
    })
    .filter(post => post.title && post.url)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function extractTag(xml, tagName) {
  const escapedTagName = tagName.replace(':', '\\:');
  const match = xml.match(new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, 'i'));
  return match ? match[1].trim() : '';
}

function stripCdata(value) {
  return value
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim();
}

function matchAll(value, pattern) {
  return Array.from(value.matchAll(pattern), match => match[1] ?? match[0]);
}

function extractExcerpt(html) {
  const text = decodeHtml(
    html
      .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
      .replace(/<img[^>]*>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

  if (text.length > 150) {
    return `${text.slice(0, 150).trim()}...`;
  }

  return text;
}

function extractThumbnail(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? decodeHtml(match[1]) : '';
}

function normalizeDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

await main();
