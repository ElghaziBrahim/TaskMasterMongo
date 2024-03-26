import { NextResponse } from "next/server";
import prisma from "../../../../libs/prismadb";
import { Prisma } from "@prisma/client";
import getCurrentUser from "@/libs/getCurrentUser";



export async function DELETE(
    request: Request,
    { params }: { params: { id: number } }
) {
    try {
        const todoId = +params.id;
        const currentUser = await getCurrentUser();
        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId,

            },
        })

        if (!todo || !currentUser || todo.userId !== currentUser.id) {
            return NextResponse.json(
                { message: "Todo not found or you are not authorized to delete it" },
                { status: 404 }
            );
        }

        const deletedTodo = await prisma.todo.delete({
            where: {
                id: todoId,
            },
        });

        if (deletedTodo) {
            return NextResponse.json({ message: "Todo deleted successfully" });
        } else {
            return NextResponse.json(
                { message: "Failed to delete todo" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "An error occurred while deleting the todo" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: number } }
) {
    try {
        const todoId = +params.id;
        const body = await request.json();
        const { dueDate, title, description, completed } = body;
        const currentUser = await getCurrentUser();
        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId,

            },
        })

        if (!todo || !currentUser || todo.userId !== currentUser.id) {
            return NextResponse.json(
                { message: "Todo not found or you are not authorized to Edit it" },
                { status: 404 }
            );
        }

        const editedTodo = await prisma.todo.update({
            where: {
                id: todoId,
            },
            data: {
                title: title,
                dueDate: dueDate,
                description: description,
                completed: completed === "completed" ? true : false,
            },
        })

        if (editedTodo) {
            return NextResponse.json({ message: "Todo updated successfully" });
        } else {
            return NextResponse.json(
                { message: "Failed to update todo" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error updating todo:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "An error occurred while updating the todo" },
            { status: 500 }
        );
    }
}