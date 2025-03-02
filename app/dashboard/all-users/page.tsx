"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/context/AuthContext"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  status: string
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    status: "active",
  },
  {
    id: "2",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    status: "inactive",
  },
  {
    id: "3",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    status: "pending",
  },
]

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    // In the future, replace this with an actual API call
    setUsers(mockUsers)
  }, [user, router])

  const handleDelete = async (id: string) => {
    try {
      // Simulated API call
      // await fetch(`/api/users/${id}`, { method: 'DELETE' });

      // Update local state
      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "User Deleted",
        description: "The user account has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete the user account. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <Button onClick={() => handleDelete(user.id)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

