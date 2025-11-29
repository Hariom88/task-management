import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { TaskStatus } from '@prisma/client';

// Zod Schemas
const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
});

const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
});

const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    search: z.string().optional(),
});

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { page = '1', limit = '10', status, search } = querySchema.parse(req.query);
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = { userId };
        if (status) where.status = status;
        if (search) where.title = { contains: search, mode: 'insensitive' }; // Case insensitive search

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.task.count({ where }),
        ]);

        res.json({
            tasks,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const data = createTaskSchema.parse(req.body);

        const task = await prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const data = updateTaskSchema.parse(req.body);

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const updatedTask = await prisma.task.update({
            where: { id },
            data,
        });

        res.json(updatedTask);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await prisma.task.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Cycle through statuses: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
        const statusCycle: Record<TaskStatus, TaskStatus> = {
            [TaskStatus.PENDING]: TaskStatus.IN_PROGRESS,
            [TaskStatus.IN_PROGRESS]: TaskStatus.COMPLETED,
            [TaskStatus.COMPLETED]: TaskStatus.PENDING,
        };

        const newStatus = statusCycle[task.status] || TaskStatus.PENDING;

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
