import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";

export default function PastNewsletters({ prideId }) {

  const [list, setList] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    axios
      .get(`${API}/api/pride/${prideId}/newsletters`)
      .then(r => setList(r.data));
  };

  useEffect(() => {
    load();
  }, [prideId]);


  const openDetail = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      setSelected(null);
      return;
    }

    const r = await axios.get(`${API}/api/pride/${prideId}/newsletter/${id}`);
    setSelected(r.data);
    setExpanded(id);
  };


  const deleteItem = async (id) => {
    if (!window.confirm("Delete this newsletter permanently?")) return;
    setDeleting(id);

    try {
      await axios.delete(`${API}/api/pride/${prideId}/newsletter/${id}`);
      setExpanded(null);
      setSelected(null);
      setDeleting(null);
      load();
    } catch {
      alert("Delete failed");
      setDeleting(null);
    }
  };


  return (
    <div className="space-y-4">
      {list.map(n => (
        <div
          key={n.id}
          className="bg-black/50 border border-yellow-500/30 rounded-xl p-4"
        >

          {/* summary row */}
          <div
            className="cursor-pointer hover:bg-black/60 transition rounded-lg p-2"
            onClick={() => openDetail(n.id)}
          >
            <h3 className="text-xl text-yellow-300 font-bold">
              {n.title}
            </h3>

            {n.image_url && (
              <img
                src={n.image_url}
                className="w-full h-32 rounded-lg mt-2 shadow-xl object-cover"
                alt=""
              />
            )}
          </div>

          {/* delete button */}
          <button
            onClick={() => deleteItem(n.id)}
            disabled={deleting === n.id}
            className="
              mt-4 px-4 py-2
              bg-red-500/80 hover:bg-red-600
              text-white font-bold text-sm rounded-lg
              shadow-md transition
            "
          >
            {deleting === n.id ? "Deleting..." : "Delete Newsletter"}
          </button>


          {/* expanded detail */}
          {expanded === n.id && selected && (
            <div className="mt-4 text-yellow-100 space-y-3">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {selected.description}
              </p>

              {selected.contact_email && (
                <p className="text-xs opacity-70">
                  Contact: {selected.contact_email}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
