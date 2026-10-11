import React, { useId, useRef, useState } from "react";
import AdminSignup from "./AdminSignup";
import StaffSignup from "./StaffSignup";

const MODES = [
  { id: "admin", title: "Admin", description: "Create an administrator account", icon: "◇" },
  { id: "staff", title: "Staff", description: "Create a staff member account", icon: "✦" },
];

export default function Signup() {
  const [mode, setMode] = useState("admin");
  // Mount each form on its first visit, then keep it mounted to preserve drafts.
  const [visited, setVisited] = useState({ admin: true, staff: false });
  const id = useId();
  const tabRefs = useRef([]);
  const selectMode = next => {
    setVisited(prev => ({ ...prev, [next]: true }));
    setMode(next);
  };
  const handleTabKey = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % MODES.length;
    else if (event.key === "ArrowLeft") next = (index + MODES.length - 1) % MODES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = MODES.length - 1;
    else return;
    event.preventDefault();
    selectMode(MODES[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <main className="psu-page">
      <style>{STYLES}</style>
      <div className="psu-shell">
        <header className="psu-masthead">
          <div className="psu-brand"><span className="psu-brand-mark" aria-hidden="true">✦</span><span>Hartford Pride Center<small>People make the difference.</small></span></div>
          <span className="psu-label">Team accounts</span>
        </header>
        <div className="psu-rainbow" aria-hidden="true" />
        <section className="psu-workspace" aria-labelledby={`${id}-title`}>
          <header className="psu-intro">
            <div><p className="psu-eyebrow">A place on the team</p><h1 id={`${id}-title`}>Let's build community.</h1><p>Choose an account type. We'll take it one step at a time.</p></div>
            <span className="psu-note"><span aria-hidden="true">✓</span> Three simple steps</span>
          </header>
          <div className="psu-tabs" role="tablist" aria-label="Account type">
            {MODES.map((item, index) => (
              <button
                key={item.id}
                ref={node => { tabRefs.current[index] = node; }}
                type="button"
                role="tab"
                id={`${id}-${item.id}-tab`}
                aria-controls={`${id}-${item.id}-panel`}
                aria-selected={mode === item.id}
                tabIndex={mode === item.id ? 0 : -1}
                onClick={() => selectMode(item.id)}
                onKeyDown={event => handleTabKey(event, index)}
              >
                <span className="psu-tab-icon" aria-hidden="true">{item.icon}</span>
                <span className="psu-tab-text"><strong>{item.title}</strong><small>{item.description}</small></span>
                <span className="psu-selected" aria-hidden="true">{mode === item.id ? "✓" : ""}</span>
              </button>
            ))}
          </div>
          <p className="psu-draft-note">You can switch account types without losing your entries while this page stays open.</p>
          <div className="psu-form-frame">
            {MODES.map(item => (
              <div
                key={item.id}
                role="tabpanel"
                id={`${id}-${item.id}-panel`}
                aria-labelledby={`${id}-${item.id}-tab`}
                hidden={mode !== item.id}
                className="psu-tab-panel"
              >
                {visited[item.id] && (item.id === "admin" ? <AdminSignup /> : <StaffSignup />)}
              </div>
            ))}
          </div>
          <footer className="psu-footer"><span className="psu-mini-rainbow" aria-hidden="true"/><p>Many voices. One welcoming community.</p></footer>
        </section>
      </div>
    </main>
  );
}

const STYLES = `
.psu-page{--psu-header-clearance:96px;box-sizing:border-box;min-height:100vh;min-height:100dvh;width:100%;padding:calc(var(--psu-header-clearance) + 16px) max(12px,1.5vw) 24px;background:radial-gradient(ellipse at 5% 0%,#71447755,transparent 48%),radial-gradient(ellipse at 100% 80%,#326c6650,transparent 48%),#231d30;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif}
.psu-shell{box-sizing:border-box;max-width:90%;margin-inline:auto;border:1px solid #b89acd55;border-radius:18px;box-shadow:0 24px 70px #100b2044;background:#32273f}
.psu-masthead{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 22px;color:#f7edf9}
.psu-brand{display:flex;align-items:center;gap:11px;font-size:14px;font-weight:750;line-height:1.4}.psu-brand-mark{display:grid;place-items:center;flex-shrink:0;width:38px;height:38px;border:1px solid #d6b4e055;border-radius:10px;background:linear-gradient(135deg,#774b75,#4f426b,#3e6a63);color:#ffe9f5;font-size:24px}.psu-brand small{display:block;margin-top:3px;font-size:10px;font-weight:450;color:#cdbdd8}.psu-label{font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:#dfcce7;flex-shrink:0}.psu-rainbow{height:3px;background:linear-gradient(90deg,#e78ca8,#eab28e,#e9d397,#a9c7a8,#94b7dc,#bb9dd7)}
.psu-workspace{padding:clamp(14px,2.5vw,26px);background:#eee8f1;border-radius:0 0 17px 17px}.psu-intro{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:17px}.psu-intro p,.psu-intro h1{margin:0}.psu-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.5px;text-transform:uppercase;color:#846589}.psu-intro h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(25px,3.7vw,37px);font-weight:500;letter-spacing:-1px;line-height:1.2;margin:5px 0 7px;color:#48324f}.psu-intro p:last-child{font-size:12px;color:#73617e}.psu-note{display:flex;align-items:center;gap:7px;font-size:11px;color:#65546e;white-space:nowrap}.psu-note>span{display:grid;place-items:center;width:23px;height:23px;border-radius:50%;background:#dceadf;color:#477058}
.psu-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:6px;background:#dcd1e4;border:1px solid #d0c1da;border-radius:12px}.psu-tabs button{display:flex;align-items:center;gap:11px;min-height:72px;min-width:0;padding:12px 15px;border:1px solid transparent;border-radius:8px;background:transparent;color:#6d597a;text-align:left;font:inherit;cursor:pointer;transition:background .18s,color .18s,box-shadow .18s}.psu-tabs button:hover{background:#eee6f4}.psu-tabs button[aria-selected=true]{background:#fffdfd;border-color:#c4acd3;color:#533762;box-shadow:0 3px 10px #57376712}.psu-tabs button:focus-visible{outline:3px solid #795587;outline-offset:3px}.psu-tab-icon{display:grid;place-items:center;width:34px;height:34px;flex-shrink:0;background:#d0bfdc;border-radius:8px;font-size:21px;color:#735282}.psu-tabs button[aria-selected=true] .psu-tab-icon{background:linear-gradient(135deg,#f6dfe9,#e7def5,#dceee7)}.psu-tab-text{min-width:0;flex:1}.psu-tab-text strong{display:block;font-size:15px;font-weight:750;line-height:1.3}.psu-tab-text small{display:block;font-size:10px;line-height:1.5;margin-top:3px;color:#7c6887}.psu-selected{width:18px;flex-shrink:0;font-size:15px;color:#785289}.psu-draft-note{font-size:11px;color:#786582;margin:9px 3px 14px;line-height:1.5}
.psu-form-frame{background:#fff;border:1px solid #d6c8df;border-radius:12px;box-shadow:0 7px 20px #57376708;min-width:0}.psu-tab-panel[hidden]{display:none!important}.psu-form-frame .as-panel,.psu-form-frame .ss-panel{width:100%;max-width:none;border:0;border-radius:12px;background:#fbf9fc;margin:0;box-sizing:border-box}.psu-form-frame .as-columns,.psu-form-frame .ss-columns{min-width:0}.psu-footer{display:flex;justify-content:center;align-items:center;gap:9px;padding-top：16px;color:#8a7494}.psu-footer p{margin:0;font-size:10px}.psu-mini-rainbow{display:block;width:26px;height：3px;border-radius：5px;background：linear-gradient(90deg,#d782a0,#d5ac70,#88b49d,#9e86c4)}
@media(max-width:640px){.psu-page{--psu-header-clearance:112px;padding-top:calc(var(--psu-header-clearance) + 10px);padding-inline:9px}.psu-masthead{padding:13px 14px}.psu-brand{font-size:12px}.psu-label{font-size：8px;letter-spacing：.7px}.psu-brand-mark{width：31px;height：3１ｐｘ;font-size：2０ｐｘ}.psu-workspace{padding：１２ｐｘ}.psu-intro{align-items:flex-start;flex-direction：column;gap：９ｐｘ;margin-bottom：１３ｐｘ}.psu-intro h１{font-size：２８ｐｘ}.psu-note{font-size：１０ｐｘ}.psu-tabs{gap：５ｐｘ;padding：５ｐｘ}.psu-tabs button{padding：１０ｐｘ ８ｐｘ;gap：７ｐｘ;min-height：６８ｐｘ}.psu-tab-icon{width：２７ｐｘ;height：２７ｐｘ;font-size：１８ｐｘ}.psu-tab-text strong{font-size：１４ｐｘ}.psu-tab-text small{font-size：９ｐｘ}.psu-selected{width：１２ｐｘ;font-size：１２𝑝ｘ}.psu-draft-note{font-size：１０𝑝ｘ}.psu-footer{padding-top：１  ２𝑝ｘ}}
@media(prefers-reduced-motion:reduce){.psu-tabs button{transition:none}}
`;
