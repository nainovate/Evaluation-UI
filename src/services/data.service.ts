// src/services/data.service.ts
import fs from 'fs/promises';
import path from 'path';

export interface DataResponse<T> {
  data?: T;
  error?: string;
}

class DataService {
  getDashboardStats() {
    throw new Error('Method not implemented.');
  }
  private baseUrl: string;
  private dataPath: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    // For server-side file operations
    this.dataPath = path.join(process.cwd(), 'src', 'data');
  }

  // ========== CLIENT-SIDE API METHODS ==========
  
  private async fetchData<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<DataResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Collections
  async getCollections() {
    return this.fetchData<{ collections: any[] }>('/api/collections');
  }

  async getCollection(id: string) {
    return this.fetchData<any>(`/api/collections/${id}`);
  }

  async createCollection(collection: any) {
    return this.fetchData<any>('/api/collections', {
      method: 'POST',
      body: JSON.stringify(collection),
    });
  }

  async updateCollection(id: string, updates: any) {
    return this.fetchData<any>(`/api/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCollection(id: string) {
    return this.fetchData<{ success: boolean }>(`/api/collections/${id}`, {
      method: 'DELETE',
    });
  }

  // Pipelines
  async getPipelines() {
    return this.fetchData<{ pipelines: any[] }>('/api/pipelines');
  }

  async getPipeline(id: string) {
    return this.fetchData<any>(`/api/pipelines/${id}`);
  }

  async createPipeline(pipeline: any) {
    return this.fetchData<any>('/api/pipelines', {
      method: 'POST',
      body: JSON.stringify(pipeline),
    });
  }

  async updatePipeline(id: string, updates: any) {
    return this.fetchData<any>(`/api/pipelines/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePipeline(id: string) {
    return this.fetchData<{ success: boolean }>(`/api/pipelines/${id}`, {
      method: 'DELETE',
    });
  }

  // Models
  async getModels() {
    return this.fetchData<{ models: any[] }>('/api/models');
  }

  // Embeddings
  async getEmbeddings() {
    return this.fetchData<{ embeddings: any[] }>('/api/embeddings');
  }

  // Vector Stores
  async getVectorStores() {
    return this.fetchData<{ vectorStores: any[] }>('/api/vector-stores');
  }

  // Jobs
  async getJobs() {
    return this.fetchData<{ jobs: any[] }>('/api/jobs');
  }

  async getJob(id: string) {
    return this.fetchData<any>(`/api/jobs/${id}`);
  }

  async createJob(job: any) {
    return this.fetchData<any>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJobStatus(id: string, status: string, state: string) {
    return this.fetchData<any>(`/api/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, state }),
    });
  }

  // ========== EVALUATION METHODS ==========

  // Get all evaluation data
  async getEvaluations() {
    return this.fetchData<{
      evaluationRuns: any[];
      dashboardStats: any;
    }>('/api/evaluations');
  }

  // Get specific evaluation with tasks
  async getEvaluation(id: string) {
    return this.fetchData<{
      evaluation: any;
      tasks: any[];
    }>(`/api/evaluations/${id}`);
  }

  // Get evaluation tasks (optionally filtered by evaluationId)
  async getEvaluationTasks(evaluationId?: string) {
    const params = evaluationId ? `?evaluationId=${evaluationId}` : '';
    return this.fetchData<{ tasks: any[] }>(`/api/evaluations/tasks${params}`);
  }

  // Get evaluation datasets
  async getEvaluationDatasets() {
    return this.fetchData<{ datasets: any[] }>('/api/evaluations/datasets');
  }

  // Get organizations for evaluations
  async getEvaluationOrganizations() {
    return this.fetchData<{ organizations: any[] }>('/api/evaluations/organizations');
  }

  // Get deployments for evaluations
  async getEvaluationDeployments() {
    return this.fetchData<{ deployments: any[] }>('/api/evaluations/deployments');
  }

  // Create new evaluation
  async createEvaluation(evaluation: any) {
    return this.fetchData<any>('/api/evaluations', {
      method: 'POST',
      body: JSON.stringify(evaluation),
    });
  }

  // Update evaluation
  async updateEvaluation(id: string, updates: any) {
    return this.fetchData<any>(`/api/evaluations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Delete evaluation
  async deleteEvaluation(id: string) {
    return this.fetchData<{ success: boolean }>(`/api/evaluations/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard config
  async getDashboardConfig() {
    return this.fetchData<any>('/api/dashboard/config');
  }

  // ========== SERVER-SIDE STORAGE METHODS ==========
  // These methods are for server-side use only (in API routes)

  /**
   * Read JSON file (server-side only)
   */
  async readJSONFile<T>(filename: string): Promise<T> {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      throw new Error(`Failed to read ${filename}`);
    }
  }

  /**
   * Write JSON file (server-side only)
   */
  async writeJSONFile<T>(filename: string, data: T): Promise<void> {
    try {
      const filePath = path.join(this.dataPath, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw new Error(`Failed to write ${filename}`);
    }
  }

  /**
   * Update JSON file with a transformer function (server-side only)
   */
  async updateJSONFile<T>(
    filename: string, 
    transformer: (data: T) => T
  ): Promise<T> {
    const data = await this.readJSONFile<T>(filename);
    const updated = transformer(data);
    await this.writeJSONFile(filename, updated);
    return updated;
  }

  /**
   * Check if file exists (server-side only)
   */
  async fileExists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.dataPath, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure data directory exists (server-side only)
   */
  async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }
}

// Export singleton instance
export const dataService = new DataService();