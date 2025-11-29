'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskFilters from '@/components/dashboard/TaskFilters';
import TaskGrid from '@/components/dashboard/TaskGrid';
import Pagination from '@/components/dashboard/Pagination';
import EmptyState from '@/components/dashboard/EmptyState';
import LoadingState from '@/components/dashboard/LoadingState';
import TaskModal from '@/components/TaskModal';

const TASKS_PER_PAGE = 9;

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const {
        tasks,
        isLoading,
        totalPages,
        totalTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
    } = useTasks({
        page: currentPage,
        limit: TASKS_PER_PAGE,
        search: searchQuery,
        status: statusFilter,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status: TaskStatus | '') => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handleCreateTask = async (data: CreateTaskRequest) => {
        await createTask(data);
        setIsModalOpen(false);
    };

    const handleUpdateTask = async (data: UpdateTaskRequest) => {
        if (!selectedTask) return;
        await updateTask(selectedTask.id, data);
        setIsModalOpen(false);
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setModalMode('edit');
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <DashboardHeader user={user} onLogout={logout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TaskFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchQuery}
                    onStatusFilterChange={handleStatusFilterChange}
                    onSearchSubmit={handleSearch}
                    onCreateTask={openCreateModal}
                />

                {isLoading ? (
                    <LoadingState />
                ) : tasks.length === 0 ? (
                    <EmptyState
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        onCreateTask={openCreateModal}
                    />
                ) : (
                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{tasks.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{totalTasks}</span> tasks
                        </div>
                        <TaskGrid
                            tasks={tasks}
                            onEdit={openEditModal}
                            onDelete={deleteTask}
                            onToggleStatus={toggleTaskStatus}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === 'create' ? handleCreateTask : handleUpdateTask}
                task={selectedTask}
                mode={modalMode}
            />
        </div>
    );
}
