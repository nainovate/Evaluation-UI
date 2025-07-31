// src/services/data.service.ts
export interface DataResponse<T> {
  data?: T;
  error?: string;
}

class DataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

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

  // ========== EXISTING METHODS (Collections, Pipelines, etc.) ==========
  
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

  // ========== NEW EVALUATION METHODS ==========

  // Get all evaluation data
  async getEvaluations() {
    return this.fetchData<{
      evaluationRuns: any[];
      evaluationTasks: any[];
      organizations: any[];
      deployments: any[];
      payloadTemplates: any[];
      dashboardStats: any;
      evaluationDatasets: any[];
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
}

// Export singleton instance
export const dataService = new DataService();