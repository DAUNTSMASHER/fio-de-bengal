import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import './BlogPage.css';

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave">
      <div className="blog-index-container">
        <div className="blog-header">
          <h1>Journal & Insights</h1>
          <p>Expert advice, maintenance tips, and industry news for premium hair professionals.</p>
        </div>
        
        <div className="blog-grid">
          {blogPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} style={{textDecoration: 'none'}}>
              <article className="blog-card">
                <img src={post.image} alt={post.title} className="blog-card-image" />
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <span className="read-more">Read Article &rarr;</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
