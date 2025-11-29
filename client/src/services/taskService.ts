import apiClient from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';
import {
    Task,
    CreateTaskRequest,
    UpdateTaskRequest,
    TasksResponse,
    TaskQueryParams,
} from '@/types';

class TaskService {
    async getTasks(params?: TaskQueryParams): Promise<TasksResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);

        const url = `${API_CONFIG.ENDPOINTS.TASKS}${queryParams.toString() ? `?${queryParams.toString()}` : ''
            }`;

        const response = await apiClient.get<TasksResponse>(url);
        return response.data;
    }

    async getTaskById(id: string): Promise<Task> {
        const response = await apiClient.get<Task>(
            `${API_CONFIG.ENDPOINTS.TASKS}/${id}`
        );
        return response.data;
    }

    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        const response = await apiClient.post<Task>(
            API_CONFIG.ENDPOINTS.TASKS,
            taskData
        );
        return response.data;
    }

    async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
        const response = await apiClient.patch<Task>(
            `${API_CONFIG.ENDPOINTS.TASKS}/${id}`,
            taskData
        );
        return response.data;
    }

    async deleteTask(id: string): Promise<void> {
        await apiClient.delete(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
    }

    async toggleTaskStatus(id: string, currentStatus: string): Promise<Task> {
        // Use the dedicated toggle endpoint
        const response = await apiClient.patch<Task>(
            `${API_CONFIG.ENDPOINTS.TASKS}/${id}/toggle`
        );
        return response.data;
    }
}

export const taskService = new TaskService();
