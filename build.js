const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, 'src', 'posts');
const TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');
const OUT_DIR = __dirname;

// Read templates
const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'post.html'), 'utf-8');
const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf-8');
const archiveTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'archive.html'), 'utf-8');

// Parse posts
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const fileContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const parsed = matter(fileContent);
  const htmlContent = marked.parse(parsed.content);
  
  // Create a raw snippet from the text content (first non-empty line)
  const textContent = htmlContent.replace(/<[^>]+>/g, '');
  const firstLine = textContent.split('\n').find(l => l.trim().length > 0) || '';
  const snippet = firstLine.length > 200 ? firstLine.substring(0, 200) + '...' : firstLine;
  
  posts.push({
    slug: parsed.data.slug || file.replace('.md', ''),
    title: parsed.data.title || 'Untitled',
    date: parsed.data.date || new Date().toISOString().split('T')[0],
    tags: parsed.data.tags || [],
    content: htmlContent,
    snippet: snippet
  });
}

// Sort posts by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate Individual Post Pages
for (const post of posts) {
  const tagsHtml = post.tags.map(tag => `<span class="brut-badge">${tag}</span>`).join('\n');
  const postHtml = postTemplate
    .replace(/\{\{title\}\}/g, post.title)
    .replace(/\{\{title_upper\}\}/g, post.title.toUpperCase())
    .replace(/\{\{date\}\}/g, post.date)
    .replace(/\{\{slug\}\}/g, post.slug)
    .replace(/\{\{tags_html\}\}/g, tagsHtml)
    .replace(/\{\{content\}\}/g, post.content);
    
  fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.html`), postHtml);
  console.log(`[GENERATED POST] ${post.slug}.html`);
}

// Generate Index Page based on Reference Layout (3 grid with 01, 02, 03)
let indexPostsHtml = '';
const colors = ['var(--color-surface)', 'var(--color-primary)', 'var(--color-secondary)'];

for (let i = 0; i < Math.min(posts.length, 3); i++) {
  const post = posts[i];
  const bgColor = colors[i % 3]; // alternating background
  const numberText = `0${i + 1}`;
  
  indexPostsHtml += `
  <div style="position: relative; background: ${bgColor}; padding: var(--space-48) var(--space-32); border-right: ${i < 2 ? 'var(--border-blocky)' : 'none'}; display: flex; flex-direction: column; overflow: hidden;">
    <div class="post-index-number">${numberText}</div>
    <h3 style="font-size: 2.5rem; line-height: 1; text-transform: uppercase; margin-top: auto; margin-bottom: var(--space-24); position: relative; z-index: 1;">${post.title}</h3>
    <p style="font-weight: 700; flex: 1; position: relative; z-index: 1; margin-bottom: var(--space-32);">${post.snippet}</p>
    <a href="${post.slug}.html" style="align-self: flex-start; text-decoration: none; font-weight: 800; font-size: 1.25rem; font-family: var(--font-primary); text-transform: uppercase; color: var(--color-text); position: relative; z-index: 1;">&rarr; READ LOG</a>
  </div>
  `;
}
const finalIndex = indexTemplate.replace('{{recent_posts}}', indexPostsHtml);
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), finalIndex);
console.log('[GENERATED SYSTEM FILE] index.html');

// Generate Archive Page
let archiveRows = '';
for (const post of posts) {
  archiveRows += `
  <tr>
    <td>${post.date}</td>
    <td><a href="${post.slug}.html" style="color: inherit; text-decoration: underline; font-family: var(--font-primary); font-size: 1.25rem; font-weight: 800;">${post.title}</a></td>
    <td>${post.tags.map(tag => `<span class="brut-badge ${tag === 'DEVOPS' || tag === 'SUCCESS' ? 'success' : ''}">${tag}</span>`).join(' ')}</td>
  </tr>
  `;
}
const finalArchive = archiveTemplate.replace('{{archive_rows}}', archiveRows);
fs.writeFileSync(path.join(OUT_DIR, 'archive.html'), finalArchive);
console.log('[GENERATED SYSTEM FILE] archive.html');

console.log('BUILD COMPLETE.');
