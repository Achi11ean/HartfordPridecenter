// Volunteers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

export default function Volunteers() {
const { prideId, role, isAdmin, isStaff } = useAuth();

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  // ─────────────────────────────────────────────
  // Fetch Volunteers
  // ─────────────────────────────────────────────
  const fetchVolunteers = async () => {
    if (!prideId) {
      console.warn("[Volunteers] No prideId, abort fetch");
      return;
    }

    console.log("[Volunteers] Fetching for prideId:", prideId);

    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/volunteers`
      );

      console.log("[Volunteers] Fetch response:", res.data);
      setVolunteers(res.data || []);
    } catch (err) {
      console.error("[Volunteers] Fetch error:", err);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  console.log("🔥 Volunteers mounted", {
    prideId,
    role,
  });

  if (prideId) fetchVolunteers();
}, [prideId]);


  // ─────────────────────────────────────────────
  // Open Edit
  // ─────────────────────────────────────────────
  const openEdit = (v) => {
    console.log("[Volunteers] Open edit:", v);

    setEditingId(v.id);
    setEditForm({
      name: v.name,
      email: v.email,
      phone: v.phone || "",
      interest: v.interest,
      message: v.message || "",
    });
  };

  // ─────────────────────────────────────────────
  // Save Edit (PATCH)
  // ─────────────────────────────────────────────
  const saveEdit = async () => {
    console.log("[Volunteers] Saving edit:", {
      id: editingId,
      payload: editForm,
    });

    try {
      const res = await axios.patch(
        `${API}/volunteers/${editingId}`,
        {
          ...editForm,
        }
      );

      console.log("[Volunteers] PATCH response:", res.data);

      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === editingId ? res.data.volunteer : v
        )
      );

      toast.success("Volunteer updated");
      setEditingId(null);
    } catch (err) {
      console.error("[Volunteers] PATCH error:", err);
      toast.error(err.response?.data?.error || "Update failed");
    }
  };


  const deleteVolunteer = async (vid) => {
    if (!window.confirm("Delete this volunteer submission?")) return;

    console.log("[Volunteers] Deleting volunteer:", vid);

    try {
      await axios.delete(
        `${API}/volunteers/${vid}`,
  
      );

      console.log("[Volunteers] Delete success:", vid);

      setVolunteers((prev) =>
        prev.filter((v) => v.id !== vid)
      );

      toast.success("Volunteer submission deleted");
    } catch (err) {
      console.error("[Volunteers] DELETE error:", err);
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center text-yellow-300 py-10">
        Loading volunteer submissions…
      </div>
    );
  }

  return (
  <div className="space-y-10">

    {/* HEADER */}
    <div className="flex flex-wrap items-center justify-between gap-5">

      <div className="flex items-center flex-1 gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-yellow-500" />

        <div className="px-7 py-3 rounded-full border border-yellow-400/30 bg-gradient-to-r from-yellow-500/15 to-orange-500/10 backdrop-blur-xl shadow-[0_0_35px_rgba(255,210,70,.15)]">
          <h2 className="text-xl md:text-3xl font-black tracking-[0.25em] uppercase text-yellow-300">
            🤝 Volunteer Submissions
          </h2>
        </div>

        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-yellow-400/40 to-yellow-500" />
      </div>

      <div className="px-5 py-3 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.35em] text-yellow-400">
          Applications
        </div>

        <div className="text-3xl font-black text-white">
          {volunteers.length}
        </div>
      </div>

    </div>

    {volunteers.length === 0 ? (

      <div
        className="
          rounded-[2rem]
          overflow-hidden
          border border-yellow-400/20
          bg-gradient-to-br
          from-yellow-400/10
          via-black
          to-orange-500/10
          backdrop-blur-xl
          shadow-2xl
          p-16
          text-center
        "
      >
        <div className="text-7xl mb-6">🙋</div>

        <h3 className="text-3xl font-black text-yellow-300">
          No Volunteer Applications
        </h3>

        <p className="mt-4 text-yellow-100/70 max-w-lg mx-auto">
          When community members volunteer for your event they'll appear here
          beautifully organized.
        </p>

      </div>

    ) : (

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {volunteers.map((v) => (

          <div
            key={v.id}
            className="
              group
              relative
              overflow-hidden
              rounded-[2rem]
              border border-yellow-400/15
              bg-gradient-to-br
              from-yellow-500/10
              via-slate-950
              to-orange-500/10
              backdrop-blur-xl
              shadow-[0_30px_70px_rgba(0,0,0,.55)]
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-yellow-400/40
            "
          >

            {/* magical glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,.16),transparent_45%)]" />

            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(255,215,0,.20),transparent_12%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,.08),transparent_10%)]" />

            <div className="relative z-10 p-7">

              {editingId === v.id ? (

                <>
                  <div className="grid md:grid-cols-2 gap-4">

                    {["name","email","phone","interest"].map((field)=>(
                      <input
                        key={field}
                        value={editForm[field]}
                        onChange={(e)=>
                          setEditForm(prev=>({
                            ...prev,
                            [field]:e.target.value
                          }))
                        }
                        placeholder={field.toUpperCase()}
                        className="
                          rounded-2xl
                          p-4
                          bg-black/40
                          border border-yellow-400/20
                          text-yellow-100
                          placeholder:text-yellow-600
                          focus:border-yellow-400
                          focus:outline-none
                        "
                      />
                    ))}

                  </div>

                  <textarea
                    rows={5}
                    value={editForm.message}
                    onChange={(e)=>
                      setEditForm(prev=>({
                        ...prev,
                        message:e.target.value
                      }))
                    }
                    className="
                      w-full
                      mt-5
                      rounded-3xl
                      p-5
                      bg-black/40
                      border border-yellow-400/20
                      text-yellow-100
                      placeholder:text-yellow-600
                    "
                    placeholder="Volunteer Message..."
                  />

                  <div className="grid grid-cols-2 gap-4 mt-6">

                    <button
                      onClick={saveEdit}
                      className="
                        py-4
                        rounded-2xl
                        bg-gradient-to-r
                        from-green-300
                        via-lime-400
                        to-green-500
                        text-black
                        font-black
                        hover:scale-105
                        transition
                      "
                    >
                      💾 Save Changes
                    </button>

                    <button
                      onClick={()=>setEditingId(null)}
                      className="
                        py-4
                        rounded-2xl
                        bg-white/10
                        border border-white/20
                        text-white
                        font-bold
                      "
                    >
                      Cancel
                    </button>

                  </div>

                </>

              ) : (

                <>

                  {/* TOP */}

                  <div className="flex items-start gap-5">

                    <div
                      className="
                        relative
                        h-20
                        w-20
                        rounded-full
                        bg-gradient-to-br
                        from-yellow-200
                        via-amber-400
                        to-orange-600
                        ring-4
                        ring-yellow-400/20
                        shadow-[0_0_35px_rgba(255,210,70,.35)]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >

                      <div className="absolute inset-1 rounded-full bg-black/15" />

                      <span className="relative text-3xl font-black text-white">
                        {v.name?.charAt(0).toUpperCase()}
                      </span>

                    </div>

                    <div className="flex-1">

                      <div className="flex justify-between items-start gap-3">

                        <div>

                          <h3 className="text-2xl font-black text-yellow-300">
                            {v.name}
                          </h3>

                          <p className="text-yellow-100/60">
                            Volunteer Applicant
                          </p>

                        </div>

                        <div className="px-4 py-2 rounded-full bg-yellow-500/15 border border-yellow-400/25 text-yellow-300 font-bold text-sm whitespace-nowrap">
                          🎯 {v.interest}
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* CONTACT */}

                  <div className="grid grid-cols-2 gap-4 mt-7">

                    <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">

                      <div className="text-xs uppercase tracking-widest text-blue-300">
                        Email
                      </div>

                      <div className="mt-2 text-blue-100 break-all">
                        {v.email}
                      </div>

                    </div>

                    <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-4">

                      <div className="text-xs uppercase tracking-widest text-green-300">
                        Phone
                      </div>

                      <div className="mt-2 text-green-100">
                        {v.phone || "Not Provided"}
                      </div>

                    </div>

                  </div>

                  {/* MESSAGE */}

                  {v.message && (

                    <div className="mt-7">

                      <div className="flex items-center gap-3 mb-3">

                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

                        <div className="text-xs tracking-[0.35em] uppercase text-yellow-500 font-bold">
                          Volunteer Story
                        </div>

                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

                      </div>

                      <div className="
                        rounded-[1.75rem]
                        border border-yellow-500/10
                        bg-gradient-to-br
                        from-white/5
                        to-white/[0.02]
                        p-6
                      ">

                        <p className="italic text-yellow-100 leading-8">
                          "{v.message}"
                        </p>

                      </div>

                    </div>

                  )}

                  {/* BUTTONS */}

                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <button
                      onClick={()=>openEdit(v)}
                      className="
                        py-4
                        rounded-2xl
                        font-black
                        bg-gradient-to-r
                        from-cyan-300
                        via-sky-400
                        to-blue-500
                        text-black
                        hover:scale-105
                        transition
                      "
                    >
                      ✏️ Edit Application
                    </button>

                    <button
                      onClick={()=>deleteVolunteer(v.id)}
                      className="
                        py-4
                        rounded-2xl
                        font-black
                        bg-gradient-to-r
                        from-red-500
                        via-rose-600
                        to-red-700
                        text-white
                        hover:scale-105
                        transition
                      "
                    >
                      🗑 Remove
                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        ))}

      </div>

    )}

  </div>
);
}
