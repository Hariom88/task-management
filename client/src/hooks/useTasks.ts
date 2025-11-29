import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/taskService';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest, TasksResponse } from '@/types';
import toast from 'react-hot-toast';

interface UseTasksOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: TaskStatus | '';
}

export function useTasks(options: UseTasksOptions = {}) {
    const { page = 1, limit = 9, search = '', status = '' } = options;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: any = { page, limit };
            if (search) params.search = search;
            if (status) params.status = status;

            const response: TasksResponse = await taskService.getTasks(params);
            setTasks(response.tasks);
            setTotalPages(response.totalPages);
            setTotalTasks(response.total);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch tasks';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, search, status]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const createTask = useCallback(async (data: CreateTaskRequest) => {
        try {
            await taskService.createTask(data);
            toast.success('Task created successfully!');
            await fetchTasks();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create task';
            toast.error(errorMessage);
            throw error;
        }
    }, [fetchTasks]);

    const updateTask = useCallback(async (id: string, data: UpdateTaskRequest) => {
        try {
            await taskService.updateTask(id, data);
            toast.success('Task updated successfully!');
            await fetchTasks();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update task';
            toast.error(errorMessage);
            throw error;
        }
    }, [fetchTasks]);

    const deleteTask = useCallback(async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(id);
            toast.success('Task deleted successfully!');
            await fetchTasks();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete task';
            toast.error(errorMessage);
        }
    }, [fetchTasks]);

    const toggleTaskStatus = useCallback(async (id: string, currentStatus: TaskStatus) => {
        try {
            await taskService.toggleTaskStatus(id, currentStatus);
            toast.success('Task status updated!');
            await fetchTasks();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update task status';
            toast.error(errorMessage);
        }
    }, [fetchTasks]);

    return {
        tasks,
        isLoading,
        totalPages,
        totalTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        refetch: fetchTasks,
    };
}

