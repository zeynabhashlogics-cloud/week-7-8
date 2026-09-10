"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Task } from "../types/task";
import UpdateTask from "../components/UpdateTask";
import AddTask from "../components/AddTask";

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  async function loadTasks() {
    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_API_URL;

    if (!token) 
    {
      setLoggedIn(false);
      setInitialLoading(false);
      return;
    }
    setLoggedIn(true);

    if (!url) 
    {
      setError("URL is missing.");
      setInitialLoading(false);
      return;
    }
    try {
      setError("");

      const params = new URLSearchParams();

      if (search.trim())
      {
        params.append("search", search.trim());
      }
      if (statusFilter) 
      {
        params.append("status", statusFilter);
      }
      if (priorityFilter) 
      {
        params.append("priority", priorityFilter);
      }

      const queryString = params.toString();
      const response = await fetch(
        `${url}/tasks${queryString ? `?${queryString}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) 
        {
        throw new Error(data.message || "Failed to fetch tasks.");
      }

      setTasks(data);
      setIndex(0);
    } 
    catch (error)
     {
      console.error(error);
      setError( error instanceof Error ? error.message : "Failed to fetch tasks");
    } 
    finally
   {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [search, statusFilter, priorityFilter]);

  async function deleteTask(id: number) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");

    if (!url || !token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const response = await fetch(`${url}/tasks/${id}`, 
        {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) 
      {
        throw new Error(data.message || "Failed to delete task.");
      }

      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);

      if (newTasks.length === 0)
      {
        setIndex(0);
      } 
      else if (index >= newTasks.length)
      {
        setIndex(newTasks.length - 1);
      }

      setError("");
    } 
    catch (error) 
    {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to delete task.");
    }
  }

  function next() 
  {
    if (index < tasks.length - 1)
    {
      setIndex(index + 1);
    }
  }
  function previous() 
  {
    if (index > 0) 
    {
      setIndex(index - 1);
    }
  }

  function TaskAdded(newTask: Task) {
    const matchesSearch = !search.trim() ||
      newTask.title.toLowerCase().includes(search.trim().toLowerCase());

    const matchesStatus = !statusFilter || newTask.status === statusFilter;
    const matchesPriority = !priorityFilter || newTask.priority === priorityFilter;

    if (matchesSearch && matchesStatus && matchesPriority) 
    {
      setTasks((prev) => 
        {
        const newTasks = [...prev, newTask];
        setIndex(newTasks.length - 1);
        return newTasks;
      });
    }

    setError("");
  }

  function TaskUpdated(updatedTask: Task) {
    const matchesSearch = !search.trim() ||
      updatedTask.title.toLowerCase().includes(search.trim().toLowerCase());

    const matchesStatus = !statusFilter || updatedTask.status === statusFilter;
    const matchesPriority = !priorityFilter || updatedTask.priority === priorityFilter;

    if (matchesSearch && matchesStatus && matchesPriority) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } 
    else 
    {
      setTasks((prev) =>
        prev.filter((task) => task.id !== updatedTask.id)
      );
      setIndex(0);
    }

    setError("");
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending" ).length;

  if (initialLoading) 
    {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading tasks...</p>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[ffffff]">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-bold">
            Login or register to access tasks
          </h1>

          <div className="flex justify-center gap-4">
            <Link
              href="/auth/login"
              className="rounded bg-blue-500 px-6
               py-2 text-white hover:bg-blue-600">
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded bg-green-500 px-6 py-2 
              text-white hover:bg-green-600">
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#ffffff] py-10">

      <h1 className="text-3xl font-bold text-left mb-6">
        Your Tasks
      </h1>

      {error && (
        <p className="text-red-600 mb-6">
          {error}
        </p>
      )}

      <div className="flex gap-4 mb-8 items-end">

        <div>
          <label className="block text-sm font-semibold mb-1">
            Search Title
          </label>

          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
              }
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-[220px]" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Priority
          </label>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSearchInput("");
            setStatusFilter("");
            setPriorityFilter("");
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded-md">
          Clear
        </button>

      </div>

      <div className="flex gap-4 mb-8">

        <div className="bg-[#d0d6d5] shadow-md rounded-lg px-8 py-4 text-center">
          <p className="text-sm font-semibold">
            Total Tasks
          </p>

          <p className="text-2xl font-bold">
            {totalTasks}
          </p>
        </div>

        <div className="bg-green-100 shadow-md rounded-lg px-8 py-4 text-center">
          <p className="text-sm font-semibold">
            Completed
          </p>

          <p className="text-2xl font-bold text-green-700">
            {completedTasks}
          </p>
        </div>

        <div className="bg-yellow-100 shadow-md rounded-lg px-8 py-4 text-center">
          <p className="text-sm font-semibold">
            Pending
          </p>

          <p className="text-2xl font-bold text-yellow-700">
            {pendingTasks}
          </p>
        </div>

      </div>

      {tasks.length === 0 ? (
        <div className="w-[500px] bg-white border rounded-lg p-10">
          <p className="text-center mb-6">
            No tasks available.
          </p>

          <AddTask Added={TaskAdded} />
        </div>
      ) :
       (
        <>
          <div className="bg-[#9fb079] shadow-lg text-center rounded-lg p-10 w-[800px]">

            <div className="mb-6">

              <p className="mb-2 bg-yellow-100 w-[200px] mx-auto py-1 rounded-lg text-xs font-semibold">
                ID: {tasks[index].id}
              </p>

              <p className="mb-2 bg-yellow-100 w-[200px] py-1 mx-auto rounded-lg text-xs font-semibold">
                Status: {tasks[index].status}
              </p>
              <p className="mb-2 bg-yellow-100 py-1 w-[200px] mx-auto rounded-lg text-xs font-semibold">
                Priority: {tasks[index].priority}
              </p>
              <p className="mb-2 bg-yellow-100 py-1 mx-auto rounded-lg w-[200px] text-xs font-semibold">
                Title: {tasks[index].title}
              </p>
              <p className="mb-2 bg-yellow-100 py-1 mx-auto rounded-lg w-[200px] text-xs font-semibold">
              Due date: {tasks[index].dueDate ? new Date(tasks[index].dueDate).toLocaleDateString() : "no due date"}
              </p>
              <p className="mb-2 bg-yellow-100 py-1 mx-auto rounded-lg w-[200px] text-xs font-semibold">
                 Description: {tasks[index].description || "No description"}
              </p>
              <p className="bg-yellow-100 py-1 mx-auto rounded-lg w-[200px] text-xs font-semibold">
              Created at: {new Date(tasks[index].createdAt).toLocaleDateString()}
               </p>

            </div>

            <div className="flex justify-center gap-4">

              <button
                onClick={previous}
                disabled={index === 0}
                className="bg-blue-400 text-white border border-blue-400 px-4 
                py-2 rounded-md disabled:bg-gray-300" >
                Previous
              </button>

              <button
                onClick={next}
                disabled={index === tasks.length - 1}
                className="bg-green-600 text-white border 
                border-green-700 px-4 py-2 rounded-md disabled:bg-gray-400">
                Next
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm("Delete this task?")
                  ) {
                    deleteTask(tasks[index].id);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md">
                Delete
              </button>

     </div>
      </div>
          <div className="flex gap-6 justify-center items-start mt-8">

            <div className="w-[385px] bg-[#91a1c9] shadow-lg rounded-lg p-10 text-center">
              <AddTask Added={TaskAdded} />
            </div>

            <div className="w-[385px] bg-[#91a1c9] shadow-lg rounded-lg p-10 text-center">
              <UpdateTask
                key={tasks[index].id}
                task={tasks[index]}
                Updated={TaskUpdated} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

