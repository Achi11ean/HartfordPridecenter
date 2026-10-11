import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE = "https://singspacebackend.onrender.com";
const TYPES = [{ value: "staff", label: "Staff" }, { value: "admin", label: "Admin" }, { value: "volunteer", label: "Volunteer" }];
const ROLES = ["Chair", "Co-Chair", "Secretary", "Treasurer", "Outreach Lead", "Events Coordinator", "Volunteer Coordinator", "Communications Lead", "Member"];
const memberName = (member, type) => type === "staff" ? [member.first_name, member.last_name].filter(Boolean).join(" ") || "Unnamed staff member" : member.name || "Unnamed member";

export default function AddMember({ committeeId, onMemberAdded }) {
  const { prideId, token, isAdmin } = useAuth();
  const id = useId();
  const [memberType, setMemberType] = useState("staff");
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [retry, setRetry] = useState(0);
  const pending = useRef(false);

  useEffect(() => {
    let active = true;
    setMembers([]); setSelectedMemberId(""); setLoadError(null);
    if (!isAdmin || !prideId || !token) {
      setLoadingMembers(false);
      if (isAdmin) setLoadError("Missing account information. Please sign in again.");
      return;
    }
    setLoadingMembers(true);
    const endpoint = memberType === "admin" ? "admins" : memberType === "staff" ? "staff" : "volunteer-spotlights";
    axios.get(`${API_BASE}/api/pride/${prideId}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (active) setMembers(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (active) setLoadError("Failed to load available members."); })
      .finally(() => { if (active) setLoadingMembers(false); });
    return () => { active = false; };
  }, [memberType, prideId, token, isAdmin, retry]);

  useEffect(() => { setSelectedMemberId(""); setRoleTitle(""); setSuccess(null); setError(null); }, [committeeId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (pending.current || loadingMembers) return;
    setError(null); setSuccess(null);
    if (!isAdmin) { setError("Only Pride admins can add committee members."); return; }
    if (!committeeId) { setError("Missing committee ID."); return; }
    if (!token || !prideId) { setError("Missing account information. Please sign in again."); return; }
    if (!selectedMemberId || !members.some(m => String(m.id) === selectedMemberId)) { setError("Please select a member to add."); return; }
    pending.current = true; setSaving(true);
    try {
      await axios.post(`${API_BASE}/api/pride-committees/${committeeId}/members`, {
        member_type: memberType,
        member_id: Number(selectedMemberId),
        role_title: roleTitle || null,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Member added to committee."); setSelectedMemberId(""); setRoleTitle("");
    } catch (err) {
      setError(typeof err.response?.data?.error === "string" ? err.response.data.error : "Failed to add member.");
      return;
    } finally { pending.current = false; setSaving(false); }
    // Notify the parent only after a successful creation.
    if (onMemberAdded) onMemberAdded();
  };

  return <section className="am-panel" aria-labelledby={`${id}-heading`}>
    <style>{STYLES}</style>
    {!isAdmin ? <p className="am-error" role="alert">Only Pride admins can add committee members.</p> : <>
      <header className="am-header"><span className="am-mark" aria-hidden="true">+</span><div><h4 id={`${id}-heading`}>Add a committee member</h4><p>Choose a person and their role on this committee.</p></div></header>
      {error && <p className="am-error" role="alert">{error}</p>}
      {success && <p className="am-success" role="status">✓ {success}</p>}
      <form onSubmit={handleSubmit} aria-busy={saving}>
        <fieldset className="am-types" disabled={saving}><legend>1. Choose member type</legend><div className="am-type-options">{TYPES.map(type => <label key={type.value}><input type="radio" name={`${id}-type`} value={type.value} checked={memberType === type.value} onChange={() => {setMemberType(type.value);setMembers([]);setSelectedMemberId("");setSuccess(null);setError(null);}}/><span>{type.label}</span></label>)}</div></fieldset>
        {loadError && <div className="am-error" role="alert">{loadError}<button type="button" disabled={saving} onClick={() => setRetry(n => n+1)}>Retry</button></div>}
        <div className="am-grid">
          <label className="am-field" htmlFor={`${id}-member`}><span>2. Select a member *</span><select id={`${id}-member`} value={selectedMemberId} required disabled={saving || loadingMembers || !!loadError || !members.length} onChange={e => {setSelectedMemberId(e.target.value);setSuccess(null);}}><option value="">{loadingMembers ? "Loading members…" : loadError ? "Members unavailable" : !members.length ? "No members available" : "Choose a member…"}</option>{members.map(member => <option key={member.id} value={member.id}>{memberName(member, memberType)}{member.role ? ` (${member.role})` : ""}</option>)}</select></label>
          <label className="am-field" htmlFor={`${id}-role`}><span>3. Committee role <small>Optional</small></span><select id={`${id}-role`} value={roleTitle} disabled={saving} onChange={e => setRoleTitle(e.target.value)}><option value="">No role assigned</option>{ROLES.map(role => <option key={role} value={role}>{role}</option>)}</select></label>
        </div>
        <footer className="am-footer"><p role="status">{loadingMembers ? "Loading available members…" : memberType === "volunteer" ? "Volunteers are selected from volunteer spotlights." : "The committee role is separate from their account role."}</p><button type="submit" disabled={saving || loadingMembers || !!loadError || !selectedMemberId}>{saving ? "Adding…" : "Add member"}<span aria-hidden="true">+</span></button></footer>
      </form>
    </>}
  </section>;
}
const STYLES = `
.am-panel{width:100%;min-width:0;box-sizing:border-box;padding:clamp(12px,2vw,18px);background:#f6f3f8;color:#392f43;border:1px solid #ded5e5;border-radius:10px;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.am-panel *{box-sizing:border-box}.am-header{display:flex;align-items:center;gap:10px;margin-bottom:15px}.am-mark{display:grid;place-items:center;flex-shrink:0;width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#eddbef,#e6e1f6,#deeee5);color:#7b568a;font-size:23px}.am-header h4{margin:0;font-size:18px;font-weight:750;line-height:1.4;color:#513d5d}.am-header p{margin:2px 0 0;font-size:12px;color:#73617e}.am-types{padding:0;margin:0 0 14px;border:0;min-width:0}.am-types legend,.am-field>span{display:block;padding:0;margin-bottom:6px;font-size:12px;font-weight:750;color:#685173}.am-type-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.am-type-options label{position:relative;min-width:0;cursor:pointer}.am-type-options input{position:absolute;opacity:0;width:1px;height:1px}.am-type-options span{display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px;border:1px solid #d6cadf;border-radius:7px;background:#fff;color:#756080;font-size:13px;font-weight:700}.am-type-options input:checked+span{background:#eadef2;border-color:#ad8ec1;color:#5f3e73;box-shadow:inset 0 -2px #a17bb7}.am-type-options label:nth-child(2) input:checked+span{background:#f6e2ed;border-color:#cf9db6;color:#824866;box-shadow:inset 0 -2px #c58aa8}.am-type-options label:nth-child(3) input:checked+span{background:#e2efe7;border-color:#95b6a2;color:#426950;box-shadow:inset 0 -2px #89ad98}.am-type-options input:focus-visible+span,.am-panel :is(select,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.am-type-options input:disabled+span{opacity:.55;cursor:wait}.am-grid{display:grid;grid-template-columns:1.25fr 1fr;gap:12px}.am-field{display:block;min-width:0}.am-field small{font-weight:400;font-size:11px;color:#7f6c87;margin-left:4px}.am-field select{display:block;width:100%;min-width:0;min-height:46px;padding:10px 12px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;font:16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}.am-field select:disabled{background:#eeebf2;color:#82738c;opacity:.8}.am-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px}.am-footer p{font-size:11px;color:#73617e;margin:0;max-width:340px}.am-footer button{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:46px;flex-shrink:0;padding:10px 15px;border:1px solid #795587;border-radius:7px;background:#795587;color:#fff;font:750 13px/1.5 Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer;transition:background .18s}.am-footer button:hover:not(:disabled){background:#62406e}.am-footer button:disabled{opacity:.5;cursor:not-allowed}.am-error,.am-success{padding:10px 12px;margin:0 0 12px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:12px;overflow-wrap:anywhere}.am-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}.am-error button{display:inline-block;min-height:44px;padding:7px 12px;margin-left:10px;border:1px solid #d4a5b7;border-radius:6px;background:#fff;color:#933954;font:inherit;font-weight:700;cursor:pointer}@media(max-width:600px){.am-grid{grid-template-columns:1fr}.am-footer{flex-direction:column;align-items:stretch}.am-footer button{width:100%}.am-header h4{font-size:17px}}@media(prefers-reduced-motion:reduce){.am-footer button{transition:none}}
`;
