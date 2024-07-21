import Modal from "../utils/components/Modal";
import { Task } from "../kanban/KanbanBoard";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (task : Task) => void;
    task : Task

}

const DeleteModal = ({ isOpen, onClose, onDelete, task }: Props) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Task">
            <div className="flex flex-col gap-4">
                Are you sure you want to delete this task?
                <div className="gap-2 w-full flex justify-end">
                    <button onClick={onClose} className="border p-1 px-4 rounded-lg">Cancel</button>
                    <button onClick={()=>onDelete(task)} className="border bg-red-600 text-white p-1 px-4">Delete</button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteModal;