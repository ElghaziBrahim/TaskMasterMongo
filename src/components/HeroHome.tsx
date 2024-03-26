import prisma from "../libs/prismadb";
import Todo from "./Todo";
import getCurrentUser from "@/libs/getCurrentUser";

const HeroHome = async () => {
    const todos = await prisma.todo.findMany();
    const currentUser = await getCurrentUser()
    return (
        <div className="container mx-auto py-4">
            <h1 className="text-3xl font-bold mb-6 text-center">My Todo List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {todos.map((todo) => (
                    <Todo key={todo.id} todo={todo} currentUser={currentUser} />
                ))}
            </div>
        </div>
    );
};

export default HeroHome;
