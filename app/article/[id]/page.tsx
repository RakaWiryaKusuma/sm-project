// app/article/[id]/page.tsx - FIXED CONTENT BUG
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useArticles } from "@/app/contexts/ArticleContext";
import { useDarkMode } from "@/app/hooks/useDarkMode";
import Link from 'next/link';

const ArticleDetailPage: React.FC = () => {
  const { darkMode, toggleDarkMode, mounted } = useDarkMode();
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { 
    currentArticle, 
    fetchArticle, 
    likeArticle, 
    articleComments, 
    fetchComments,
    addComment,
    loading 
  } = useArticles();
  
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const articleId = parseInt(params.id as string);

  // Fetch article dari API
  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId).catch(console.error);
    }
  }, [articleId]);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like articles');
      return;
    }
    await likeArticle(articleId);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!user) {
      alert('Please login to comment');
      return;
    }

    setIsSubmitting(true);
    const success = await addComment(articleId, commentText);
    if (success) {
      setCommentText("");
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    logout();
  };

  // FIXED: Function untuk render content dengan proper formatting
  const renderContent = (content: string) => {
    if (!content) return null;

    // Jika content adalah HTML, render sebagai HTML
    if (content.includes('<p>') || content.includes('<br>') || content.includes('<div>')) {
      return (
        <div 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Jika content adalah plain text, format sebagai paragraf/puisi
    const lines = content.split('\n').filter(line => line.trim());
    
    // Check if it looks like poetry (short lines)
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    const isPoetry = avgLineLength < 80 && lines.length > 4;

    if (isPoetry) {
      // Render sebagai puisi dengan line breaks
      return (
        <div className="space-y-4 leading-loose text-center">
          {lines.map((line, index) => {
            // Empty line = stanza break
            if (line.trim() === '') {
              return <div key={index} className="h-6"></div>;
            }
            return <p key={index} className="m-0">{line}</p>;
          })}
        </div>
      );
    } else {
      // Render sebagai paragraf normal
      return (
        <div className="space-y-4">
          {lines.map((line, index) => (
            <p key={index} className="text-justify leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      );
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading && !currentArticle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
          <Link href="/explore" className="text-blue-600 hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-blue-600 bg-clip-text text-transparent">
                    SEIJA
                  </h1>
                  <p className="text-xs text-gray-500">MAGAZINE</p>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {[
                ["Home", "/"],
                ["Explore", "/explore"],
                ["Categories", "/categories"],
                ["About", "/about"],
                ["Contact", "/contact"]
              ].map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className={`font-medium transition-all hover:text-blue-600 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/create"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    ✨ Create
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      👑 Dashboard
                    </Link>
                  )}
                  <div className="relative group">
                    <Link href="/profile" className="block">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                        <span className="text-white text-sm font-bold">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Link>
                    
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">Signed in as</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>←</span>
              <span>Back to Explore</span>
            </button>
          </motion.div>

          {/* Cover Image */}
          {currentArticle.cover_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div 
                className="aspect-[16/9] bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${currentArticle.cover_image})`
                }}
              />
            </motion.div>
          )}

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                {currentArticle.category_name}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {currentArticle.title}
            </h1>
            
            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-lg ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentArticle.author_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span>By {currentArticle.author_name}</span>
              </div>
              <span>•</span>
              <span>{new Date(currentArticle.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              {currentArticle.read_time && (
                <>
                  <span>•</span>
                  <span>{currentArticle.read_time} min read</span>
                </>
              )}
            </div>
          </motion.header>

          {/* Article Content - FIXED TO USE ACTUAL CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className={`max-w-2xl mx-auto font-serif text-xl ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {renderContent(currentArticle.content)}
            </div>
          </motion.div>

          {/* Article Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`flex items-center justify-center space-x-8 py-6 border-y ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-xl">❤️</span>
              <span className="font-semibold">{currentArticle.like_count}</span>
              <span>Likes</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xl">👁️</span>
              <span className="font-semibold">{currentArticle.view_count}</span>
              <span>Views</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xl">💬</span>
              <span className="font-semibold">{currentArticle.comment_count}</span>
              <span>Comments</span>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">Comments ({currentArticle.comment_count})</h2>
            
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !commentText.trim()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className={`text-center py-8 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Please login to leave a comment
                </p>
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-block"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {articleComments.length > 0 ? (
                articleComments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {comment.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{comment.username}</span>
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </article>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2024 Seija Magazine. Made with Love by SIJA Students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticleDetailPage;