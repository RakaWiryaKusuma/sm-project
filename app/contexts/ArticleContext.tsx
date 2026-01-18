// contexts/ArticleContext.tsx - FINAL FIX - NO HARDCODED CONTENT
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author_name: string;
  author_username?: string;
  author_avatar?: string;
  author_bio?: string;
  category_name: string;
  category_slug?: string;
  category_color?: string;
  created_at: string;
  updated_at?: string;
  like_count: number;
  view_count: number;
  comment_count: number;
  cover_image?: string;
  read_time?: number;
  featured?: boolean;
  status?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  article_id: number;
  parent_id?: number;
  username: string;
  avatar?: string;
  created_at: string;
  replies?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  article_count: number;
}

interface ArticleContextType {
  articles: Article[];
  filteredArticles: Article[];
  categories: Category[];
  featuredArticles: Article[];
  trendingArticles: Article[];
  currentArticle: Article | null;
  articleComments: Comment[];
  loading: boolean;
  searchLoading: boolean;
  
  pagination: {
    current: number;
    total: number;
    totalItems: number;
  };
  
  filters: {
    search: string;
    category: string;
    sort: string;
    page: number;
    limit: number;
  };
  
  fetchArticles: (newFilters?: Partial<ArticleContextType['filters']>) => Promise<void>;
  fetchArticle: (id: number) => Promise<Article | null>;
  fetchCategories: () => Promise<void>;
  likeArticle: (articleId: number) => Promise<boolean>;
  addComment: (articleId: number, content: string, parentId?: number) => Promise<boolean>;
  fetchComments: (articleId: number) => Promise<void>;
  
  createArticle: (articleData: any) => Promise<boolean>;
  updateArticle: (articleId: number, updates: any) => Promise<boolean>;
  deleteArticle: (articleId: number) => Promise<boolean>;
  
