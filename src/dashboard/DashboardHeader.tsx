
export type SortOption = 'createdAsc' | 'createdDesc' | 'updatedAsc' | 'updatedDesc';

type Props = {
    searchTerm: string;
    handleSearch: (text: string) => void;
    handleAddTask: () => void;
    handleSort: (option: SortOption) => void;
    currentSort: SortOption;
}

const DashboardHeader = ({ searchTerm, handleSearch, handleAddTask, handleSort, currentSort  }: Props) => {
    return (
        <div className='flex shadow-md p-4 gap-3 items-center'>
            <span className="font-semibold">Search : </span>
            <input onChange={(e) => handleSearch(e.target.value ?? "")} value={searchTerm} className="border p-1 w-[360px]" placeholder="Search..." />
            <button onClick={handleAddTask} className="bg-blue-500 hover:bg-blue-700 text-white border border-blue-700 rounded p-1 px-2" >Add Task</button>
            <div className="ml-4">
                <span className="font-semibold mr-2">Sort by:</span>
                <select 
                    value={currentSort} 
                    onChange={(e) => handleSort(e.target.value as SortOption)}
                    className="border p-1"
                >
                    <option value="createdAsc">Created Date (Oldest first)</option>
                    <option value="createdDesc">Created Date (Newest first)</option>
                    <option value="updatedAsc">Updated Date (Oldest first)</option>
                    <option value="updatedDesc">Updated Date (Newest first)</option>
                </select>
            </div>
        </div>
    )
}

export default DashboardHeader;