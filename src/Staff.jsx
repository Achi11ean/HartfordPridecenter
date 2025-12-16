import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const API = "https://singspacebackend.onrender.com";
const STAFF_ROLES = [
  "Executive Director",
  "Full-Stack Software Developer",
  "Program Director",
  "Operations Manager",
  "Volunteer Coordinator",
  "Community Outreach Coordinator",
  "Events Coordinator",
  "Fundraising Manager",
  "Development Director",
  "Communications Manager",
  "Marketing & Social Media",
  "Education Coordinator",
  "Youth Program Coordinator",
  "Health & Wellness Coordinator",
  "Advocacy & Policy Lead",
  "Grant Writer",
  "Finance Manager",
  "Office Administrator",
  "Board Member",
  "Intern",
  "Volunteer",
  "Support Staff",
];

const STAFF_ROLE_OPTIONS = STAFF_ROLES.map(r => ({
  value: r,
  label: r,
}));

export default function Staff() {
  const token = localStorage.getItem("prideToken");
  const admin = JSON.parse(localStorage.getItem("prideUser") || "{}");
  const prideId = admin.pride_id;
const formatPhoneNumber = (value) => {
  if (!value) return "";

  // Remove all non-digits
  const digits = value.replace(/\D/g, "").slice(0, 10);

  const len = digits.length;

  if (len < 4) return digits;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/staff`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStaff(res.data || []);
    } catch {
      toast.error("Failed to load staff");
    }
  };

  const saveEdit = async () => {
    try {
      await axios.patch(
        `${API}/api/pride-staff/${editing.id}`,
        editing,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff updated");
      setEditing(null);
      fetchStaff();
    } catch {
      toast.error("Failed to update staff");
    }
  };
const generateStaffBio = async () => {
  if (!editing?.first_name || !editing?.role) {
    toast.error("Name and role are required to generate a bio");
    return;
  }

  try {
    const keyPoints = `
Name: ${editing.first_name} ${editing.last_name}
Role: ${editing.role}

User-written notes to include:
${editing.bio || "(none provided)"}
`;

    const res = await axios.post(
      `${API}/api/pride/generate-bio`,
      {
        key_points: keyPoints,
        role_type: "Pride Staff Member",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditing(prev => ({
      ...prev,
      bio: res.data.bio,
    }));

    toast.success("Bio generated ✨");
  } catch {
    toast.error("Failed to generate bio");
  }
};


  const deactivateStaff = async (id) => {
    if (!window.confirm("Deactivate this staff member?")) return;
    try {
      await axios.patch(
        `${API}/api/pride-staff/${id}`,
        { is_active: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff deactivated");
      fetchStaff();
    } catch {
      toast.error("Failed to deactivate staff");
    }
  };

  // 🔍 Search + split
const filtered = useMemo(() => {
  const q = search.toLowerCase();
  return staff.filter(s =>
    `${s.first_name} ${s.last_name} ${s.role} ${s.username} ${s.email || ""} ${s.phone || ""}`
      .toLowerCase()
      .includes(q)
  );
}, [staff, search]);


  const activeStaff = filtered.filter(s => s.is_active);
  const inactiveStaff = filtered.filter(s => !s.is_active);

  const StaffCard = ({ s, inactive }) => (
    <div
      className={`
        bg-black/60 border rounded-2xl p-5 shadow-xl
        ${inactive ? "border-gray-600 opacity-75" : "border-yellow-500/30"}
      `}
    >
        <div className="justify-center items-center flex">       {s.image_url && (
          <img
            src={s.image_url}
            alt={s.first_name}
            className="w-16 h-16 rounded-xl object-cover border border-yellow-400"
          />
        )}</div>
      <div className="flex gap-4 items-start">
 

        <div className="flex-1">
          <h3 className="text-xl font-bold text-yellow-300">
            {s.first_name} {s.last_name}
          </h3>

          <p className="text-yellow-200">{s.role}</p>

          <p className="text-xs text-yellow-100/70 mt-1">
            Username: <span className="font-mono">{s.username}</span>
          </p>
{s.email && (
  <p className="text-xs text-yellow-100/80 mt-1">
    📧 <a
      href={`mailto:${s.email}`}
      className="underline hover:text-yellow-300"
    >
      {s.email}
    </a>
  </p>
)}

{s.phone && (
  <p className="text-xs text-yellow-100/80 mt-1">
    📞 <a
      href={`tel:${s.phone}`}
      className="underline hover:text-yellow-300"
    >
      {s.phone}
    </a>
  </p>
)}

          <p className="text-xs mt-1">
            Status:{" "}
            <span className={s.is_active ? "text-green-400" : "text-red-400"}>
              {s.is_active ? "Active" : "Inactive"}
            </span>
          </p>

          <p className="text-xs text-yellow-100/50 mt-1">
            Created: {new Date(s.created_at).toLocaleDateString()}
          </p>

          {s.bio && (
            <p className="text-sm italic max-h-[100px] overflow-y-auto text-yellow-100 mt-3">
              “{s.bio}”
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
onClick={() =>
  setEditing({
    ...s,
    role: s.role || "",
  })
}
              className="px-4 py-1 rounded-lg bg-yellow-400 text-black font-bold"
            >
               Edit
            </button>

            {s.is_active && (
              <button
                onClick={() => deactivateStaff(s.id)}
                className="px-4 py-1 rounded-lg bg-red-600 text-white font-bold"
              >
                 Deactivate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-yellow-300">
        👥 Pride Staff
      </h2>

      {/* 🔍 Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search staff by name, role, or username…"
        className="
          w-full max-w-md p-3 rounded-xl
          bg-black/40 border border-yellow-500/40
          text-yellow-100 placeholder-yellow-200/40
        "
      />

      {/* ACTIVE */}
   

      {/* INACTIVE */}
      <section>
        <h3 className="text-xl font-bold text-red-400 mb-4">
          Inactive Staff
        </h3>

        {inactiveStaff.length === 0 ? (
          <p className="italic text-yellow-200">No inactive staff.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inactiveStaff.map(s => (
              <StaffCard key={s.id} s={s} inactive />
            ))}
          </div>
        )}
      </section>
   <section>
        <h3 className="text-2xl font-bold text-green-400 mb-4">
          Active Staff
        </h3>

        {activeStaff.length === 0 ? (
          <p className="italic text-yellow-200">No active staff.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeStaff.map(s => (
              <StaffCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </section>
      {/* ✏️ Edit Modal (unchanged logic, cleaner UI) */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-yellow-500 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">
              Edit Staff
            </h3>

            {[
  "first_name",
  "last_name",
  "email",     // 🆕
  "phone",     // 🆕
  "username",
  "pin",
].map(field => (
  <input
    key={field}
    type={
      field === "email"
        ? "email"
        : field === "phone"
        ? "tel"
        : field === "pin"
        ? "password"
        : "text"
    }
    value={editing[field] || ""}
   onChange={(e) => {
  if (field === "phone") {
    setEditing({
      ...editing,
      phone: formatPhoneNumber(e.target.value),
    });
  } else {
    setEditing({
      ...editing,
      [field]: e.target.value,
    });
  }
}}

    placeholder={field.replace("_", " ")}
    className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
  />
))
}

<label className="block text-yellow-300 font-semibold mt-2">
  Staff Role(s)
</label>

<Select
  isMulti
  options={STAFF_ROLE_OPTIONS}
  placeholder="Search or select staff roles…"
  value={
    editing.role
      ? editing.role.split(",").map(r => ({
          value: r.trim(),
          label: r.trim(),
        }))
      : []
  }
  onChange={(selected) => {
    const rolesString = selected
      .map(opt => opt.value)
      .join(", ");

    setEditing(prev => ({
      ...prev,
      role: rolesString,
    }));
  }}
  className="react-select-container mb-3"
  classNamePrefix="react-select"
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(0,0,0,0.4)",
      borderColor: "rgba(234,179,8,0.4)",
      borderRadius: "12px",
      padding: "4px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#000",
      color: "#fde68a",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "rgba(234,179,8,0.2)"
        : "transparent",
      color: "#fde68a",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(234,179,8,0.25)",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#fde68a",
      fontWeight: "bold",
    }),
  }}
/>


            <textarea
              value={editing.bio || ""}
              onChange={(e) =>
                setEditing({ ...editing, bio: e.target.value })
              }
              placeholder="Bio"
              className="w-full h-28 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
            />
<div className="flex justify-end mt-2">
  <button
    type="button"
    onClick={generateStaffBio}
    className="
      px-4 py-2 rounded-xl
      bg-purple-500 text-black font-bold
      hover:bg-purple-600 transition
    "
  >
    ✨ Generate Bio
  </button>
</div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
