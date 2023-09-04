import { useState, useEffect, useRef, useMemo } from "react"
import { SortBy, type User } from "./types"
import UserTable from "./Components/UserTable"

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [colorRows, setColorRows] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok")
        }
        return await res.json()
      })
      .then((res) => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((users) => {
          return users.location.country.toLowerCase().includes(filterCountry.toLowerCase())
        })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers

    let sortedFn = (a: User, b: User) => a.location.country.localeCompare(b.location.country)

    if (sorting === SortBy.NAME) {
      sortedFn = (a, b) => a.name.first.localeCompare(b.name.first)
    }

    if (sorting === SortBy.LAST) {
      sortedFn = (a, b) => a.name.last.localeCompare(b.name.last)
    }
    return filteredUsers.toSorted(sortedFn)
  }, [filteredUsers, sorting])

  const toggleColorRows = () => {
    setColorRows(!colorRows)
  }

  const toggleSortByCountry = () => {
    const newSorting = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSorting)
  }

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => {
      return user.login.uuid !== uuid
    })
    setUsers(filteredUsers)
  }

  const handleRecoverUsers = () => {
    setUsers(originalUsers.current)
  }

  const handleSortChanged = (sort: SortBy) => {
    setSorting(sort)
  }

  return (
    <div className="p-4 w-full flex flex-col justify-center items-center">
      <header className="flex gap-2 py-2 items-center mx-auto">
        <button
          onClick={toggleColorRows}
          className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-500 transition-colors"
        >
          Color Rows
        </button>
        <button
          onClick={toggleSortByCountry}
          className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-500 transition-colors"
        >
          Sort By Country
        </button>
        <button
          onClick={handleRecoverUsers}
          className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-500 transition-colors"
        >
          Reset
        </button>

        <input
          type="text"
          name="country"
          placeholder="Filter by country"
          className="px-2 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
          onChange={(e) => setFilterCountry(e.target.value)}
        />
        <p>Showing: {sortedUsers.length}</p>
      </header>
      <main className="w-full flex justify-center">
        <UserTable
          users={sortedUsers}
          colorRows={colorRows}
          handleDelete={handleDelete}
          handleSortChanged={handleSortChanged}
        />
      </main>
    </div>
  )
}

export default App
