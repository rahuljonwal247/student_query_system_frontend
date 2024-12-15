



import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import io from "socket.io-client";

interface Query {
  id: string;
  title: string;
  description: string;
  status: string;
  resolverNote?: string;
  resolutionSummary?: string;
}

interface Notes {
  [key: string]: string;
}

const ResolverDashboard = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [internalNotes, setInternalNotes] = useState<Notes>({});
  const [resolutionSummaries, setResolutionSummaries] = useState<Notes>({});
  const [resolvedAt, setResolvedAt] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Message state
  const router = useRouter();
  const socket = io("http://localhost:5000"); // Connect to your backend socket server

  useEffect(() => {
    // Fetch queries when the filter changes
    fetchAssignedQueries();

    // Listen for real-time updates on query changes (e.g., when a query's status is updated)
    socket.on("query-updated", (updatedQuery: Query) => {
      setQueries((prevQueries) =>
        prevQueries.map((q) =>
          q.id === updatedQuery.id ? { ...q, status: updatedQuery.status } : q
        )
      );
    });

    // Cleanup socket listeners when the component unmounts
    return () => {
      socket.off("query-updated");
    };
  }, [filter]);

 
  const fetchAssignedQueries = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch("https://student-query-system.onrender.com/api/queries/getQueries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Error: ${response.status} - ${response.statusText}`);
        console.error("Response details:", errorDetails);
        throw new Error("Failed to fetch queries");
      }
  
      const data = await response.json();
      console.log("Fetched data:", data);
      setQueries(data);
    } catch (err) {
      console.error("Error fetching assigned queries:", err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateStatus = async (queryId: string, status: string) => {
    const token = localStorage.getItem("token");
    const currentTime = new Date().toLocaleString();
    try {
      const response = await axios.patch(
        `https://student-query-system.onrender.com/api/queries/updateQueryStatus/${queryId}`,
        {
          status,
          internalNote: internalNotes[queryId] || "",
          resolutionSummary: resolutionSummaries[queryId] || "",
          resolvedAt: currentTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setQueries((prev) =>
          prev.map((q) => (q.id === queryId ? { ...q, status } : q))
        );
        setResolvedAt((prev) => ({ ...prev, [queryId]: currentTime }));
       // setSuccessMessage("Query resolved successfully!");
        setTimeout(() => {
          setSuccessMessage(null); // Clear message after timeout
          setFilter("pending"); // Show the pending queries again
          setSelectedQuery(null); // Deselect the current query
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating query status:", err);
    }
  };

  const sendToInvestigation = async (queryId: string) => {
    const token = localStorage.getItem("token");
    const currentTime = new Date().toLocaleString();
    try {
      const response = await axios.post(
        `https://student-query-system.onrender.com/api/queries/sendToInvestigation/${queryId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Query status updated successfully:", response.data);
      setSuccessMessage("Query sent for investigation!");
      setTimeout(() => {
        setSuccessMessage(null);
        setFilter("pending");
        setSelectedQuery(null);
      }, 2000);
    } catch (err) {
      console.error("Error updating query status:", err);
    }
  };

  const handleInternalNoteChange = (queryId: string, note: string) => {
    setInternalNotes((prev: Notes) => ({ ...prev, [queryId]: note }));
  };

  const handleResolutionSummaryChange = (queryId: string, summary: string) => {
    setResolutionSummaries((prev: Notes) => ({ ...prev, [queryId]: summary }));
  };

  const handleInvestigation = (queryId: string) => {
    sendToInvestigation(queryId);
    setSelectedQuery(null); // Deselect the current query
  };

  const filteredQueries = queries.filter((query) => {
    if (filter === "pending")
      return (
        query.status === "Pending" ||
        query.status === "In Progress" ||
        query.status === "Under Investigation"
      );
    if (filter === "resolved") return query.status === "Resolved";
    return true;
  });

  const handleQueryClick = (query: Query) => {
    if (query.status === "Pending") {
      updateStatus(query.id, "In Progress");
    }
    setSelectedQuery(query);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        title="Resolver Dashboard"
        onQueriesClick={() => setFilter("pending")}
        onAddQueryClick={() => setFilter("resolved")}
      />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Queries
        </h1>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 text-center text-green-500 font-semibold">
            {successMessage}
          </div>
        )}

        {!loading && (
          <div>
            {filter === "pending" && filteredQueries.length === 0 ? (
              <div className="text-center text-red-500 font-semibold">
                No query pending
              </div>
            ) : selectedQuery ? (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {selectedQuery.title}
                </h2>
                <p className="text-gray-600 mb-4">{selectedQuery.description}</p>

                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedQuery.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : selectedQuery.status === "In Progress"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {selectedQuery.status}
                  </span>
                </div>

                {selectedQuery.status === "Resolved" &&
                  resolvedAt[selectedQuery.id] && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p>
                        <strong>Resolved on:</strong> {resolvedAt[selectedQuery.id]}
                      </p>
                    </div>
                  )}

                {selectedQuery.status !== "Resolved" &&
                  selectedQuery.status !== "Under Investigation" && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Resolution Summary
                      </label>
                      <textarea
                        className="w-full p-2 mt-1 border rounded-md"
                        placeholder="Enter resolution summary..."
                        value={resolutionSummaries[selectedQuery.id] || ""}
                        onChange={(e) =>
                          handleResolutionSummaryChange(
                            selectedQuery.id,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}

                <div className="flex justify-between">
                  {selectedQuery.status === "Approved" && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => updateStatus(selectedQuery.id, "Resolved")}
                    >
                      Resolve
                    </button>
                  )}
                  {selectedQuery.status !== "Resolved" &&
                    selectedQuery.status !== "Under Investigation" &&
                    selectedQuery.status !== "Approved" && (
                      <>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          onClick={() =>
                            updateStatus(selectedQuery.id, "Resolved")
                          }
                        >
                          Resolve
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                          onClick={() => handleInvestigation(selectedQuery.id)}
                        >
                          Start Investigation
                        </button>
                      </>
                    )}
                </div>

                <button
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setSelectedQuery(null)}
                >
                  Back to List
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQueries.map((query) => (
                  <div
                    key={query.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-lg"
                    onClick={() => handleQueryClick(query)}
                  >
                    <h2 className="text-xl font-semibold text-gray-800">
                      {query.title}
                    </h2>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {query.description}
                    </p>
                    <div className="mt-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          query.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : query.status === "Resolved"
                            ? "bg-green-200 text-green-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {query.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolverDashboard;
