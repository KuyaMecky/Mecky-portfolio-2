import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// GitHub API endpoints
export const githubAPI = {
  async getUserInfo() {
    try {
      const response = await apiClient.get('/github/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching GitHub user info:', error);
      return null;
    }
  },

  async getRepositories(limit = 10, sort = 'updated') {
    try {
      const response = await apiClient.get('/github/repositories', {
        params: { limit, sort }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  },

  async getFeaturedRepositories() {
    try {
      const response = await apiClient.get('/github/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured repositories:', error);
      return [];
    }
  },

  async getStats() {
    try {
      const response = await apiClient.get('/github/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      return {};
    }
  }
};

// Contact API endpoints
export const contactAPI = {
  async sendMessage(messageData) {
    try {
      const response = await apiClient.post('/contact', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  },

  async getMessages(limit = 50, skip = 0) {
    try {
      const response = await apiClient.get('/contact/messages', {
        params: { limit, skip }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  },

  async getStats() {
    try {
      const response = await apiClient.get('/contact/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      return {};
    }
  }
};

// Portfolio API endpoints
export const portfolioAPI = {
  async getPortfolioData() {
    try {
      const response = await apiClient.get('/portfolio');
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      return null;
    }
  }
};

// Health check
export const healthAPI = {
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      return { status: 'unhealthy' };
    }
  }
};

export default apiClient;