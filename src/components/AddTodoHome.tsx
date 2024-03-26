"use client"
import TodoModel from "./TodoModel"
const AddTodoHome = () => {
    return (
        <div className="container mx-auto p-4">
            <TodoModel label="Add New" />
        </div>
    )
}

export default AddTodoHome