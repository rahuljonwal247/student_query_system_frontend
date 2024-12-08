


// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";

// const StudentDashboard = () => {
//   const [queries, setQueries] = useState<any[]>([]); // Store the list of queries
//   const [newQuery, setNewQuery] = useState({
//     title: "",
//     description: "",
//     attachment: null,
//   }); // Store data for the new query
//   const [error, setError] = useState<string>(""); // Error messages
//   const [loading, setLoading] = useState<boolean>(false); // Loading indicator
//   const [view, setView] = useState<"queries" | "addQuery" | "queryDetails">("queries"); // Manage current view
//   const [selectedQuery, setSelectedQuery] = useState<any | null>(null); // State for the selected query

//   // Function to fetch queries for the student
//   const fetchQueries = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No token found. Please log in again.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch("https://student-query-system.onrender.com/api/queries/getQueries", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,  // Corrected the template string
//         },
//       });

//       // Check if the response is OK (status code 200)
//       if (response.ok) {
//         const data = await response.json();
//         setQueries(data); // Assuming data is the list of queries
//       } else {
//         throw new Error("Failed to load queries");
//       }
//     } catch (err) {
//       console.error("Error fetching queries:", err);
//       setError("Failed to load queries. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle new query submission
//   const handleQuerySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     const formData = new FormData();
//     formData.append("title", newQuery.title);
//     formData.append("description", newQuery.description);
//     if (newQuery.attachment) {
//       formData.append("attachment", newQuery.attachment);
//     }

//     try {
//       setError("");
//       setLoading(true);
//       await axios.post("https://student-query-system.onrender.com/api/queries/CreateQuery", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setNewQuery({ title: "", description: "", attachment: null });
//       fetchQueries(); // Reload queries after submission
//       setView("queries"); // Switch back to query list after adding a query
//     } catch (err) {
//       console.error("Error submitting query:", err);
//       setError("Failed to submit query. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle when a query is clicked
//   const handleQueryClick = (query: any) => {
//     setSelectedQuery(query); // Set the selected query
//     setView("queryDetails"); // Switch to the query details view
//   };

//   // Fetch queries when the component mounts
//   useEffect(() => {
//     fetchQueries();
//   }, []);

//   return (
//     <div>
//       <Navbar
//         title="Student Dashboard"
//         onQueriesClick={() => setView("queries")} // Show query list
//         onAddQueryClick={() => setView("addQuery")} // Show add query form
//       />
//       <div className="p-6">
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {/* Conditional Rendering Based on view */}
//         {view === "queries" && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Your Queries</h2>
//             {loading && <p className="text-gray-500">Loading...</p>}
//             <ul className="space-y-4">
//               {queries.map((query: any) => (
//                 <li
//                   key={query.id}
//                   className="p-4 border rounded shadow cursor-pointer"
//                   onClick={() => handleQueryClick(query)} // Handle click on query
//                 >
//                   <h3 className="text-lg font-semibold">{query.title}</h3>
//                   <p className="text-gray-600">{query.description}</p>
//                   <span
//                     className={`mt-2 inline-block px-2 py-1 text-sm font-medium ${
//                       query.status === "Pending"
//                         ? "bg-yellow-200"
//                         : query.status === "In Progress"
//                         ? "bg-blue-200"
//                         : "bg-green-200"
//                     }`}
//                   >
//                     {query.status}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {view === "addQuery" && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Add Query</h2>
//             <form onSubmit={handleQuerySubmit}>
//               <div className="mb-4">
//                 <label className="block mb-2">Title</label>
//                 <input
//                   type="text"
//                   value={newQuery.title}
//                   onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
//                   className="w-full p-2 border rounded"
//                   placeholder="Enter query title"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2">Description</label>
//                 <textarea
//                   value={newQuery.description}
//                   onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
//                   className="w-full p-2 border rounded"
//                   placeholder="Enter query description"
//                   required
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2">Attachment (optional)</label>
//                 <input
//                   type="file"
//                   onChange={(e) =>
//                     setNewQuery({
//                       ...newQuery,
//                       attachment: e.target.files?.[0] || null,
//                     })
//                   }
//                   className="w-full"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 disabled={loading}
//               >
//                 {loading ? "Submitting..." : "Submit Query"}
//               </button>
//             </form>
//           </div>
//         )}

