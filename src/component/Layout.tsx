import { Search, Trash2Icon } from "lucide-react";
import { useDeleteUser, useUsers } from "../hook/useUserHook";
import { MyDialog } from "./Dialog";
import { useState } from "react";
import { useDebounce } from "../hook/useDebounce";
import { AddUserForm } from "./userForm";
import { EditUserForm } from "./editUserForm";
import { notify } from "../lib/notify";
import { Toaster } from "react-hot-toast";

export const TableDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: users, isLoading, isError } = useUsers(page, limit, debouncedSearchTerm);
  const deleteUser = useDeleteUser();

  function handleDelete(id: string, name: string) {
    deleteUser.mutate(id, {
      onError: () => {
        notify({
          message: "Failed to delete user.",
          type: "error",
          duration: 4000,
          position: "top-right",
        });
      },
      onSuccess: () => {
        notify({
          message: `${name} has successfully been deleted`,
          type: 'success',
          duration: 4000,
          position: 'top-right'
        });
      }
    });
  }

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (isError) return <div className="text-red-500 text-center p-4">Error fetching users</div>;
  if (!users || !users.data || users.data.length === 0) return <div className="text-gray-500 text-center p-4">No users found</div>;

  return (
    <div className="w-full max-w-full overflow-hidden px-2 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 justify-between">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddUserForm />
      </div>

      <div className="overflow-x-auto shadow ring-1 ring-gray-200 ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Name
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Email
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Role
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Status
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.data.map((person) => (
              <tr key={person._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-2 sm:ml-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px]">
                        {person.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[80px] sm:max-w-[120px]">
                    {person.email}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} `}>
                    {person.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} `}>
                    {person.isActive ? 'Active' : 'Nill'}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1 sm:space-x-2 items-center">
                    <EditUserForm user={person} />
                    <MyDialog 
                      openText={<Trash2Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 hover:text-red-900 cursor-pointer" />} 
                      onConfirm={() => handleDelete(person?._id ?? '', person.name)} 
                      warning={`Are you sure you want to delete ${person.name}?`} 
                      description="This action cannot be undone." 
                      onClose={() => {}} 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.total > limit && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 p-2 sm:px-6 sm:py-3 bg-white border-t border-gray-200">
          <div className="w-full sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, users.total)}</span> of{' '}
                <span className="font-medium">{users.total}</span> results
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= users.total}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      <Toaster/>
    </div>
  );
};