  updateFilters: (newFilters: Partial<ArticleContextType['filters']>) => void;
  clearFilters: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Minimal fallback hanya untuk preview UI
const MINIMAL_FALLBACK: Article[] = [
  {
    id: 0,
    title: "Welcome to SEIJA Magazine",
    content: "Platform untuk berbagi karya kreatif siswa SIJA. Daftar dan mulai berbagi karyamu!",
    excerpt: "Platform untuk berbagi karya kreatif siswa SIJA",
    author_name: "Admin",
    category_name: "Announcement",
    created_at: new Date().toISOString(),
    like_count: 0,
    comment_count: 0,
    view_count: 0,
    cover_image: "/cover/default.jpg",
    read_time: 1,
    featured: false
  }
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Novel", slug: "novel", article_count: 0 },
  { id: 2, name: "Cerpen", slug: "cerpen", article_count: 0 },
  { id: 3, name: "Puisi", slug: "puisi", article_count: 0 },
  { id: 4, name: "Opini", slug: "opini", article_count: 0 },
  { id: 5, name: "Desain Grafis", slug: "desain", article_count: 0 },
  { id: 6, name: "Coding Project", slug: "coding", article_count: 0 }
];

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [articleComments, setArticleComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'newest',
    page: 1,
    limit: 12
  });

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });

  const API_URL = 'http://localhost:3001/api';

  // Fetch Articles - HANYA DARI API
  const fetchArticles = async (newFilters?: Partial<typeof filters>) => {
    try {
      const finalFilters = { ...filters, ...newFilters, page: newFilters?.page || 1 };
      
      if (newFilters?.search !== undefined) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const queryParams = new URLSearchParams();
      Object.entries(finalFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      console.log('📡 Fetching articles from API...');
      
      const response = await fetch(`${API_URL}/articles?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 API Response:', data.success ? '✅ Success' : '❌ Failed');

      if (data.success && Array.isArray(data.data)) {
        console.log(`✅ Loaded ${data.data.length} articles from database`);
        setArticles(data.data);
        setFilteredArticles(data.data);
        setPagination(data.pagination || {
          current: 1,
          total: 1,
          totalItems: data.data.length
        });
        setFilters(finalFilters);
      } else {
        console.log('⚠️ No articles in database, showing minimal fallback');
        setArticles(MINIMAL_FALLBACK);
        setFilteredArticles(MINIMAL_FALLBACK);
        setPagination({
          current: 1,
          total: 1,
          totalItems: MINIMAL_FALLBACK.length
        });
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      console.log('⚠️ API error, showing minimal fallback');
      setArticles(MINIMAL_FALLBACK);
      setFilteredArticles(MINIMAL_FALLBACK);
      setPagination({
        current: 1,
        total: 1,
        totalItems: MINIMAL_FALLBACK.length
      });
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Fetch Single Article - HANYA DARI API, NO HARDCODED
  const fetchArticle = async (id: number): Promise<Article | null> => {
    try {
      setLoading(true);
      console.log(`📡 Fetching article ${id} from API...`);
      
      const response = await fetch(`${API_URL}/articles/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success && data.data) {
        console.log(`✅ Article ${id} loaded:`, data.data.title);
        // IMPORTANT: Set actual article content, not hardcoded
        setCurrentArticle(data.data);
        return data.data;
      } else {
        console.error(`❌ Article ${id} not found in database`);
        setCurrentArticle(null);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching article ${id}:`, error);
      setCurrentArticle(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  // Like Article
  const likeArticle = async (articleId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like articles');
        return false;
      }

      const response = await fetch(`${API_URL}/articles/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { 
                ...article, 
                like_count: data.liked ? article.like_count + 1 : Math.max(0, article.like_count - 1)
              }
            : article
        ));
        
        setFilteredArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { 
                ...article, 
                like_count: data.liked ? article.like_count + 1 : Math.max(0, article.like_count - 1)
              }
            : article
        ));

        if (currentArticle?.id === articleId) {
          setCurrentArticle(prev => prev ? {
            ...prev,
            like_count: data.liked ? prev.like_count + 1 : Math.max(0, prev.like_count - 1)
          } : null);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error liking article:', error);
      return false;
    }
  };

  // Comments
  const fetchComments = async (articleId: number) => {
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}/comments`);
      const data = await response.json();

      if (data.success) {
        const comments = data.data;
        const commentMap = new Map();
        const rootComments: Comment[] = [];

        comments.forEach((comment: Comment) => {
          commentMap.set(comment.id, { ...comment, replies: [] });
        });

        comments.forEach((comment: Comment) => {
          if (comment.parent_id) {
            const parent = commentMap.get(comment.parent_id);
            if (parent) {
              parent.replies.push(commentMap.get(comment.id));
            }
          } else {
            rootComments.push(commentMap.get(comment.id));
          }
        });

        setArticleComments(rootComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (articleId: number, content: string, parentId?: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to comment');
        return false;
      }

      const response = await fetch(`${API_URL}/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parent_id: parentId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchComments(articleId);
        
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, comment_count: article.comment_count + 1 }
            : article
        ));

        if (currentArticle?.id === articleId) {
          setCurrentArticle(prev => prev ? {
            ...prev,
            comment_count: prev.comment_count + 1
          } : null);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  // Admin Actions
  const createArticle = async (articleData: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      console.log('📝 Creating article:', articleData.title);
      
      const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();
      console.log('📦 Create response:', data);

      if (data.success) {
        console.log('✅ Article created successfully');
        await fetchArticles(); // Refresh articles list
        return true;
      }
      console.error('❌ Failed to create article:', data.message);
      return false;
    } catch (error) {
      console.error('❌ Error creating article:', error);
      return false;
    }
  };

  const updateArticle = async (articleId: number, updates: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        await fetchArticles();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating article:', error);
      return false;
    }
  };

  const deleteArticle = async (articleId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      console.log('🗑️ Deleting article:', articleId);
      
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📦 Delete response:', data);

      if (data.success) {
        console.log('✅ Article deleted successfully');
        await fetchArticles(); // Refresh articles list
        return true;
      }
      console.error('❌ Failed to delete article:', data.message);
      return false;
    } catch (error) {
      console.error('❌ Error deleting article:', error);
      return false;
    }
  };

  // Utility Functions
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      sort: 'newest',
      page: 1,
      limit: 12
    });
  };

  // Computed Values
  const featuredArticles = articles.filter(article => article.featured).slice(0, 3);
  const trendingArticles = [...articles]
    .sort((a, b) => b.like_count - a.like_count)
    .slice(0, 3);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchArticles(),
        fetchCategories()
      ]);
    };

    loadInitialData();
  }, []);

  // Fetch articles when filters change
  useEffect(() => {
    if (!loading) {
      fetchArticles();
    }
  }, [filters.search, filters.category, filters.sort, filters.page]);

  const value: ArticleContextType = {
    articles,
    filteredArticles,
    categories,
    featuredArticles,
    trendingArticles,
    currentArticle,
    articleComments,
    loading,
    searchLoading,
    pagination,
    filters,
    fetchArticles,
    fetchArticle,
    fetchCategories,
    likeArticle,
    addComment,
    fetchComments,
    createArticle,
    updateArticle,
    deleteArticle,
    updateFilters,
    clearFilters,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
}