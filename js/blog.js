// blog.js — handles listing posts and rendering markdown posts
async function fetchJSON(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error(`Failed to fetch ${path}: ${r.status}`);
  return r.json();
}

function renderList(containerEl, posts){
  containerEl.innerHTML = '';
  posts.sort((a,b) => (new Date(b.date)) - (new Date(a.date)));
  for(const p of posts){
    const el = document.createElement('article');
    el.className = 'post-item';
    el.innerHTML = `<h2><a href="post.html?post=${encodeURIComponent(p.slug)}">${p.title}</a></h2>
      <p class="post-meta">${p.date} • ${p.reading_time}</p>
      <p>${p.excerpt}</p>`;
    containerEl.appendChild(el);
  }
}

function simpleMarkdownToHTML(md){
  // Very small markdown subset: headings, paragraphs, links, bold, italics, lists
  let html = md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  html = html
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n+/gim, '</p><p>')
    .replace(/^(?:\s*[-*+]\s+(.*))/gim, '<li>$1</li>')
  // wrap paragraphs
  html = '<p>' + html + '</p>';
  // fix list items into <ul>
  html = html.replace(/(<p>)*(?:<li>.*<\/li>)+(<\/p>)*/gim, function(m){
    const items = m.replace(/(^<p>|<\/p>$)/g,'').trim();
    return '<ul>' + items + '</ul>';
  });
  // clean empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g,'');
  return html;
}

async function renderPostFromSlug(slug){
  try{
    const mdPath = `posts/${slug}.md`;
    const res = await fetch(mdPath);
    if(!res.ok) throw new Error('Post not found');
    const md = await res.text();
    const container = document.getElementById('post-content');
    // Extract simple frontmatter (title and date) if present at top
    const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n/);
    let fm = {}, content = md;
    if(fmMatch){
      const fmText = fmMatch[1];
      content = md.slice(fmMatch[0].length);
      fmText.split('\n').forEach(line => {
        const [k,v] = line.split(':').map(s=>s.trim());
        if(k && v) fm[k]=v;
      });
    }
    const title = fm.title || 'Post';
    const date = fm.date || '';
    const html = simpleMarkdownToHTML(content);
    container.innerHTML = `<h1>${title}</h1><div class="post-meta">${date}</div>${html}`;
  }catch(err){
    const container = document.getElementById('post-content');
    container.innerHTML = '<h1>Post not found</h1><p>The requested post could not be loaded.</p>';
    console.error(err);
  }
}

async function init(){
  // If on blog list pages
  if(document.getElementById('post-list')){
    try{
      const posts = await fetchJSON('posts/posts.json');
      renderList(document.getElementById('post-list'), posts);
      // also fill featured on index if present
      const feat = document.getElementById('featured');
      if(feat) renderList(feat, posts.slice(0,4));
    }catch(err){
      console.error('Failed to load posts manifest', err);
    }
  }
  // If on single post page
  if(document.getElementById('post-content')){
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if(slug){
      renderPostFromSlug(slug);
    }else{
      document.getElementById('post-content').innerHTML = '<h1>No post specified</h1>';
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
