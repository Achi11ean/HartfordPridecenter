import React, { useState, useEffect, useId } from "react";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import axios from "axios";

import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────────────────────────

   HARTFORD PRIDE CENTER — CONTACT PAGE

   "Community Poster" redesign to match HomePage:

   cream paper, flat pride-flag color blocks, ink outlines,

   hard offset shadows, huge Archivo type, rainbow marquee.

   All fetching, phone formatting, topic routing, terms lock,

   moderation, and EmailJS logic preserved.

   ───────────────────────────────────────────────────────────── */

const API = "https://singspacebackend.onrender.com";

const PRIDE_ID = 2;

const SERVICE_ID = "service_ud7473n";

const TEMPLATE_ID = "template_6i8lf6u";

const PUBLIC_KEY = "BDPsT3cNRMnCg-OaU";

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

export default function ContactPageTemplate() {

  const reduced = useReducedMotion();
  const [status, setStatus] = useState("");

  const [committees, setCommittees] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState("");

  const [showTerms, setShowTerms] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [admins, setAdmins] = useState([]);

  const [staff, setStaff] = useState([]);

  const [localBlocked, setLocalBlocked] = useState(false);

  const [services, setServices] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {

    const fetchAllContactTargets = async () => {

      try {

        const [servicesRes, committeesRes, adminsRes, staffRes] =

          await Promise.all([

            axios.get(`${API}/api/pride/${PRIDE_ID}/services`),

            axios.get(`${API}/api/pride-committees/pride/${PRIDE_ID}`),

            axios.get(`${API}/api/pride/${PRIDE_ID}/admins`),

            axios.get(`${API}/api/pride/${PRIDE_ID}/staff`),

          ]);

        setServices(servicesRes.data || []);

        setCommittees((committeesRes.data || []).filter((c) => c.is_active));

        setAdmins((adminsRes.data || []).filter((a) => a.is_active));

        setStaff((staffRes.data || []).filter((s) => s.is_active));

        console.log("📦 Contact targets loaded");

      } catch (err) {

        console.error("❌ Failed to fetch Pride contact targets:", err);

      }

    };

    fetchAllContactTargets();

  }, []);

  useEffect(() => {

    const fetchServicesAndCommittees = async () => {

      try {

        const [servicesRes, committeesRes] = await Promise.all([

          axios.get(`${API}/api/pride/${PRIDE_ID}/services`),

          axios.get(`${API}/api/pride-committees/pride/${PRIDE_ID}`),

        ]);

        console.log("🧩 Pride services:", servicesRes.data);

        console.log("🧭 Pride committees:", committeesRes.data);

        setServices(servicesRes.data || []);

        setCommittees((committeesRes.data || []).filter((c) => c.is_active));

      } catch (err) {

        console.error("❌ Failed to fetch Pride data:", err);

      }

    };

    fetchServicesAndCommittees();

  }, []);

  useEffect(() => {

    const fetchServices = async () => {

      try {

        const res = await axios.get(`${API}/api/pride/${PRIDE_ID}/services`);

        console.log("🧩 Pride services response:", res.data);

        setServices(res.data || []);

      } catch (err) {

        console.error("❌ Failed to fetch Pride services:", err);

      }

    };

    fetchServices();

  }, []);

  const handleTopicSelect = (e) => {

    const value = e.target.value;

    setSelectedTopic(value);

    if (!value) return;

    const service = services.find((s) => s.title === value);

    const committee = committees.find((c) => c.name === value);

    const admin = admins.find((a) => a.id === Number(value));

    const staffMember = staff.find((s) => s.id === Number(value));

    let finalTopic = value;

    if (service) {

      finalTopic = `${service.title} Services`;

    } else if (committee) {

      finalTopic = `${committee.name} Committee`;

    } else if (admin) {

      finalTopic = `I would like to connect with ${admin.name} (Admin)`;

    } else if (staffMember) {

      finalTopic = `I would like to connect with ${staffMember.first_name} ${staffMember.last_name} (${staffMember.role})`;

    }

    const prefix = `${finalTopic}\n\n`;

    setForm((prev) => {

      const cleanedMessage = prev.message.replace(/^[\s\S]*?\n\n/, "");

      return {

        ...prev,

        message: prefix + cleanedMessage,

      };

    });

  };

  // read block on load

  useEffect(() => {

    const blocked = localStorage.getItem("pride_contact_blocked");

    if (blocked === "true") {

      setLocalBlocked(true);

      setStatus(

        "🚫 This device has been locked due to prior hate speech violations. Submissions are disabled."

      );

    }

  }, []);

  const [form, setForm] = useState({

    name: "",

    email: "",

    message: "",

  });

  const handlePhoneChange = (e) => {

    let input = e.target.value.replace(/\D/g, "").substring(0, 10);

    const area = input.substring(0, 3);

    const mid = input.substring(3, 6);

    const last = input.substring(6, 10);

    if (input.length > 6) input = `(${area}) ${mid}-${last}`;

    else if (input.length > 3) input = `(${area}) ${mid}`;

    else if (input.length > 0) input = `(${area}`;

    setPhone(input);

  };

  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });

  };

  // submit logic + hate lock

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (localBlocked) {

      setStatus(

        "🚫 This device has been locked due to prior hate speech violations. Submissions are disabled."

      );

      return;

    }

    if (!termsAccepted) {

      setStatus("❗ You must agree to the Terms and Conditions before submitting.");

      return;

    }

    setIsLoading(true);

    setStatus("");

    try {

      // ================= SAVE TO BACKEND =================

      const res = await axios.post(`${API}/api/pride/${PRIDE_ID}/contact`, {

        name: form.name,

        email: form.email,

        phone: phone || null,

        message: form.message,

      });

      // ================= MODERATION BLOCK =================

      if (res.data?.contact_status === "flagged") {

        localStorage.setItem("pride_contact_blocked", "true");

        setLocalBlocked(true);

        setStatus(

          "🚨 Hate speech was detected. Your information has been logged and this device has been blocked."

        );

        return;

      }

      // ================= BUILD PRETTY TOPIC LABEL =================

      let formattedTopic = selectedTopic || "General Inquiry";

      const service = services.find((s) => s.title === selectedTopic);

      const committee = committees.find((c) => c.name === selectedTopic);

      const admin = admins.find((a) => a.id === Number(selectedTopic));

      const staffMember = staff.find((s) => s.id === Number(selectedTopic));

      if (service) {

        formattedTopic = `${service.title} Services`;

      } else if (committee) {

        formattedTopic = `${committee.name} Committee`;

      } else if (admin) {

        formattedTopic = `Connect with ${admin.name} (Admin)`;

      } else if (staffMember) {

        formattedTopic = `Connect with ${staffMember.first_name} ${staffMember.last_name} (${staffMember.role})`;

      }

      // ================= SEND EMAILJS EMAIL =================

      const templateParams = {

        from_name: form.name,

        from_email: form.email,

        phone: phone || "N/A",

        selected_topic: formattedTopic,

        message: form.message,

      };

      console.log("📨 Sending Pride Contact Email:", templateParams);

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      console.log("✅ EmailJS Sent Successfully");

      // ================= SUCCESS RESET =================

      setStatus("📬 Message sent successfully! We'll be in touch soon.");

      setForm({

        name: "",

        email: "",

        message: "",

      });

      setPhone("");

      setSelectedTopic("");

      setTermsAccepted(false);

    } catch (err) {

      console.error("❌ CONTACT FORM ERROR:", err);

      setStatus("❌ Something went wrong. Please try again.");

    } finally {

      setIsLoading(false);

    }

  };

  return <div className="hcc-page">
    <style>{CONTACT_STYLES}</style>
    <div className="hcc-rainbow" aria-hidden="true"/>
    <section className="hcc-hero hcc-container">
      <div><p className="hcc-eyebrow">Hartford Pride Center · Get in touch</p>
        <h1>A little hello.<br/><em>A real connection.</em></h1>
        <p className="hcc-lead">Questions, partnerships, volunteering, or support — reach our committees, staff, and programs. There's a place for your voice here.</p>
        <a className="hcc-text-link" href="#pride-contact-form">Write to us <span aria-hidden="true">↘</span></a>
      </div>
      <LetterAnimation/>
    </section>
    <div className="hcc-word-strip" aria-label="Ask, partner, volunteer, connect, support, hello">
      {["Ask", "Partner", "Volunteer", "Connect", "Support", "Hello"].map((word,i)=><span key={word} style={{color:["#a52d59","#995120","#7b651c","#28694e","#365fab","#80509b"][i]}}>{word}<i aria-hidden="true">✦</i></span>)}
    </div>
    <section className="hcc-board">
      <div className="hcc-container hcc-content">
        <aside className="hcc-invitations">
          <p className="hcc-eyebrow">Good things start with a conversation</p>
          <h2>Let's make<br/><em>something happen.</em></h2>
          {[
            ["♡", "Volunteer & community", "Join projects, events, and local outreach efforts."],
            ["✦", "Partnerships & sponsorships", "Connect your business or organization with Pride initiatives."],
            ["↗", "Questions, services & support", "Reach committees, staff, admins, and available programs."]
          ].map(([icon,title,copy],i)=><motion.div className={`hcc-note hcc-note-${i}`} key={title} initial={reduced ? false : {opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.45,delay:i*.06}}><span className="hcc-pin" aria-hidden="true"/><span className="hcc-note-icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{copy}</p></motion.div>)}
        </aside>
        <motion.form id="pride-contact-form" className="hcc-form" onSubmit={handleSubmit} initial={reduced ? false : {opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} aria-busy={isLoading}>
          <div className="hcc-form-heading"><div><p className="hcc-eyebrow">From you, with Pride</p><h2>Contact <em>us.</em></h2></div><span className="hcc-stamp" aria-hidden="true">HPC<br/>♡</span></div>
          <div className="hcc-fields">
            <div><label htmlFor="hcc-name">Name</label><input id="hcc-name" type="text" name="name" autoComplete="name" value={form.name} onChange={handleChange} required/></div>
            <div><label htmlFor="hcc-email">Email</label><input id="hcc-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required/></div>
            <div><label htmlFor="hcc-phone">Phone <small>(optional)</small></label><input id="hcc-phone" type="tel" autoComplete="tel" value={phone} onChange={handlePhoneChange}/></div>
            <div><label htmlFor="hcc-topic">Topic / interest</label><select id="hcc-topic" value={selectedTopic} onChange={handleTopicSelect}><option value="">Select a topic…</option>

                <optgroup label="General">

                  <option value="I want to volunteer">I want to volunteer</option>

                  <option value="I want to Partner">I want to Partner</option>

                                    <option value="I want to discuss the Driscoll Fund">I want to discuss the Driscoll Fund</option>

                                                                        <option value="I want to discuss the Kalos Gala">I want to discuss the Kalos Gala</option>

                </optgroup>

                {services.length > 0 && (

                  <optgroup label="Pride Services">

                    {services.map((service) => (

                      <option key={service.id} value={service.title}>

                        {service.title}

                      </option>

                    ))}

                  </optgroup>

                )}

                {committees.length > 0 && (

                  <optgroup label="Pride Committees">

                    {committees.map((committee) => (

                      <option key={committee.id} value={committee.name}>

                        {committee.name}

                      </option>

                    ))}

                  </optgroup>

                )}

                {admins.length > 0 && (

                  <optgroup label="Pride Admins">

                    {admins.map((admin) => (

                      <option key={admin.id} value={admin.id}>

                        {admin.name}

                      </option>

                    ))}

                  </optgroup>

                )}

                {staff.length > 0 && (

                  <optgroup label="Pride Staff">

                    {staff.map((member) => (

                      <option key={member.id} value={member.id}>

                        {member.first_name} {member.last_name} — {member.role}

                      </option>

                    ))}

                  </optgroup>

                )}

              </select></div>
            <div className="hcc-field-wide"><label htmlFor="hcc-message">Message</label><textarea id="hcc-message" name="message" rows={6} value={form.message} onChange={handleChange} required placeholder="Tell us what's on your mind…"/></div>
          </div>
          <div className="hcc-terms">
            <div className="hcc-consent"><input id="hcc-consent" type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)}/><label htmlFor="hcc-consent">I agree to the Terms and Conditions</label></div>
            <button className="hcc-terms-toggle" type="button" onClick={()=>setShowTerms(!showTerms)} aria-expanded={showTerms} aria-controls="hcc-policy">{showTerms ? "Hide" : "Review"} contact & conduct policy {showTerms ? "−" : "+"}</button>
            <AnimatePresence>{showTerms && <motion.div id="hcc-policy" className="hcc-policy" initial={reduced ? false : {opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:reduced?0:.2}}><p>You consent to being contacted regarding your inquiry using the information submitted.</p><p>Hate, harassment, or threats will lock this device immediately and submit IP address for a possible report to authorities.</p></motion.div>}</AnimatePresence>
          </div>
          <button className="hcc-send" type="submit" disabled={isLoading || !termsAccepted || localBlocked}>{isLoading ? "Sending…" : "Send message"}<span aria-hidden="true">↗</span></button>
          {localBlocked && <p className="hcc-blocked">🚫 Submissions from this device are disabled.</p>}
          {status && <p className="hcc-status" role="status">{status}</p>}
        </motion.form>
      </div>
    </section><div className="hcc-rainbow" aria-hidden="true"/>
  </div>;
}

