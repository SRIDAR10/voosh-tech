import axios from "axios";
import { CardType } from "../../kanban/KanbanCard";
import { SortOption } from "../../dashboard/DashboardHeader";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export async function fetchAllTasks(currentSort?: SortOption, searchTerm?: string) {
  const response = await api.get(
    `/v1/dashboard/get-all-tasks?sortOption=${currentSort}&searchTerm=${searchTerm}`
  );
  let data = await response.data ?? [];
  let res = data?.map((val: {
    status: string;
    cards: CardType[];
  }) => val?.status);
  if (data.length < 3) {
    ["TODO", "IN_PROGRESS", "DONE"].map((val) => {
      if (!res.includes(val)) {
        data.push({
          status: val,
          cards: []
        });
      }
    });
  }
  return data;
}

export async function deleteTask(task: { id: string }) {
  const response = await api.delete(`/v1/dashboard/delete-task/${task?.id}`);
  const data = await response.data;
  return data;
}

export async function updateTask(formData: { description?: string, title?: string, id?: string }) {
  await api.post(`/v1/dashboard/update-task`, formData);
}

export async function updateStatus(formData: { status: string, id: string }) {
  await api.post(`/v1/dashboard/update-status`, formData);
}

export async function addTask(formData: { description: string, title: string, status: string }) {
  await api.post(`/v1/dashboard/add-task`, formData);
}