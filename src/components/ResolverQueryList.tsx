// components/ResolverQueryList.tsx
import { useEffect, useState } from "react";
import { getAssignedQueries, updateQueryStatus, addInternalNote, addResolutionSummary } from "../services/api";

const ResolverQueryList = () => {
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [internalNote, setInternalNote] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const data = await getAssignedQueries();
        setQueries(data);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, []);

  const handleStatusChange = async (queryId: string, status: string) => {
    try {
      await updateQueryStatus(queryId, status);
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query.id === queryId ? { ...query, status } : query
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddNote = async (queryId: string) => {
    try {
      await addInternalNote(queryId, internalNote);
      setInternalNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleAddResolutionSummary = async (queryId: string) => {
    try {
      await addResolutionSummary(queryId, resolutionSummary);
      setResolutionSummary("");
    } catch (error) {
      console.error("Error adding resolution summary:", error);
    }
  };

  return (
    <div className="space-y-4">
      {queries.map((query) => (
        <div key={query.id} className="p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-semibold">{query.title}</h3>
          <p>{query.description}</p>
          <p>Status: {query.status}</p>

          <div className="space-x-2">
            <button
              onClick={() => handleStatusChange(query.id, "In Progress")}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Mark In Progress
            </button>
            <button
              onClick={() => handleStatusChange(query.id, "Resolved")}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Mark Resolved
            </button>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Add Internal Note:</h4>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
            <button
              onClick={() => handleAddNote(query.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
            >
              Add Note
            </button>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Add Resolution Summary:</h4>
            <textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
            <button
              onClick={() => handleAddResolutionSummary(query.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
            >
              Add Summary
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResolverQueryList;