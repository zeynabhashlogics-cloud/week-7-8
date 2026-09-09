
"use client";

import { useEffect, useState } from "react";
import type { prioritytype, statustype, Task } from "../types/task";

type Props = {
  task: Task;
  Updated: (task: Task) => void;
};

export default function UpdateTask({ task, Updated }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : ""
  );

  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  const [titleError, setTitleError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setStatus(task.status);
    setPriority(task.priority);

    setTitleError("");
    setApiError("");
    setSuccessMessage("");
  }, [task]);

  async function updateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTitleError("");
    setApiError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setApiError("Please login first");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            status,
            priority,
            dueDate: dueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401)
      {
        localStorage.removeItem("token");
        setApiError("Session expired. Please login again");
        return;
      }

      if (!response.ok) 
      {
        setApiError(data.message || "Failed to update task");
        return;
      }

      Updated(data);
      setSuccessMessage("Task updated successfully");
    } catch (error) {
      console.error(error);
      setApiError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setStatus(task.status);
    setPriority(task.priority);

    setTitleError("");
    setApiError("");
    setSuccessMessage("");
  }

  return (
    <form onSubmit={updateTask}>
      <h2 className="text-xl font-bold mb-4">
        Edit Task
      </h2>

      {apiError && (
        <p className="text-red-600 mb-3">
          {apiError}
        </p>
      )}

      {successMessage && (
        <p className="text-green-600 mb-3">
          {successMessage}
        </p>
      )}

      <div className="mb-4">
        <label htmlFor="update-title" className="block mb-1 font-semibold">
          Title
        </label>

        <input
          id="update-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError("");
            setApiError("");
          }}
          className="border rounded-md p-2 w-full bg-[#8ebd55]" />

        {titleError && (
          <p className="text-red-500 mt-1">
            {titleError}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="update-description" className="block mb-1 font-semibold">
          Description
        </label>

        <textarea
          id="update-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setApiError("");
          }}
          placeholder="Task description"
          rows={3}
          className="border rounded-md p-2 w-full bg-white" />
      </div>

      <div className="mb-4">
        <label htmlFor="update-dueDate" className="block mb-1 font-semibold">
          Due Date
        </label>

        <input
          id="update-dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            setApiError("");
          }}
          className="border rounded-md p-2 w-full bg-white"/>
      </div>

      <div className="mb-4">
        <label htmlFor="update-status" className="block mb-1 font-semibold">
          Status
        </label>

        <select
          id="update-status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as statustype);
            setApiError("");
          }}
          className="border rounded-md p-2 w-full bg-[#4e9cad]" >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="update-priority" className="block mb-1 font-semibold">
          Priority
        </label>

        <select
          id="update-priority"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as prioritytype);
            setApiError("");
          }}
          className="border rounded-md p-2 w-full bg-[#d8e080]">

          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          type="submit"
          disabled={loading}
          className={ loading ? "bg-yellow-400 text-white px-5 py-2 rounded-md"
              : "bg-blue-500 text-white px-5 py-2 rounded-md"} >

          {loading ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="bg-green-600 text-white px-5 py-2 rounded-md
           hover:bg-green-600" >
          Cancel
        </button>
      </div>
    </form>
  );
}
