// app/categories/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { useArticles } from '../contexts/ArticleContext';
import { useDarkMode } from "../hooks/useDarkMode";
import Link from 'next/link';

const CategoriesPage: React.FC = () => {
  const { darkMode, toggleDarkMode, mounted } = useDarkMode();
  const { user, logout } = useAuth();
  const { articles } = useArticles();

  const categories = [
    {
      name: "Novel",
      icon: "📚",
      color: "bg-blue-600",
      description: "Long-form fictional narratives with complex plots and character development",
      slug: "novel",
      count: articles.filter(a => a.category_name === "Novel").length
    },
    {
      name: "Cerpen",
      icon: "📖", 
      color: "bg-blue-600",
      description: "Short stories that deliver powerful narratives in compact form",
      slug: "cerpen",
      count: articles.filter(a => a.category_name === "Cerpen").length
    },
    {
      name: "Puisi",
      icon: "✨",
      color: "bg-blue-600",
      description: "Expressive literary works that evoke emotions through rhythm and imagery",
      slug: "puisi",
      count: articles.filter(a => a.category_name === "Puisi").length
    },
    {
      name: "Opini",
      icon: "💭",
      color: "bg-blue-600", 
      description: "Personal perspectives and analytical pieces on various topics",
      slug: "opini",
      count: articles.filter(a => a.category_name === "Opini").length
    },
    {
      name: "Desain Grafis",
      icon: "🎨",
      color: "bg-blue-600",
      description: "Visual creative works including digital art, layouts, and illustrations",
      slug: "desain",
      count: articles.filter(a => a.category_name === "Desain Grafis").length
    },
    {
      name: "Coding Project",
      icon: "💻",
      color: "bg-blue-600",
      description: "Programming projects, tutorials, and technical innovations",
      slug: "coding",
      count: articles.filter(a => a.category_name === "Coding Project").length
    },
    {
      name: "Cerita Bergambar",
      icon: "🖼️",
      color: "bg-blue-600",
      description: "Visual storytelling through sequential art and illustrations",
      slug: "cergam", 
      count: articles.filter(a => a.category_name === "Cerita Bergambar").length
    },
    {
      name: "Pantun",
      icon: "🎭",
      color: "bg-blue-600",
      description: "Traditional and modern poetic forms with rhythmic patterns",
      slug: "pantun",
      count: articles.filter(a => a.category_name === "Pantun").length
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
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
            {/* Logo */}
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

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                ["Home", "/"],
                ["Explore", "/explore"],
                ["Categories", "/categories", true],
                ["About", "/about"],
                ["Contact", "/contact"]
              ].map(([name, href, isActive]) => (
                <Link
                  key={name}
                  href={href as string}
                  className={`font-medium transition-all hover:text-blue-600 ${
                    isActive 
                      ? 'text-blue-600' 
                      : darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Auth Section - FIXED */}
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Tombol Create untuk semua user yang login */}
                  <Link
                    href="/create"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                     Create
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
                    
                    {/* Dropdown Menu */}
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

      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Content <span className="bg-blue-600 bg-clip-text text-transparent">Categories</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Explore diverse creative expressions across multiple categories. Each category represents a unique form of student creativity and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group rounded-2xl p-6 transition-all cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl'
                }`}
              >
                <Link href={`/explore?category=${category.slug}`} className="block">
                  <div className="text-center">
                    <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className={`text-sm mb-4 line-clamp-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {category.description}
                    </p>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span>{category.count}</span>
                      <span className="ml-1">{category.count === 1 ? 'work' : 'works'}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`mt-16 rounded-2xl p-8 ${
              darkMode 
                ? 'bg-gray-800' 
                : 'bg-blue-50'
            }`}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Community <span className="bg-blue-600 bg-clip-text text-transparent">Statistics</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: categories.reduce((acc, cat) => acc + cat.count, 0), label: "Total Works" },
                  { number: categories.length, label: "Categories" },
                  { number: "35", label: "Active Creators" },
                  { number: "0", label: "Monthly Views" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className={`text-sm mt-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`rounded-3xl p-12 text-center ${
              darkMode 
                ? 'bg-gray-800' 
                : 'bg-blue-50'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="bg-blue-600 bg-clip-text text-transparent">Contribute</span>?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join our creative community and share your work in any category that inspires you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? "/create" : "/auth/register"}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {user ? "Create Content" : "Get Started"}
              </Link>
              <Link
                href="/explore"
                className={`border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:border-blue-600 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                Explore Content
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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

export default CategoriesPage;