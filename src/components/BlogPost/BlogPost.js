import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import './BlogPost.css';
import blogPosts from '../../data/blogposts.js';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  // If post not found, redirect to blog list
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="blog-post-page">
      <div className="blog-post-container">
        {/* Back Button */}
        <Link to="/blog" className="back-button">
          ← Back to Blog
        </Link>

        {/* Post Header */}
        <header className="post-header">
          <div className="post-meta">
            <time className="post-date">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.category && <span className="post-category">{post.category}</span>}
          </div>
          <h1 className="post-title">{post.title}</h1>
        </header>

        {/* Post Content */}
        <article className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </article>

        {/* Back to Blog Link at Bottom */}
        <div className="post-footer">
          <Link to="/blog" className="back-link">
            ← Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}