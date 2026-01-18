"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useDarkMode } from "@/app/hooks/useDarkMode";
import Link from 'next/link';

const categories = [
  "Novel",
  "Cerpen", 
  "Puisi",
  "Opini",
  "Desain Grafis",
  "Coding Project",
  "Cerita Bergambar",
  "Pantun"
];

export default function CreateArticle() {
  const router = useRouter();
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category_name: "",
    author_name: "",
    cover_image: "",
    tags: "",
    featured: false,
    seo_title: "",
    seo_description: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Redirect jika bukan admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, cover_image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category_name) {
      alert('Title, content, and category are required!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          author_name: formData.author_name || user?.username
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Article created successfully!');
        router.push('/admin/dashboard');
      } else {
        alert(data.message || 'Failed to create article');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Admin Access Required
          </h2>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      
      {/* Navigation */}
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

            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Create New Article</h1>
            <p className={`text-lg mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Share your creative work with the community
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a compelling title..."
                  className={`w-full px-4 py-3 rounded-lg border transition-colors text-lg ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <select
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Name */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Author Name
                </label>
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  placeholder="Leave empty to use your username"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cover Image
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="max-w-md">
                      <img 
                        src={imagePreview} 
                        alt="Cover preview" 
                        className="rounded-lg shadow-lg max-h-64 object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of your article..."
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>

              {/* Content */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  placeholder="Write your article content here..."
                  className={`w-full px-4 py-3 rounded-lg border transition-colors font-mono ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Support basic HTML tags for formatting
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Separate tags with commas (e.g., technology, design, tutorial)"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>

              {/* SEO Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleInputChange}
                    placeholder="SEO optimized title..."
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    SEO Description
                  </label>
                  <textarea
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="SEO description for search engines..."
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Feature this article on homepage
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </div>
                  ) : (
                    'Publish Article'
                  )}
                </button>
                
                <Link
                  href="/admin/dashboard"
                  className={`px-8 py-4 rounded-lg font-semibold transition-colors border ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}