import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import './BlogPage.css';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundPost = blogPosts.find(p => p.slug === slug);
    setPost(foundPost);
  }, [slug]);

  if (post === undefined) {
    return <Navigate to="/blog" replace />;
  }

  if (!post) {
    return <div className="page-layout" style={{padding: '100px 0', textAlign: 'center'}}>Loading article...</div>;
  }

  return (
    <div className="page-layout texture-bengal-wave" style={{padding: 0}}>
      {/* Solid dark hero banner instead of stretched image */}
      <div className="blog-post-hero-banner">
        <div className="container hero-content">
          <Link to="/blog" className="back-to-blog-light">&larr; Back to Journal</Link>
          <div className="blog-post-meta-light">
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>&bull;</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="blog-post-title-light">{post.title}</h1>
          <p className="blog-author-light">By {post.author}</p>
        </div>
      </div>

      <div className="container blog-two-column-layout">
        {/* Left Column: Article Content */}
        <div className="blog-main-content">
          <img src={post.image} alt={post.title} className="blog-post-featured-image" />
          <div 
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Right Column: Sidebar */}
        <aside className="blog-sidebar">
          <div className="sidebar-widget about-widget">
            <h3>About FIO de Bengal</h3>
            <p>We are the industry leader in supplying premium wholesale hair systems and extensions to high-end salons worldwide.</p>
            <Link to="/products" className="btn btn-primary w-100" style={{marginTop: '15px'}}>Shop Wholesale</Link>
          </div>
          
          <div className="sidebar-widget">
            <h3>Recent Articles</h3>
            <ul className="recent-articles-list">
              {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(recent => (
                <li key={recent.id}>
                  <Link to={`/blog/${recent.slug}`} className="recent-article-link">
                    <span className="recent-article-title">{recent.title}</span>
                    <span className="recent-article-date">{new Date(recent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPostPage;
