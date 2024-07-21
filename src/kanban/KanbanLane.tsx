import { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./KanbanCard";

export type ColumnPropsType = {
    id: string;
    title: string;
    cards: CardType[];
    handleDelete: ({id, description, title} : CardType) => void;
    handleEdit: ({id, description, title} : CardType) => void;
};

export type ColumnType = {
    status: string;
    cards: CardType[];
};

const KanbanLane: FC<ColumnPropsType> = ({ id, title, cards, handleDelete, handleEdit }) => {
    const { setNodeRef } = useDroppable({ id: id });
    return (
        <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
            <div
                ref={setNodeRef}
                className="w-[360px] bg-white mr-4 shadow-md h-[calc(100vh-152px)]"
            >
                <p
                    className="bg-blue-500 text-white font-semibold p-3 m-2 rounded-lg"
                >
                    {title}
                </p>
                {cards.map((card) => (
                    <Card key={card.id} id={card.id} title={card.title} description={card.description} handleDelete={handleDelete} handleEdit={handleEdit} />
                ))}
            </div>
        </SortableContext>
    );
};

export default KanbanLane;
