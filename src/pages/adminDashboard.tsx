import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import Head from "next/head";

const AdminDashboard = () => {
  const [queries, setQueries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [view, setView] = useState<"users" | "queries">("users");
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // Added missing state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAssignedQueries();
    fetchAllUsers();
  }, []);

  const fetchAssignedQueries = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingQueries(true);
      const response = await fetch("https://student-query-system.onrender.com/api/queries/getQueries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      } else {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to fetch queries");
      }
    } catch (err) {
      setError("Error fetching queries. Please try again later.");
      console.error(err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const fetchAllUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingUsers(true);
      const response = await fetch("https://student-query-system.onrender.com/api/admin/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching users. Please try again later.");
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (!confirm("Are you sure you want to delete this user?")) return;

      const response = await fetch(`https://student-query-system.onrender.com/api/admin/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Error deleting user. Please try again later.");
      console.error(err);
    }
  };

  const filteredUsers = selectedRole === "all" ? users : users.filter((user) => user.role === selectedRole);
  const filteredQueries =
    filterStatus === "all" ? queries : queries.filter((query) => query.status === filterStatus);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <Navbar title="Admin Dashboard" />

      <div className="p-6">
        {/* Toggle Views */}
        <div className="mb-6 flex justify-between items-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => router.push("/createUser")}
          >
            Create New User
          </button>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded shadow ${
                view === "users"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setView("users")}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 rounded shadow ${
                view === "queries"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setView("queries")}
            >
              Queries
            </button>
          </div>
        </div>

        {view === "users" && (
          <>
            {/* Filter Users */}
            <div className="mb-4">
              <label htmlFor="roleFilter" className="block text-gray-700 font-medium mb-2">
                Filter Users by Role:
              </label>
              <select
                id="roleFilter"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All</option>
                <option value="student">Student</option>
                <option value="resolver">Resolver</option>
                <option value="investigator">Investigator</option>
              </select>
            </div>

            {/* Display Users */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
              {loadingUsers ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-gray-700">No users found</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                      <p className="text-gray-600">Role: {user.role}</p>
                      <button
                        className="bg-red-500 text-white px-4 py-2 mt-2 rounded shadow hover:bg-red-600"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete User
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {view === "queries" && (
          <>
            {/* Filter Queries */}
<div className="mb-4">
  <label htmlFor="statusFilter" className="block text-gray-700 font-medium mb-2">
    Filter Queries by Status:
  </label>
  <select
    id="statusFilter"
    className="w-full p-2 border border-gray-300 rounded"
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="all">All</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Under Investigation">Under Investigation</option>
    <option value="Approved">Approved</option>
  </select>
</div>

            {/* Display Queries */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Queries</h2>
              {loadingQueries ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="text-gray-700">No queries available</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQueries.map((query) => (
                    <div key={query.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">{query.title}</h2>
                      <p className="text-gray-600 mt-2 line-clamp-2">{query.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;



