/**
 * API Client for Sistema de Supervisión
 * Handles all HTTP requests to the backend API
 */

// Configuración de URL del API
// En desarrollo: http://localhost:3000/api
// En producción: usar la URL completa del backend o '/api' si está en el mismo dominio
const API_BASE_URL = (() => {
  // Si estamos en localhost, usar el backend local
  if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    return 'http://localhost:3000/api';
  }
  
  // Si hay una variable de entorno configurada, usarla
  if (window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  
  // Por defecto, usar la URL del backend en Render
  // Para producción con dominio diferente, actualizar esta línea:
  return 'https://supervision-backend-g9ib.onrender.com/api';
})();

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.setToken(null);
          window.location.href = '/login.html';
        }

        // Include validation errors in the error message
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessage = data.message || 'Validation errors';
          const error = new Error(errorMessage);
          error.errors = data.errors;
          throw error;
        }

        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: 'GET'
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // ========================================
  // AUTH ENDPOINTS
  // ========================================

  /**
   * Login
   */
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  /**
   * Register
   */
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    return this.get('/auth/profile');
  }

  /**
   * Get all users (for adding participants)
   */
  async getUsers(params = {}) {
    return this.get('/auth/users', params);
  }

  /**
   * Update profile
   */
  async updateProfile(data) {
    return this.put('/auth/profile', data);
  }

  /**
   * Logout
   */
  logout() {
    this.setToken(null);
    window.location.href = '/login.html';
  }

  // ========================================
  // EVENTS ENDPOINTS
  // ========================================

  /**
   * Get all events
   */
  async getEvents(params = {}) {
    return this.get('/events', params);
  }

  /**
   * Get event by ID
   */
  async getEvent(id) {
    return this.get(`/events/${id}`);
  }

  /**
   * Create event
   */
  async createEvent(eventData) {
    return this.post('/events', eventData);
  }

  /**
   * Update event
   */
  async updateEvent(id, eventData) {
    return this.put(`/events/${id}`, eventData);
  }

  /**
   * Delete event
   */
  async deleteEvent(id) {
    return this.delete(`/events/${id}`);
  }

  /**
   * Get events statistics
   */
  async getEventsStats() {
    return this.get('/events/stats');
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit = 10) {
    return this.get('/events/upcoming', { limit });
  }

  /**
   * Add participant to event
   */
  async addEventParticipant(eventId, userId = null) {
    return this.post(`/events/${eventId}/participants`, { user_id: userId });
  }

  /**
   * Get event participants
   */
  async getEventParticipants(eventId) {
    return this.get(`/events/${eventId}/participants`);
  }

  // ========================================
  // EVIDENCES ENDPOINTS
  // ========================================

  /**
   * Get all evidences
   */
  async getEvidences(params = {}) {
    return this.get('/evidences', params);
  }

  /**
   * Get evidence by ID
   */
  async getEvidence(id) {
    return this.get(`/evidences/${id}`);
  }

  /**
   * Create evidence with files
   */
  async createEvidence(evidenceData, files = []) {
    const formData = new FormData();

    // Append text fields
    Object.keys(evidenceData).forEach(key => {
      if (evidenceData[key] !== null && evidenceData[key] !== undefined) {
        if (Array.isArray(evidenceData[key])) {
          formData.append(key, evidenceData[key].join(','));
        } else {
          formData.append(key, evidenceData[key]);
        }
      }
    });

    // Append files
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.post('/evidences', formData);
  }

  /**
   * Update evidence (with optional files)
   */
  async updateEvidence(id, evidenceData, files = []) {
    if (files && files.length > 0) {
      const formData = new FormData();

      // Append text fields
      Object.keys(evidenceData).forEach(key => {
        if (evidenceData[key] !== null && evidenceData[key] !== undefined) {
          if (Array.isArray(evidenceData[key])) {
            formData.append(key, evidenceData[key].join(','));
          } else {
            formData.append(key, evidenceData[key]);
          }
        }
      });

      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });

      return this.request(`/evidences/${id}`, {
        method: 'PUT',
        body: formData
      });
    } else {
      return this.put(`/evidences/${id}`, evidenceData);
    }
  }

  /**
   * Delete evidence file
   */
  async deleteEvidenceFile(evidenceId, fileId) {
    return this.delete(`/evidences/${evidenceId}/files/${fileId}`);
  }

  /**
   * Delete evidence
   */
  async deleteEvidence(id) {
    return this.delete(`/evidences/${id}`);
  }

  /**
   * Get evidences statistics
   */
  async getEvidencesStats() {
    return this.get('/evidences/stats');
  }

  /**
   * Get recent evidences
   */
  async getRecentEvidences(limit = 10) {
    return this.get('/evidences/recent', { limit });
  }

  /**
   * Search evidences by tags
   */
  async searchEvidencesByTags(tags) {
    return this.get('/evidences/search/tags', {
      tags: Array.isArray(tags) ? tags.join(',') : tags
    });
  }
}

// Create singleton instance
const api = new APIClient();

// Export for use in modules or scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
