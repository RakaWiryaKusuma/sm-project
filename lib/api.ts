// lib/api.ts - FIXED with proper methods
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private async request(endpoint: string, options: RequestConfig = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const config: RequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Generic HTTP methods
  async get(endpoint: string, options?: RequestConfig) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint: string, body?: any, options?: RequestConfig) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint: string, body?: any, options?: RequestConfig) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string, options?: RequestConfig) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async patch(endpoint: string, body?: any, options?: RequestConfig) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.post('/auth/register', userData);
  }

  async getProfile() {
    return this.get('/users/profile');
  }

  async updateProfile(userData: any) {
    return this.put('/users/profile', userData);
  }

  // Article methods
  async getArticles(params?: { 
    search?: string; 
    category?: string; 
    sort?: string; 
    page?: number;
    limit?: number;
  }) {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.get(`/articles?${queryString}`);
  }

  async getArticle(id: string | number) {
    return this.get(`/articles/${id}`);
  }

  async getFeaturedArticles() {
    return this.get('/articles/featured');
  }

  async createArticle(articleData: any) {
    return this.post('/articles', articleData);
  }

  async updateArticle(id: string | number, articleData: any) {
    return this.put(`/articles/${id}`, articleData);
  }

  async deleteArticle(id: string | number) {
    return this.delete(`/articles/${id}`);
  }

  // Like methods
  async likeArticle(id: string | number) {
    return this.post(`/articles/${id}/like`);
  }

  // Comment methods
  async getComments(articleId: string | number) {
    return this.get(`/articles/${articleId}/comments`);
  }

  async addComment(articleId: string | number, content: string, parentId?: number) {
    return this.post(`/articles/${articleId}/comments`, { content, parent_id: parentId });
  }

  async updateComment(commentId: string | number, content: string) {
    return this.put(`/articles/comments/${commentId}`, { content });
  }

  async deleteComment(commentId: string | number) {
    return this.delete(`/articles/comments/${commentId}`);
  }

  // Category methods
  async getCategories() {
    return this.get('/categories');
  }

  async createCategory(categoryData: any) {
    return this.post('/categories', categoryData);
  }

  // Admin methods
  async getStatistics() {
    return this.get('/admin/statistics');
  }

  // Upload methods
  async uploadFile(fileData: { file: string; filename: string }) {
    return this.post('/upload', fileData);
  }
}

export const api = new ApiClient();