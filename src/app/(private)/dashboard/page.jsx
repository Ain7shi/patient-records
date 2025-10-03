"use client";

import { useState, useEffect } from "react";
import client from "@/api/client";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    patientName: "",
    patientChart: "",
    patientMedication: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all records
  const fetchRecords = async () => {
    const { data, error } = await client.from("patient_records").select("*");
    if (error) console.error("Fetch failed:", error);
    else setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Create
  const createRecord = async () => {
    setLoading(true);
    const { error } = await client.from("patient_records").insert([newRecord]);
    if (error) {
      console.error("Insert failed:", error);
    } else {
      setNewRecord({ patientName: "", patientChart: "", patientMedication: "" });
      fetchRecords();
    }
    setLoading(false);
  };

  // Update
  const updateRecord = async (id) => {
    setLoading(true);
    const { error } = await client
      .from("patient_records")
      .update(newRecord)
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error);
    } else {
      setEditingId(null);
      setNewRecord({ patientName: "", patientChart: "", patientMedication: "" });
      fetchRecords();
    }
    setLoading(false);
  };

  // Delete
  const deleteRecord = async (id) => {
    const { error } = await client.from("patient_records").delete().eq("id", id);
    if (error) console.error("Delete failed:", error);
    else fetchRecords();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Patient Records</h1>

        {/* Input fields */}
        <div className="flex flex-col gap-4 mb-6">
          <input
            className="border p-2 rounded text-black placeholder-gray-500"
            type="text"
            placeholder="Patient Name"
            value={newRecord.patientName}
            onChange={(e) =>
              setNewRecord({ ...newRecord, patientName: e.target.value })
            }
          />
          <input
            className="border p-2 rounded text-black placeholder-gray-500"
            type="text"
            placeholder="Patient Chart"
            value={newRecord.patientChart}
            onChange={(e) =>
              setNewRecord({ ...newRecord, patientChart: e.target.value })
            }
          />
          <input
            className="border p-2 rounded text-black placeholder-gray-500"
            type="text"
            placeholder="Patient Medication"
            value={newRecord.patientMedication}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                patientMedication: e.target.value,
              })
            }
          />

          {editingId ? (
            <button
              onClick={() => updateRecord(editingId)}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Record"}
            </button>
          ) : (
            <button
              onClick={createRecord}
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Record"}
            </button>
          )}
        </div>

        {/* Records list */}
        <ul className="space-y-3">
          {records.map((rec) => (
            <li
              key={rec.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">{rec.patientName}</p>
                <p className="text-sm text-gray-600">{rec.patientChart}</p>
                <p className="text-sm text-gray-600">
                  {rec.patientMedication}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(rec.id);
                    setNewRecord({
                      patientName: rec.patientName,
                      patientChart: rec.patientChart,
                      patientMedication: rec.patientMedication,
                    });
                  }}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRecord(rec.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Sign out */}
        <div className="mt-6">
          <button
            onClick={() => client.auth.signOut()}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
