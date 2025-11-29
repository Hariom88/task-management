import { TaskStatus } from '@/types';

interface TaskFiltersProps {
    searchQuery: string;
    statusFilter: TaskStatus | '';
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (status: TaskStatus | '') => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onCreateTask: () => void;
}

export default function TaskFilters({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
    onSearchSubmit,
    onCreateTask,
}: TaskFiltersProps) {
    return (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <form onSubmit={onSearchSubmit} className="flex-1 w-full lg:max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search tasks by title..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                        />
                        <svg
                            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </form>

                <div className="flex gap-3 w-full lg:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | '')}
                        className="flex-1 lg:flex-none px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                    >
                        <option value="">All Status</option>
                        <option value={TaskStatus.PENDING}>Pending</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>

                    <button
                        onClick={onCreateTask}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        New Task
                    </button>
                </div>
            </div>
        </div>
    );
}

