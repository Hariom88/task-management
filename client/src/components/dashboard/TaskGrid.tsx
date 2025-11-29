import { Task, TaskStatus } from '@/types';
import TaskCard from '@/components/TaskCard';

interface TaskGridProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, currentStatus: TaskStatus) => void;
}

export default function TaskGrid({ tasks, onEdit, onDelete, onToggleStatus }: TaskGridProps) {
    if (tasks.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    );
}

