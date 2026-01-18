// app/admin/dashboard/page.tsx - FIXED DELETE FEATURE
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useArticles } from '@/app/contexts/ArticleContext';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  total_articles: number;
  total_users: number;
  total_comments: number;
  total_likes: number;
  popular_articles: any[];
  category_stats: any[];
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { 
    articles, 
    categories, 
    loading, 
    createArticle, 
    updateArticle, 
    deleteArticle,
    fetchArticles 
  } = useArticles();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_name: 'Puisi',
    author_name: '',
    cover_image: '',
    featured: false,
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika bukan admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Hanya admin yang bisa mengakses dashboard ini');
      router.push('/');
    }
  }, [user, router]);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchArticles(); // Fetch articles saat mount
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category_name) {
      alert('Judul, konten, dan kategori wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await createArticle(formData);

      if (success) {
        alert('Karya berhasil dipublikasikan!');
        // Reset form
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          category_name: 'Puisi',
          author_name: '',
          cover_image: '',
          featured: false,
          tags: ''
        });
        fetchArticles(); // Refresh articles list
        fetchStats(); // Refresh statistics
        setActiveTab('articles'); // Switch to articles tab
      } else {
        alert('Gagal mempublikasikan karya');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Terjadi kesalahan saat mempublikasikan karya');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIXED: Delete Article Function
  const handleDeleteArticle = async (articleId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan!')) {
      return;
    }

    try {
      setDeletingId(articleId);
      console.log('🗑️ Deleting article:', articleId);
      
      const success = await deleteArticle(articleId);
      
      if (success) {
        alert('Karya berhasil dihapus!');
        await fetchArticles(); // Refresh articles list
        await fetchStats(); // Refresh statistics
      } else {
        alert('Gagal menghapus karya. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Terjadi kesalahan saat menghapus karya');
    } finally {
      setDeletingId(null);
    }
  };

  // View article
  const handleViewArticle = (articleId: number) => {
    router.push(`/article/${articleId}`);
  };

  // Edit article
  const handleEditArticle = (articleId: number) => {
    router.push(`/admin/articles/${articleId}/edit`);
  };

  if (!user || user.role !== 'admin') {
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
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Selamat datang, {user?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                👑 Admin
              </span>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
              >
                Kembali ke Home
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'stats', name: '📊 Dashboard' },
              { id: 'create', name: '📝 Buat Karya' },
              { id: 'articles', name: '📚 Kelola Karya' },
              { id: 'categories', name: '🏷️ Kategori' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-blue-600 text-2xl">📄</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Artikel</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.total_articles || articles.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <span className="text-green-600 text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.total_users || '35'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-purple-600 text-2xl">💬</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Komentar</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.total_comments || '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <span className="text-red-600 text-2xl">❤️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Likes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.total_likes || '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Artikel Terpopuler</h3>
              <div className="space-y-3">
                {(stats?.popular_articles || articles.slice(0, 5)).map((article: any, index: number) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-bold text-lg">{index + 1}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{article.title}</h4>
                        <p className="text-sm text-gray-500">
                          {article.view_count} views • {article.like_count} likes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewArticle(article.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Article */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Buat Karya Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Karya *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Masukkan judul karya..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Puisi">Puisi</option>
                    <option value="Cerpen">Cerpen</option>
                    <option value="Novel">Novel</option>
                    <option value="Opini">Opini</option>
                    <option value="Desain Grafis">Desain Grafis</option>
                    <option value="Coding Project">Coding Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nama penulis (opsional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kutipan/Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Kutipan singkat karya (opsional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Karya *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tulis konten karya Anda di sini..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Cover Image
                  </label>
                  <input
                    type="text"
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Article</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setFormData({
                    title: '',
                    content: '',
                    excerpt: '',
                    category_name: 'Puisi',
                    author_name: '',
                    cover_image: '',
                    featured: false,
                    tags: ''
                  })}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memublikasikan...
                    </>
                  ) : (
                    'Publikasikan Karya'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Manage Articles - FIXED DELETE */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Kelola Karya ({articles.length})</h2>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
              >
                + Buat Karya Baru
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Memuat karya...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada karya yang dipublikasikan.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
                >
                  Buat Karya Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {article.cover_image ? (
                          <img 
                            src={article.cover_image} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">Cover</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{article.title}</h3>
                        <p className="text-gray-600 text-sm">Oleh: {article.author_name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {article.category_name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(article.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                          <span>👁️ {article.view_count} views</span>
                          <span>❤️ {article.like_count} likes</span>
                          <span>💬 {article.comment_count} comments</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => handleViewArticle(article.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Lihat
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(article.id)}
                        disabled={deletingId === article.id}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {deletingId === article.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Hapus...
                          </>
                        ) : (
                          'Hapus'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Management */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Kelola Kategori</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.article_count} artikel</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs bg-blue-500 text-white`}>
                      {category.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}