function LetterAnimation() {
  const [replay, setReplay] = useState(0);
  const paperClip = useId();
  const reduced = useReducedMotion();
  return <button type="button" className="hcc-letter-scene" onClick={()=>setReplay(n=>n+1)} aria-label="Replay animation: a pen writes a letter that flies away in an envelope with a rainbow trail">
    <span className="hcc-scene-tape" aria-hidden="true"/>
    <svg key={replay} className={reduced ? "hcc-letter-art hcc-still" : "hcc-letter-art"} viewBox="0 0 560 330" aria-hidden="true" focusable="false">
      <ellipse cx="278" cy="279" rx="116" ry="13" fill="#dfd1e4" opacity=".45"/>
      <g fill="#be97c8"><path d="M100 78l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"/><path d="M445 197l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"/></g>
      <g className="hcc-mail-flight">
        <g className="hcc-flight-trail" fill="none" strokeWidth="7" strokeLinecap="round">
          {["#e97793","#edac77","#e3cb76","#8cbea0","#91afe1","#b291d0"].map((color,i)=><path key={color} stroke={color} d={`M230 ${204+i*7} C130 ${180+i*7}, 150 ${278+i*7}, -170 ${250+i*7}`}/>)}
        </g>
        <rect x="182" y="192" width="196" height="72" fill="#e4d3ed" stroke="#9e79ab" strokeWidth="2"/>
        <path className="hcc-envelope-flap-back" d="M182 192L280 122L378 192Z" fill="#e4d3ed" stroke="#9e79ab" strokeWidth="2"/>
        <defs><clipPath id={paperClip}><rect x="180" y="0" width="200" height="263"/></clipPath></defs>
        <g clipPath={`url(#${paperClip})`}><g className="hcc-letter-paper">
          <rect x="210" y="49" width="140" height="172" rx="4" fill="#fffdf7" stroke="#d5c9b9" strokeWidth="2"/>
          <path d="M228 68h28" stroke="#bda9c7" strokeWidth="3" strokeLinecap="round"/>
          {[94,117,140,163].map((y,i)=><path className={`hcc-written-line hcc-written-${i}`} key={y} d={`M228 ${y}h${i===3?53:101}`} pathLength="1" fill="none" stroke="#766084" strokeWidth="3" strokeLinecap="round"/>)}
          <path className="hcc-letter-heart" d="M308 184c-12-12-23 5 0 18 23-13 12-30 0-18" fill="#cc718f"/>
        </g>
        </g><path d="M182 192 L280 244 L378 192 L378 264 L182 264Z" fill="#f6eaf8" stroke="#9e79ab" strokeWidth="2"/>
        <path d="M182 264L251 227M378 264L309 227" fill="none" stroke="#c0a3cb" strokeWidth="2"/>
        <path className="hcc-envelope-flap" d="M182 192L280 245L378 192Z" fill="#ead9f1" stroke="#9e79ab" strokeWidth="2"/>
        <g className="hcc-envelope-seal"><circle cx="280" cy="236" r="12" fill="#ad688d"/><path d="M280 232c-7-7-13 3 0 10 13-7 7-17 0-10" fill="#fff8ef"/></g>
      </g>
      <g className="hcc-writing-pen"><g transform="translate(228 94) rotate(35)"><path d="M0 0L-6-18H6Z" fill="#e7bd68"/><path d="M0 0L-2-6H2Z" fill="#49364f"/><rect x="-6" y="-88" width="12" height="70" rx="4" fill="#805797"/><path d="M-6-23H6M-6-70H6" stroke="#e9c87c" strokeWidth="4"/><path d="M5-80h5v29" fill="none" stroke="#e9c87c" strokeWidth="3"/></g></g>
      <g className="hcc-arrival-spark" fill="#ae78ae"><path d="M438 83l4 13 13 4-13 4-4 13-4-13-13-4 13-4z"/><circle cx="461" cy="73" r="3"/></g>
    </svg>
    <span className="hcc-scene-caption">A little note can go a long way.</span>
    <span className="hcc-replay">↻ Tap to replay</span>
  </button>;
}