//         {view === "queryDetails" && selectedQuery && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Query Details</h2>
//             <div className="p-4 border rounded shadow">
//               <h3 className="text-lg font-semibold">{selectedQuery.title}</h3>
//               <p className="text-gray-600">{selectedQuery.description}</p>
//               <div className="mt-4">
//                 <span
//                   className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                     selectedQuery.status === "Pending"
//                       ? "bg-yellow-200 text-yellow-800"
//                       : selectedQuery.status === "In Progress"
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-green-200 text-green-800"
//                   }`}
//                 >
//                   {selectedQuery.status}
//                 </span>
//               </div>
//               {selectedQuery.resolverNote && (
//                 <p className="mt-2 text-gray-700">
//                   <strong>Resolver Note:</strong> {selectedQuery.resolverNote}
//                 </p>
//               )}
//               {selectedQuery.resolutionSummary && (
//                 <p className="mt-2 text-gray-700">
//                   <strong>Resolution Summary:</strong> {selectedQuery.resolutionSummary}
//                 </p>
//               )}
//             </div>
//             <button
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               onClick={() => setView("queries")} // Back to query list
//             >
//               Back to Queries List
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;


import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// Define types for query and the new query state
interface Query {
  id: string;
  title: string;
  description: string;
  status: string;
  resolverNote?: string;
  resolutionSummary?: string;
}

interface NewQuery {
  title: string;
  description: string;
  attachment: File | null;
}

const StudentDashboard = () => {
  const [queries, setQueries] = useState<Query[]>([]); // Store the list of queries
  const [newQuery, setNewQuery] = useState<NewQuery>({
    title: "",
    description: "",
    attachment: null,
  }); // Store data for the new query
  const [error, setError] = useState<string>(""); // Error messages
  const [loading, setLoading] = useState<boolean>(false); // Loading indicator
  const [view, setView] = useState<"queries" | "addQuery" | "queryDetails">("queries"); // Manage current view
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null); // State for the selected query

  // Function to fetch queries for the student
  const fetchQueries = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://student-query-system.onrender.com/api/queries/getQueries", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is OK
      setQueries(response.data); // Assuming data is the list of queries
    } catch (err) {
      console.error("Error fetching queries:", err);
      setError("Failed to load queries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle new query submission
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", newQuery.title);
    formData.append("description", newQuery.description);
    if (newQuery.attachment) {
      formData.append("attachment", newQuery.attachment);
    }

    try {
      setError("");
      setLoading(true);
      await axios.post("https://student-query-system.onrender.com/api/queries/CreateQuery", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewQuery({ title: "", description: "", attachment: null });
      fetchQueries(); // Reload queries after submission
      setView("queries"); // Switch back to query list after adding a query
    } catch (err) {
      console.error("Error submitting query:", err);
      setError("Failed to submit query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle when a query is clicked
  const handleQueryClick = (query: Query) => {
    setSelectedQuery(query); // Set the selected query
    setView("queryDetails"); // Switch to the query details view
  };

  // Fetch queries when the component mounts
  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div>
      <Navbar
        title="Student Dashboard"
        onQueriesClick={() => setView("queries")} // Show query list
        onAddQueryClick={() => setView("addQuery")} // Show add query form
      />
      <div className="p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Conditional Rendering Based on view */}
        {view === "queries" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Queries</h2>
            {loading && <p className="text-gray-500">Loading...</p>}
            <ul className="space-y-4">
              {queries.map((query) => (
                <li
                  key={query.id}
                  className="p-4 border rounded shadow cursor-pointer"
                  onClick={() => handleQueryClick(query)} // Handle click on query
                >
                  <h3 className="text-lg font-semibold">{query.title}</h3>
                  <p className="text-gray-600">{query.description}</p>
                  <span
                    className={`mt-2 inline-block px-2 py-1 text-sm font-medium ${
                      query.status === "Pending"
                        ? "bg-yellow-200"
                        : query.status === "In Progress"
                        ? "bg-blue-200"
                        : "bg-green-200"
                    }`}
                  >
                    {query.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {view === "addQuery" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add Query</h2>
            <form onSubmit={handleQuerySubmit}>
              <div className="mb-4">
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  value={newQuery.title}
                  onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Enter query title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  value={newQuery.description}
                  onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Enter query description"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Attachment (optional)</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewQuery({
                      ...newQuery,
                      attachment: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>
        )}

        {view === "queryDetails" && selectedQuery && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Query Details</h2>
            <div className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{selectedQuery.title}</h3>
              <p className="text-gray-600">{selectedQuery.description}</p>
              <div className="mt-4">
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
              {selectedQuery.resolverNote && (
                <p className="mt-2 text-gray-700">
                  <strong>Resolver Note:</strong> {selectedQuery.resolverNote}
                </p>
              )}
              {selectedQuery.resolutionSummary && (
                <p className="mt-2 text-gray-700">
                  <strong>Resolution Summary:</strong> {selectedQuery.resolutionSummary}
                </p>
              )}
            </div>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setView("queries")} // Back to query list
            >
              Back to Queries List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
