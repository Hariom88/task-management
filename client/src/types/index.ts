// User and Authentication Types
export interface User {
    id: string;
    email: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Task Types
export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status?: TaskStatus;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
}

export interface TasksResponse {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TaskQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: TaskStatus;
}
