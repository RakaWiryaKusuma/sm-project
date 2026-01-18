// app/contact/page.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from "../hooks/useDarkMode";
import Link from 'next/link';

const ContactPage: React.FC = () => {
  const { darkMode, toggleDarkMode, mounted } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useAuth();

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      description: "Send us an email anytime",
      value: "sija4tahun@gmail.com",
      link: "mailto:sija4tahun@gmail.com"
    },
    {
      icon: "💬",
      title: "Community",
      description: "Join our student community",
      value: "SIJA Discord",
      link: "#"
    },
    {
      icon: "🏫",
      title: "School",
      description: "Visit us at school",
      value: "SMKN 1 Jakarta",
      link: "https://maps.google.com"
    },
    {
      icon: "🕒",
      title: "Response Time",
      description: "We typically reply within",
      value: "24-48 hours",
      link: "#"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 2000);
  };

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
                ["About", "/about"],
                ["Contact", "/contact", true]
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
              Get In <span className="bg-blue-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Have questions, suggestions, or want to collaborate? We'd love to hear from you. 
              Reach out to our team and let's create something amazing together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                Let's <span className="bg-blue-600 bg-clip-text text-transparent">Connect</span>
              </h2>
              <p className={`text-lg mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Whether you're a student looking to contribute, a visitor with questions, 
                or someone interested in collaboration, we're here to help and connect.
              </p>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.link}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{method.title}</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {method.description}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700 shadow-sm'
                    }`}>
                      {method.value}
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`mt-8 p-6 rounded-2xl ${
                  darkMode 
                    ? 'bg-gray-800' 
                    : 'bg-blue-50'
                }`}
              >
                <h3 className="font-bold mb-3">Quick Support</h3>
                <p className={`text-sm mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  For technical issues with the platform, please include details about the problem 
                  you're experiencing and any error messages you see.
                </p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  For content submissions, please use the create page after logging in.
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`rounded-2xl p-8 ${
                darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
              }`}
            >
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked <span className="bg-blue-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Who can publish content on Seija Magazine?",
                answer: "Currently, Seija Magazine is open to SIJA students at SMKN 1 Jakarta. You need to register with your school email to start publishing."
              },
              {
                question: "What types of content can I publish?",
                answer: "You can publish various creative works including articles, stories, poems, design projects, coding projects, opinions, and more across our different categories."
              },
              {
                question: "How do I get started with publishing?",
                answer: "Simply register for an account, verify your student status, and you can start creating content through the create page immediately."
              },
              {
                question: "Is there any content moderation?",
                answer: "Yes, all content goes through a moderation process to ensure it meets our community guidelines and maintains a positive, creative environment."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`rounded-2xl p-6 ${
                  darkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
                }`}
              >
                <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {faq.answer}
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
              Ready to <span className="bg-blue-600 bg-clip-text text-transparent">Connect</span>?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join our creative community and start sharing your amazing work with others.
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

export default ContactPage;