import { useState } from "react";
import Modal from "../utils/components/Modal";
import { Task } from "../kanban/KanbanBoard";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
}

const AddModal = ({ isOpen, onClose, onSave }: Props) => {
    const [enteredTitle, setEnteredTitle] = useState<string>("");
    const [enteredDescription, setEnteredDescription] = useState<string>("");

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Task">
            <div className="flex flex-col gap-4">
                <span className="font-semibold">Title</span>
                <input onChange={(e) => setEnteredTitle(e.target.value)} value={enteredTitle} className="border p-2" />
                <span className="font-semibold">Description</span>
                <textarea className="border w-full p-3" value={enteredDescription} onChange={(e) => setEnteredDescription(e.target.value)} />
                <div className="gap-2 w-full flex justify-end">
                    <button onClick={onClose} className="border p-1 px-4 rounded-lg">Cancel</button>
                    <button onClick={() => onSave({ title: enteredTitle, description: enteredDescription, status:"TODO" })} className="border bg-blue-600 text-white p-1 px-4">Save</button>
                </div>
            </div>
        </Modal>
    )
}

export default AddModal;