import { SortBy, type User } from "../types"

interface Props {
  users: User[]
  colorRows: boolean
  handleDelete: (uuid: string) => void
  handleSortChanged: (sort: SortBy) => void
}

const UserTable = ({ users, colorRows, handleDelete, handleSortChanged }: Props) => {
  return (
    <table className="w-[80%] table-auto border-collapse border border-silver">
      <thead className="bg-silver">
        <tr>
          <th className="px-4 py-2">Picture</th>
          <th className="px-4 py-2 cursor-pointer" onClick={() => handleSortChanged(SortBy.NAME)}>
            First Name
          </th>
          <th className="px-4 py-2 cursor-pointer" onClick={() => handleSortChanged(SortBy.LAST)}>
            Last Name
          </th>
          <th className="px-4 py-2 cursor-pointer" onClick={() => handleSortChanged(SortBy.COUNTRY)}>
            Country
          </th>
          <th className="px-4 py-2">Delete</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr
            key={user.email}
            className={`${
              index % 2 === 0 && colorRows ? "bg-gray-300" : "bg-gray-200"
            } hover:bg-gray-500 transition-colors`}
          >
            <td className="px-4 py-2">
              <img src={user.picture.medium} alt="Profile Photo" className="w-12 h-12 rounded-full mx-auto" />
            </td>
            <td className="px-4 py-2 text-center">{user.name.first}</td>
            <td className="px-4 py-2 text-center">{user.name.last}</td>
            <td className="px-4 py-2 text-center">{user.location.country}</td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={() => handleDelete(user.login.uuid)}
                className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserTable
