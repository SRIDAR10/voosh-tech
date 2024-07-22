import {
    closestCorners,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column, { ColumnType } from "./KanbanLane";
import { useEffect, useState } from "react";
import EditModal from "../dashboard/EditModal";
import DeleteModal from "../dashboard/DeleteModal";
import { deleteTask, fetchAllTasks, updateStatus, updateTask } from "../utils/queries/Dashboard";
import { CardType } from "./KanbanCard";
import { SortOption } from "../dashboard/DashboardHeader";

export type Task = {
    description: string;
    title: string;
    id?: string;
    status: string;
}

type Props = {
    refetch: boolean;
    resetRefetch: () => void;
    currentSort: SortOption,
    searchTerm: string
}

const LANE_HEADERS = [{
    label: "TODO",
    value: "TODO"
}, { label: "IN PROGRESS", value: "IN_PROGRESS" }, { label: "DONE", value: "DONE" }]

export default function KanbanBoard({ refetch, resetRefetch, currentSort, searchTerm }: Props) {
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [selectedTaskToEdit, setSelecctedTaskToEdit] = useState<Task>({} as Task);
    const [selectedTaskToDelete, setSelectedTaskToDelete] = useState<Task>({} as Task);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllTasks(currentSort, searchTerm ?? "");
                setColumns(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                if (refetch) {
                    resetRefetch();
                }
            }
        };

        fetchData();
    }, [currentSort, searchTerm, refetch]);



    const findColumn = (unique: string | null) => {
        if (!unique) {
            return null;
        }
        if (columns?.some((c) => c.status === unique)) {
            return columns?.find((c) => c.status === unique) ?? null;
        }
        const id = String(unique);
        const itemWithColumnId = columns?.flatMap((c) => {
            const columnId = c.status;
            return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
        });
        const columnId = itemWithColumnId?.find((i) => i.itemId === id)?.columnId;
        return columns?.find((c) => c.status === columnId) ?? null;
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over, delta } = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : null;
        const activeColumn = findColumn(activeId);
        const overColumn = findColumn(overId);
        if (!activeColumn || !overColumn || activeColumn === overColumn) {
            return null;
        }
        setColumns((prevState) => {
            const activeItems = activeColumn.cards;
            const overItems = overColumn.cards;
            const activeIndex = activeItems.findIndex((i) => i.id === activeId);
            const overIndex = overItems.findIndex((i) => i.id === overId);
            const newIndex = () => {
                const putOnBelowLastItem =
                    overIndex === overItems.length - 1 && delta.y > 0;
                const modifier = putOnBelowLastItem ? 1 : 0;
                return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            };
            return prevState.map((c) => {
                if (c.status === activeColumn.status) {
                    c.cards = activeItems.filter((i) => i.id !== activeId);
                    return c;
                } else if (c.status === overColumn.status) {
                    c.cards = [
                        ...overItems.slice(0, newIndex()),
                        activeItems[activeIndex],
                        ...overItems.slice(newIndex(), overItems.length)
                    ];
                    return c;
                } else {
                    return c;
                }
            });
        });
    };
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : null;
        const activeColumn = findColumn(activeId);
        const overColumn = findColumn(overId);

        if (!activeColumn || !overColumn) {
            return null;
        }
        updateStatus({ id: activeId, status: overColumn.status });
        if (activeColumn !== overColumn) {
            setColumns((prevState) => {
                const newColumns = prevState.map(column => {
                    if (column.status === activeColumn.status) {
                        // Remove card from old column
                        return {
                            ...column,
                            cards: column.cards.filter(card => card.id !== activeId)
                        };
                    }
                    if (column.status === overColumn.status) {
                        // Add card to new column
                        const movingCard = activeColumn.cards.find(card => card.id === activeId);
                        if (movingCard) {
                            return {
                                ...column,
                                cards: [...column.cards, { ...movingCard, status: overColumn.status }]
                            };
                        }
                    }
                    return column;
                });
                return newColumns;
            });
            return;
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    const handleDelete = ({ id, description, title }: CardType) => {
        setSelectedTaskToDelete({ id, description, title } as Task);
        setOpenDeleteModal(true);
    }

    const handleEdit = ({ id, description, title }: CardType) => {
        setOpenEditModal(true);
        setSelecctedTaskToEdit({ id, description, title } as Task);
    }

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelecctedTaskToEdit({} as Task);
    }

    const onEditTask = (task: Task) => {
        updateTask(task).then(() => {
            setOpenEditModal(false);
            setSelecctedTaskToEdit({} as Task);
            fetchAllTasks(currentSort, searchTerm ?? "").then((data) => {
                setColumns(data);

            });
        })
    }
    const onDeleteTask = (task: Task) => {
        deleteTask({ id: task?.id ?? "" }).then(() => {
            setOpenDeleteModal(false);
            setSelectedTaskToDelete({} as Task);
            fetchAllTasks(currentSort, searchTerm ?? "").then((data) => {
                setColumns(data);

            });
        })
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <div
                    className="App"
                    style={{ display: "flex", flexDirection: "row", padding: "20px" }}
                >
                    {LANE_HEADERS.map((column) => (
                        <Column
                            key={column.value}
                            id={column.value}
                            title={column.label}
                            cards={columns.find((data: ColumnType) => data.status === column.value)?.cards ?? []}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            </DndContext>
            <EditModal isOpen={openEditModal} onClose={handleCloseEditModal} onSave={onEditTask} task={selectedTaskToEdit} />
            <DeleteModal isOpen={openDeleteModal} onClose={handleCloseDeleteModal} onDelete={onDeleteTask} task={selectedTaskToDelete} />
        </>
    );
}