const CONTACT_STYLES = `
.hcc-page{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#49364f;background:#fcf9f5;min-height:100vh;padding-top:var(--hpc-header-offset,96px);line-height:1.65;color-scheme:light}.hcc-page *{box-sizing:border-box}.hcc-page :is(h1,h2,h3,p){margin:0}.hcc-page button,.hcc-page input,.hcc-page select,.hcc-page textarea{font:inherit}.hcc-page button{cursor:pointer}.hcc-page button:disabled{cursor:not-allowed}.hcc-page :is(button,a,input,select,textarea):focus-visible{outline:3px solid #805797;outline-offset:4px}.hcc-page em{font-family:Georgia,serif;font-weight:400}.hcc-container{width:97%;max-width:1450px;margin:auto;padding-inline:clamp(14px,3vw,42px)}.hcc-rainbow{height:4px;background:linear-gradient(90deg,#e97793,#edac77,#e3cb76,#8cbea0,#91afe1,#b291d0)}
.hcc-hero{display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:40px;padding-block:34px 30px}.hcc-eyebrow{color:#825177;font-size:11px;font-weight:750;letter-spacing:1.5px;text-transform:uppercase}.hcc-hero h1{font-size:clamp(37px,5vw,68px);font-weight:600;line-height:1.09;letter-spacing:-1.8px;margin:15px 0 20px}.hcc-hero h1 em{color:#925777}.hcc-lead{max-width:570px;color:#69566c;font-size:16px;line-height:1.85}.hcc-text-link{display:inline-flex;align-items:center;gap:18px;min-height:44px;margin-top:13px;color:#744a81;font-weight:700;text-underline-offset:5px}.hcc-word-strip{display:flex;gap:clamp(22px,4vw,60px);justify-content:center;padding:14px 20px;border-block:1px solid #dfcfe0;background:#f2eaf7;overflow-x:auto;white-space:nowrap}.hcc-word-strip>span{display:flex;align-items:center;gap:24px;font:italic 21px Georgia,serif}.hcc-word-strip i{font-style:normal;font-size:10px;color:#9e82a8}
.hcc-letter-scene{position:relative;display:flex;flex-direction:column;align-items:center;width:100%;max-width:520px;justify-self:center;padding:0 0 15px;border:1px solid #d9c9df;border-radius:3px;background:linear-gradient(135deg,#f9eef3,#fff9eb 48%,#edf4f8);box-shadow:0 12px 28px #7c5a7c12;color:#745275;transform:rotate(1deg)}.hcc-scene-tape{position:absolute;z-index:1;width:86px;height:23px;top:-11px;left:calc(50% - 43px);background:#dbc0e7ad;border-inline:1px dashed #b493c1;transform:rotate(-4deg)}.hcc-letter-art{display:block;width:100%;height:auto;overflow:hidden}.hcc-scene-caption{font:italic 18px Georgia,serif;padding:0 12px}.hcc-replay{font-size:11px;font-weight:700;margin-top:8px;letter-spacing:.5px}.hcc-letter-scene:hover .hcc-replay{text-decoration:underline;text-underline-offset:4px}
.hcc-board{padding-block:32px 42px;border-top:1px solid #ddcfc1;background-color:#efe3d4;background-image:radial-gradient(#967a5520 .7px,transparent .7px);background-size:5px 5px}.hcc-content{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:clamp(24px,4vw,60px);align-items:start}.hcc-invitations h2,.hcc-form h2{font-size:clamp(29px,3vw,40px);font-weight:600;line-height:1.15;letter-spacing:-.8px;margin:10px 0 24px}.hcc-invitations h2 em,.hcc-form h2 em{color:#895778}.hcc-note{position:relative;padding:20px 20px 18px;margin-top:20px;box-shadow:0 7px 15px #765b3420;border:1px solid #d4c7bc;min-width:0}.hcc-note-0{background:#e9f4ed;transform:rotate(-1deg)}.hcc-note-1{background:#fff2d9;transform:rotate(1deg)}.hcc-note-2{background:#edf0fc;transform:rotate(-.5deg)}.hcc-pin{position:absolute;top:-5px;left:50%;width:11px;height:11px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff4fb,#b47c98 55%,#784664);box-shadow:1px 3px 3px #46304335}.hcc-note-icon{float:left;margin-right:10px;font-size:25px;color:#805b81;line-height:1.2}.hcc-note h3{font-size:15px;line-height:1.4;font-weight:750}.hcc-note p{font-size:13px;color:#66566a;margin-top:7px}.hcc-form{position:relative;min-width:0;background:#fffdf8;border:1px solid #d7cbbc;border-top:4px solid #af8fbd;padding:clamp(18px,3vw,34px);box-shadow:0 12px 32px #69503515;scroll-margin-top:130px}.hcc-form-heading{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.hcc-form h2{margin-bottom:22px}.hcc-stamp{border:2px dashed #b590b4;padding:7px 12px;color:#8c648e;font-size:12px;text-align:center;line-height:1.5;transform:rotate(8deg)}.hcc-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px 15px}.hcc-fields>div{min-width:0}.hcc-fields label{display:block;font-size:12px;font-weight:750;color:#58465f;margin-bottom:6px}.hcc-fields small{font-weight:400;color:#756775}.hcc-fields :is(input,select,textarea){display:block;width:100%;min-width:0;border:1px solid #c7bacb;border-radius:5px;background:#fff;color:#3f3347;padding:11px 12px;font-size:16px;line-height:1.5;min-height:46px}.hcc-fields textarea{resize:vertical;min-height:145px;max-height:480px}.hcc-fields textarea::placeholder{color:#7d7082}.hcc-field-wide{grid-column:1/-1}.hcc-terms{margin-top:19px;padding:14px;background:#f3edf5;border:1px solid #ddd0e0}.hcc-consent{display:flex;align-items:flex-start;gap:10px}.hcc-consent input{width:20px;height:20px;flex-shrink:0;accent-color:#815787;margin-top:2px}.hcc-consent label{font-size:13px;font-weight:650;cursor:pointer}.hcc-terms-toggle{display:block;min-height:44px;border:0;background:none;padding:7px 0;text-align:left;font-size:12px!important;color:#725078;text-decoration:underline;text-underline-offset:3px}.hcc-policy{overflow:hidden;font-size:13px;color:#615064}.hcc-policy p{padding-top:10px}.hcc-policy p+p{color:#8d3455}.hcc-send{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:50px;padding:11px 18px;border:1px solid #705079;background:#795582;color:#fff;border-radius:5px;font-weight:750!important;margin-top:18px;transition:background .2s}.hcc-send:hover:not(:disabled){background:#604069}.hcc-send:disabled{background:#e2d9e4;border-color:#cdc0d0;color:#736476}.hcc-status,.hcc-blocked{margin-top:14px!important;padding:13px;border:1px solid #c6d4c8;background:#eef5eb;color:#3b5141;font-size:14px;overflow-wrap:anywhere}.hcc-blocked{background:#fbe9ee;border-color:#e3b7c6;color:#8c3553}
/* One seven-second sequence; replay remounts only this decorative SVG. */
.hcc-written-line{stroke-dasharray:1;stroke-dashoffset:1;animation:hcc-ink .5s linear forwards}.hcc-written-0{animation-delay:.35s}.hcc-written-1{animation-delay:.95s}.hcc-written-2{animation-delay:1.55s}.hcc-written-3{animation-delay:2.15s}.hcc-letter-paper{animation:hcc-paper 7s ease-in-out both}.hcc-writing-pen{animation:hcc-pen 7s linear both}.hcc-letter-heart{animation:hcc-heart 7s both}.hcc-envelope-flap-back,.hcc-envelope-flap{transform-box:view-box;transform-origin:280px 192px}.hcc-envelope-flap-back{animation:hcc-fold-back 7s ease-in-out both}.hcc-envelope-flap{animation:hcc-fold-front 7s ease-in-out both}.hcc-envelope-seal{animation:hcc-seal 7s both}.hcc-mail-flight{transform-origin:280px 225px;animation:hcc-fly 7s cubic-bezier(.4,0,.2,1) both}.hcc-flight-trail{animation:hcc-trail 7s both}.hcc-arrival-spark{animation:hcc-spark 7s both}
@keyframes hcc-ink{to{stroke-dashoffset:0}}
@keyframes hcc-pen{0%,4%{opacity:0;transform:translate(0,0)}5%{opacity:1;transform:translate(0,0)}12%{transform:translate(101px,0)}13%{transform:translate(0,23px)}21%{transform:translate(101px,23px)}22%{transform:translate(0,46px)}30%{transform:translate(101px,46px)}31%{transform:translate(0,69px)}38%{opacity:1;transform:translate(53px,69px)}43%,100%{opacity:0;transform:translate(90px,45px)}}
@keyframes hcc-paper{0%,43%{transform:translateY(0)}57%,100%{transform:translateY(148px)}}
@keyframes hcc-heart{0%,36%{opacity:0}42%,100%{opacity:1}}
@keyframes hcc-fold-back{0%,56%{transform:scaleY(1)}63%,100%{transform:scaleY(0)}}
@keyframes hcc-fold-front{0%,63%{transform:scaleY(0)}70%,100%{transform:scaleY(1)}}
@keyframes hcc-seal{0%,70%{opacity:0}73%,100%{opacity:1}}
@keyframes hcc-trail{0%,79%{opacity:0}85%,93%{opacity:.85}100%{opacity:0}}
@keyframes hcc-fly{0%,79%{transform:translate(0,0) rotate(0)}84%{transform:translate(-14px,5px) rotate(-7deg)}100%{transform:translate(540px,-230px) rotate(-18deg)}}
@keyframes hcc-spark{0%,93%{opacity:0}97%{opacity:1}100%{opacity:0}}
.hcc-still .hcc-envelope-flap-back{transform:scaleY(0)}.hcc-still .hcc-envelope-flap{transform:scaleY(1)}.hcc-still .hcc-mail-flight{transform:none}.hcc-still .hcc-letter-paper{transform:translateY(120px)}.hcc-still .hcc-writing-pen,.hcc-still .hcc-arrival-spark{display:none}.hcc-still .hcc-flight-trail{opacity:.6}.hcc-still .hcc-written-line{stroke-dashoffset:0}
@media(max-width:760px){.hcc-page{padding-top:var(--hpc-header-offset,112px)}.hcc-hero{grid-template-columns:1fr;gap:26px;padding-block:25px;text-align:center}.hcc-hero h1{font-size:clamp(36px,8vw,54px)}.hcc-lead{margin-inline:auto!important;font-size:14px}.hcc-letter-scene{max-width:390px}.hcc-word-strip{justify-content:flex-start;gap:24px}.hcc-content{grid-template-columns:1fr}.hcc-form{grid-row:1}.hcc-invitations{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.hcc-invitations>.hcc-eyebrow,.hcc-invitations>h2{grid-column:1/-1}.hcc-invitations h2{margin:0}.hcc-note{padding:18px 12px 12px}.hcc-note-icon{float:none;display:block;margin-bottom:6px}.hcc-note h3{font-size:13px}.hcc-note p{font-size:12px}}
@media(max-width:480px){.hcc-fields{grid-template-columns:1fr;gap:13px}.hcc-invitations{grid-template-columns:1fr}.hcc-note{margin-top:6px}.hcc-note-icon{float:left}.hcc-board{padding-block:24px}.hcc-scene-caption{font-size:16px}}
@media(prefers-reduced-motion:reduce){.hcc-page *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hcc-written-line{stroke-dashoffset:0}.hcc-writing-pen{display:none}}
`;
