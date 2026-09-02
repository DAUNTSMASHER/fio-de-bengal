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
    <div className="page-layout texture-bengal-wave">
      <div className="blog-post-container">
        <Link to="/blog" className="back-to-blog">&larr; Back to Journal</Link>
        
        <div className="blog-post-header">
          <div className="blog-post-meta">
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>&bull;</span>
            <span>{post.readTime}</span>
            <span>&bull;</span>
            <span>By {post.author}</span>
          </div>
          <h1 className="blog-post-title">{post.title}</h1>
        </div>
        
        <img src={post.image} alt={post.title} className="blog-post-hero-image" />
        
        <div 
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default BlogPostPage;
