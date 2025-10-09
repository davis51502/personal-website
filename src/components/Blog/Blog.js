import React from 'react';
import './Blog.css';

export default function Blog() {
  // Sample blog posts - you can move this to a data file later
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with Investment Analytics',
      date: '2024-03-15',
      excerpt: 'An introduction to using data science techniques for investment analysis...',
      content: 'Full blog post content here...'
    },
    {
      id: 2,
      title: 'Building My Portfolio Website',
      date: '2024-02-20',
      excerpt: 'Lessons learned while creating a React-based portfolio site...',
      content: 'Full blog post content here...'
    }
  ];

  return (
    <section id="blog" className="blog container">
      <h2>Blog</h2>
      <div className="blog-grid">
        {blogPosts.map(post => (
          <article key={post.id} className="blog-post">
            <h3>{post.title}</h3>
            <time className="blog-date">{new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</time>
            <p className="blog-excerpt">{post.excerpt}</p>
            <a href={`#blog-${post.id}`} className="read-more">Read more →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
