import { useState } from "react";
import KanbanBoard, { Task } from "../kanban/KanbanBoard";
import AuthLayout from "../layout/AuthLayout";
import DashboardHeader, { SortOption } from "./DashboardHeader";
import AddModal from "./AddModal";
import { addTask } from "../utils/queries/Dashboard";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const[refetch , setRefetch] = useState(false);
  const [openTask, setOpenTask] = useState<boolean>(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('createdDesc');
  const handleSearch = (text: string) => {
    setSearchTerm(text);
  }
  const handleAddTask = () => {
    setOpenTask(true);
  }
  const saveTask=(task : Task)=>{
    addTask(task).then(()=>{
      setOpenTask(false);
      setRefetch(true);
    });
  }
  const handleClose=()=>{
    setOpenTask(false);
  }

  const resetRefetch=()=>{
    setRefetch(false);
  }

  const handleSort = (option: SortOption) => {
    setCurrentSort(option);
  }
  
  return (
    <AuthLayout>
      <DashboardHeader searchTerm={searchTerm} handleSearch={handleSearch} handleAddTask={handleAddTask}         handleSort={handleSort}
        currentSort={currentSort}/>
      <KanbanBoard refetch = {refetch} resetRefetch={resetRefetch} currentSort={currentSort} searchTerm={searchTerm}/>
      <AddModal isOpen={openTask} onSave={saveTask} onClose={handleClose}/>
    </AuthLayout>
  )
}

export default Dashboard