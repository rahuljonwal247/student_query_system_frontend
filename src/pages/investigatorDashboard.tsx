 import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

// Define the structure of a query
interface Query {
  id: string;
  title: string;
  description: string;
  status: string;
  student: {
    name: string;
  };
  resolver: {
    name: string;
  };
}

const InvestigatorDashboard = () => {
  // Use specific types instead of 'any'
  const [queries, setQueries] = useState<Query[]>([]); // Queries state, typed as an array of Query objects
  const [loading, setLoading] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null); // selectedQuery can either be a Query object or null

  useEffect(() => {
    fetchAssignedQueries();
  }, []);

  const fetchAssignedQueries = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("https://student-query-system.onrender.com/api/queries/getQueries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response ", response);
      if (response.ok) {
        const data: Query[] = await response.json(); // Type the response data as an array of Query objects
        setQueries(data);
      } else {
        throw new Error("Failed to fetch queries");
      }
    } catch (err) {
      console.error("Error fetching assigned queries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (queryId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://student-query-system.onrender.com/api/queries/approveQuery/${queryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAssignedQueries(); // Refresh the queries after approval
        setSelectedQuery(null); // Close the details view
      } else {
        console.error("Error approving query");
      }
    } catch (err) {
      console.error("Error in approve action:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        title="Investigator Dashboard"
        onQueriesClick={function (): void {
          throw new Error("Function not implemented.");
        }}
        onAddQueryClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Investigator Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {queries.map((query) => (
                <div
                  key={query.id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
                  onClick={() => setSelectedQuery(query)} // Handle query click
                >
                  <h2 className="text-xl font-semibold text-gray-800">{query.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">{query.description}</p>
                  <p className="text-gray-500 mt-1">Status: {query.status}</p>
                </div>
              ))}
            </div>

            {/* Show query details when a query is selected */}
            {selectedQuery && (
              <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                  <h2 className="text-2xl font-semibold text-gray-800">{selectedQuery.title}</h2>
                  <p className="text-gray-600 mt-2">{selectedQuery.description}</p>
                  <p className="text-gray-800 mt-4">
                    <strong>Student Name:</strong> {selectedQuery.student.name}
                  </p>
                  <p className="text-gray-800 mt-2">
                    <strong>Resolver Name:</strong> {selectedQuery.resolver.name}
                  </p>
                  <p className="text-gray-800 mt-2">
                    <strong>Status:</strong> {selectedQuery.status}
                  </p>

                  {/* Approve Button - Show only if status is "Under Investigation" */}
                  {selectedQuery.status === "Under Investigation" && (
                    <div className="mt-6">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleApprove(selectedQuery.id)}
                      >
                        Approve
                      </button>
                    </div>
                  )}

                  <button
                    className="mt-4 bg-gray-300 text-black px-4 py-2 rounded-md"
                    onClick={() => setSelectedQuery(null)} // Close the details view
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigatorDashboard;
