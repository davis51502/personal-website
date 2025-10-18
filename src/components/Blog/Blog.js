// src/components/Blog/Blog.js
import React, { useState, useEffect } from 'react';
import './Blog.css';
import { fetchMediumPosts } from '../../services/mediumService';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const mediumPosts = await fetchMediumPosts();
        setPosts(mediumPosts);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="blog">
        <div className="blog-header">
          <h1 className="blog-title">Reviews</h1>
          <p className="blog-subtitle">Thoughts on software, finance, and technology</p>
        </div>
        <div className="loading">Loading posts...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="blog">
        <div className="blog-header">
          <h1 className="blog-title">Reviews</h1>
          <p className="blog-subtitle">Thoughts on software, finance, and technology</p>
        </div>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section id="blog" className="blog">
      <div className="blog-header">
        <h1 className="blog-title">Reviews</h1>
        <p className="blog-subtitle">Thoughts on software, finance, and technology</p>
      </div>

      {/* Blog Posts List */}
      <div className="blog-list">
        {posts.length === 0 ? (
          <p className="no-posts">No posts found.</p>
        ) : (
          posts.map(post => (
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
              
              {/* Link to Medium article */}
              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-more"
              >
                Read on Medium →
              </a>
            </article>
          ))
        )}
      </div>
    </section>
  );
}