"use client"

import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useToast } from "@/components/ui/use-toast"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import TodoModel from "./TodoModel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import { SafeUser, /* SafeTodo */ } from "@/types"
import { Todo } from "@prisma/client"


interface TodoProps {
    currentUser: SafeUser | null;
    todo: Todo
}

const Todo = ({ todo, currentUser }: TodoProps) => {
    const { toast } = useToast()

    const router = useRouter();
    const [disabledButton, setDisabledButton] = useState(false);


    const handleDelete = async (e: any) => {
        try {
            setDisabledButton(true)
            e.preventDefault();
            await axios.delete(`/api/todo/${todo.id}`);
            toast({
                variant: "success",
                description: "Todo deleted successfully.",
            })
            router.refresh();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader >
                <CardTitle className="text-lg font-semibold">{todo.title}</CardTitle>
                <CardDescription>
                    <div className="flex flex-col items-start mb-2">
                        <div className={`px-3 py-1 rounded-full text-sm mr-2  ${todo.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                            {todo.completed ? 'Completed' : 'Pending'}
                        </div>
                        <div className="text-gray-700">{todo.description}</div>
                    </div>
                </CardDescription>

            </CardHeader>
            <CardContent className="p-6">
                <CardDescription className="text-gray-600 mb-4">
                    Due Date: {dayjs(todo.dueDate).format('MMM D, YYYY')}
                </CardDescription>
                <div className="flex space-x-2">
                    {todo.userId === currentUser?.id && (
                        <>
                            <TodoModel completed={todo.completed ? "completed" : "pending"} label="Edit" id={todo.id} title={todo.title} description={todo.description} dueDate={todo.dueDate} />

                            <Button onClick={handleDelete} disabled={disabledButton}>
                                {
                                    disabledButton && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )
                                }
                                Delete
                            </Button>
                        </>

                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default Todo;