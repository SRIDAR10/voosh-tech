import { FC, MouseEvent } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export type CardPropsType = {
    id: string;
    title: string;
    description ?: string,
    handleDelete: ({id, description, title} : CardType) => void;
    handleEdit: ({id, description, title} : CardType) => void;
};

export type CardType = {
    id: string;
    title: string;
    description ?: string;
};

const KanbanCard: FC<CardPropsType> = ({ id, title, description, handleDelete, handleEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleDeleteClick = (e: MouseEvent) => {
        e.preventDefault();
        handleDelete({title : title , description : description ?? "", id : id});
    };

    const handleEditClick = (e: MouseEvent) => {
        e.preventDefault();
        handleEdit({title : title , description : description ?? "", id : id});
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="m-3 bg-blue-200 p-2 opacity-[1] rounded-lg"
        >
            <div 
                {...attributes} 
                {...listeners}
                className="cursor-move mb-2"
            >
                {title}
            </div>
            <div id={id} className="flex items-end justify-end gap-2">
                <button 
                    className="text-white border bg-[#f44336] rounded p-1 px-2" 
                    onClick={handleDeleteClick}
                >
                    Delete
                </button>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white border border-blue-700 rounded p-1 px-2" 
                    onClick={handleEditClick}
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default KanbanCard;