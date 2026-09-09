
"use client";

import { useState } from "react";
import type { Task, statustype, prioritytype } from "../types/task";

type Props = {
  Added: (task: Task) => void;
};

export default function AddTask({ Added }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [priority, setPriority] = useState<prioritytype | "">("");
  const [status, setStatus] = useState<statustype | "">("");

  const [titleError, setTitleError] = useState("");
  const [prioError, setPrioError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function Submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTitleError("");
    setPrioError("");
    setStatusError("");
    setApiError("");
    setSuccessMessage("");

    if (!title.trim()) 
    {
      setTitleError("Title is required");
      return;
    }

    if (!["low", "medium", "high"].includes(priority)) 
    {
      setPrioError("Invalid priority");
      return;
    }

    if (!["pending", "completed"].includes(status)) 
    {
      setStatusError("Invalid status");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) 
    {
      setApiError("Please login first");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
        {
          method: "POST",
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

      if (response.status === 401) {
        localStorage.removeItem("token");
        setApiError("Session expired. Please login again");
        return;
      }

      if (!response.ok) {
        setApiError(data.message || "Failed to add task");
        return;
      }

      Added(data);

      setSuccessMessage("Task added successfully");

      clearForm();
    } catch (error) {
      console.error(error);
      setApiError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setStatus("");

    setTitleError("");
    setPrioError("");
    setStatusError("");
  }

  return (
    <form onSubmit={Submit}>
      <h2 className="text-xl font-bold mb-4">
        Add Task
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

      <label htmlFor="title" className="block font-semibold mb-1">
        Title
      </label>

      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setTitleError("");
          setApiError("");
        }}
        placeholder="Task title"
        className="w-full mb-2 bg-[#8ebd55] border p-2 rounded-md"/>

      {titleError && (
        <p className="text-red-600 mb-3">
          {titleError}
        </p>
      )}

      <label htmlFor="description" className="block font-semibold mb-2">
        Description
      </label>

      <textarea
        id="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setApiError("");
        }}
        placeholder="Task description"
        rows={3}
        className="w-full mb-3 bg-white border p-2 rounded-md"/>

      <label htmlFor="dueDate" className="block font-semibold mb-1">
        Due Date
      </label>

      <input
        id="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => {
          setDueDate(e.target.value);
          setApiError("");
        }}
        className="w-full mb-3 bg-white border p-2 rounded-md"/>

      <label htmlFor="priority" className="block font-semibold mb-2">
        Priority
      </label>

      <select
        id="priority"
        value={priority}
        onChange={(e) => {
          setPriority(e.target.value as prioritytype);
          setPrioError("");
          setApiError("");
        }}
        className="border rounded-md p-2 w-full bg-[#4e9cad] mb-3">
        <option value="">Select priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {prioError && (
        <p className="text-red-600 mb-1">
          {prioError}
        </p>
      )}

      <label htmlFor="status" className="block font-semibold mb-3">
        Status
      </label>

      <select
        id="status"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as statustype);
          setStatusError("");
          setApiError("");
        }}
        className="border rounded-md p-2 w-full mb-1 bg-[#d8e080]">

        <option value="">Select status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      {statusError && (
        <p className="text-red-600 mb-3">
          {statusError}
        </p>
      )}

      <div className="flex gap-2 justify-center mt-4">
        <button
          type="submit"
          disabled={loading}
          className={ loading ? "bg-yellow-400 text-white px-5 py-2 rounded-md"
              : "bg-blue-500 text-white px-5 py-2 rounded-md" }>

          {loading ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={clearForm}
          className="bg-green-600 text-white px-5 py-2 rounded-md">
          Cancel
        </button>
      </div>
    </form>
  );
}
