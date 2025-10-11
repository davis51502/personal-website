import React from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import blogPosts from '../../data/blogposts';

export default function Blog() {
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <section id="blog" className="blog">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">Thoughts on software, finance, and technology</p>
      </div>

      {/* Blog Posts List */}
      <div className="blog-list">
        {sortedPosts.map(post => (
          <article key={post.id} className="blog-card">
            <div className="blog-meta">
              <time className="blog-date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              {post.category && <span className="blog-category">{post.category}</span>}
            </div>
            
            <h3>{post.title}</h3>
            <p className="blog-excerpt">{post.excerpt}</p>
            
            <Link to={`/blog/${post.id}`} className="read-more">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}