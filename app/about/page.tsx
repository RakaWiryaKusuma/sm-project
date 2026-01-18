// app/about/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from "../hooks/useDarkMode";
import Link from 'next/link';

const AboutPage: React.FC = () => {
  const { darkMode, toggleDarkMode, mounted } = useDarkMode();
  const { user, logout } = useAuth();

  const teamMembers = [
    {
      name: "SIJA Students",
      role: "Creative Contributors",
      description: "Talented students from SMKN 1 Jakarta's Software Engineering program",
      avatar: "👨‍💻"
    },
    {
      name: "Teachers & Mentors",
      role: "Guidance & Support",
      description: "Dedicated educators nurturing young creative talents",
      avatar: "👩‍🏫"
    },
    {
      name: "School Community",
      role: "Support System",
      description: "The entire SMKN 1 Jakarta community supporting creative endeavors",
      avatar: "🏫"
    }
  ];

  const features = [
    {
      icon: "🎨",
      title: "Creative Expression",
      description: "Platform for students to express creativity through various media"
    },
    {
      icon: "🤝",
      title: "Community Building",
      description: "Connect with like-minded creators and build meaningful relationships"
    },
    {
      icon: "📚",
      title: "Skill Development",
      description: "Develop writing, design, and technical skills in a supportive environment"
    },
    {
      icon: "🌟",
      title: "Portfolio Building",
      description: "Showcase your work and build an impressive creative portfolio"
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
                ["Categories", "/categories"],
                ["About", "/about", true],
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

            {/* Right Section - FIXED */}
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

              {/* Auth Section */}
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
              About <span className="bg-blue-600 bg-clip-text text-transparent">Seija Magazine</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              A digital magazine platform created by and for SIJA students at SMKN 1 Jakarta, 
              dedicated to showcasing creative talents and fostering a community of innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Our <span className="bg-blue-600 bg-clip-text text-transparent">Mission</span>
              </h2>
              <p className={`text-lg mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Seija Magazine was born from the vision to create a dedicated space where 
                Software Engineering students can express their creativity beyond code. 
                We believe that technical skills and creative expression go hand in hand.
              </p>
              <p className={`text-lg mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Our platform serves as a digital canvas for stories, designs, poems, 
                opinions, and innovative projects - celebrating the diverse talents within 
                our SIJA community.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  🎯 Student-Led
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  💡 Creative Freedom
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  🌱 Growth Focused
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`rounded-2xl p-8 ${
                darkMode 
                  ? 'bg-gray-800' 
                  : 'bg-blue-50'
              }`}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">What We Offer</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-blue-600 bg-clip-text text-transparent">Community</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Seija Magazine is powered by the collective creativity and dedication of the SIJA community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`text-center rounded-2xl p-8 transition-all ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white hover:bg-gray-100 shadow-lg'
                }`}
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className={`text-blue-600 mb-4 font-medium`}>{member.role}</p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-blue-600 bg-clip-text text-transparent">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "💫",
                title: "Creativity",
                description: "Encouraging innovative thinking and artistic expression in all forms"
              },
              {
                icon: "🤝",
                title: "Collaboration",
                description: "Building together and supporting each other's creative journeys"
              },
              {
                icon: "🌱",
                title: "Growth",
                description: "Continuous learning and development of both technical and creative skills"
              },
              {
                icon: "🎯",
                title: "Quality",
                description: "Maintaining high standards in all published content and interactions"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`text-center rounded-2xl p-6 transition-all ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`rounded-3xl p-12 text-center ${
              darkMode 
                ? 'bg-gray-800' 
                : 'bg-blue-50'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6">
              Join Our <span className="bg-blue-600 bg-clip-text text-transparent">Creative Journey</span>
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Become part of a community that values both technical excellence and creative expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? "/create" : "/auth/register"}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {user ? "Create Content" : "Join Now"}
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

export default AboutPage;