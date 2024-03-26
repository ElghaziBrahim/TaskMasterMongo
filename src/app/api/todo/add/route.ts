import { NextResponse } from "next/server";
import getCurrentUser from "@/libs/getCurrentUser";
import prisma from "../../../../libs/prismadb";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { dueDate, title, description } = body;

        if (!title || !dueDate) {
            return NextResponse.json(
                { error: "Title and due date are required" },
                { status: 400 }
            );
        }

        const todo = await prisma.todo.create({
            data: {
                title: title,
                dueDate: dueDate,
                description: description || null,
                userId: currentUser.id,
            },
        });

        return NextResponse.json(todo, { status: 201 });
    } catch (error) {
        console.error("Error creating todo:", error);
        return NextResponse.json(
            { error: "An error occurred while creating the todo" },
            { status: 500 }
        );
    }
}