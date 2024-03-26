"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    description: z.string().optional(),
    completed: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TodoModelProps {
    id?: number,
    title?: string;
    description?: string;
    dueDate?: string;
    label: string,
    completed?: string;
}

const TodoModel = ({ id, title, description, dueDate, label, completed }: TodoModelProps) => {
    const { toast } = useToast()
    const router = useRouter()
    const [disabledButton, setDisabledButton] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: title ?? '',
            description: description ?? '',
            dueDate: dueDate ?? '',
            completed: completed ?? 'pending',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            if (id) {
                setDisabledButton(true)
                const response = await axios.patch(`/api/todo/${id}`, data);
                setDisabledButton(false)
                toast({
                    variant: "success",
                    description: "Todo edited successfully.",
                })
                router.refresh();
            } else {
                setDisabledButton(true)
                const response = await axios.post('/api/todo/add', data);
                setDisabledButton(false)
                toast({
                    description: "Todo added successfully.",
                })
                reset();
                router.refresh();
            }
            setShowAddTask(false);

        } catch (error) {
            setDisabledButton(false);
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error || 'An error occurred while saving the task.';
                toast({
                    variant: "destructive",
                    description: errorMessage,
                });
            } else {
                console.error('Error saving task:', error);
                toast({
                    variant: "destructive",
                    description: 'An error occurred while saving the task.',
                });
            }
        }
    };

    return (
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogTrigger>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {label}  {label == "Add New" ? "Task" : null}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{label} Task</DialogTitle>
                    <DialogDescription className="text-gray-600 mb-4">
                        Add a new task to your day
                    </DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <input
                                type="text"
                                {...register('title')}
                                placeholder="Title"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.title && <span>{errors.title.message}</span>}
                        </div>
                        <div className="mb-4">
                            <input
                                type="date"
                                {...register('dueDate')}
                                placeholder="Due Date"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.dueDate && <span>{errors.dueDate.message}</span>}
                        </div>
                        {id && (
                            <div className="mb-2">
                                <Select
                                    {...register('completed')}
                                    onValueChange={(value) => {
                                        setValue('completed', value);
                                    }}
                                    defaultValue={completed ?? 'pending'}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">pending</SelectItem>
                                        <SelectItem value="completed">completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="mb-6 h-40 overflow-auto">
                            <textarea
                                {...register('description')}
                                placeholder="Description"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-full"
                            />
                        </div>
                        <DialogFooter className="flex justify-end">
                            <Button disabled={disabledButton}>
                                {
                                    disabledButton && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )
                                }
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default TodoModel