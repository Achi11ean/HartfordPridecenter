import React, { useState, useEffect } from "react";

import axios from "axios";

import emailjs from "@emailjs/browser";

const API = "https://singspacebackend.onrender.com";

// 🔥 HARD-CODE EMAILJS VALUES

const SERVICE_ID = "service_ud7473n";

const TEMPLATE_ID = "template_8kscp7c";

const PUBLIC_KEY = "BDPsT3cNRMnCg-OaU";

export default function CreateNewsletters({ prideId = 2 }) {

  // ---------------- STATE ----------------

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [subscriberTypes, setSubscriberTypes] = useState([]);

  const [imageUrl, setImageUrl] = useState("");

  const [contactName, setContactName] = useState("");

  const [contactEmail, setContactEmail] = useState("");

  const [contactPhone, setContactPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");

  const [reviewMode, setReviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [largeText, setLargeText] = useState(false);

function formatPhone(value) {

  // remove anything not numeric

  const numbers = value.replace(/\D/g, "").slice(0, 10);

  const len = numbers.length;

  if (len < 4) return numbers;

  if (len < 7) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;

  return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6)}`;

}

  const SUBSCRIPTION_OPTIONS = [

    "sponsors",

    "vendors",

    "general",

    "programs"

  ];

  // ---------------- ENHANCE ----------------

  const enhanceNewsletter = async () => {

    if (enhancing || uploading || loading) return;
    if (!description.trim()) { setFeedback("Enter message text first."); return; }
    setEnhancing(true); setFeedback("");

    try {

      const res = await axios.post(

        `${API}/api/generate-newsletter-enhancement`,

        { text: description }

      );

      setDescription(res.data.enhanced_text);

    } catch {

      setFeedback("Enhancement failed. Your message has been kept.");

    } finally { setEnhancing(false); }

  };

  // ---------------- FILE UPLOAD ----------------

  const handleFileUpload = async (e) => {

    const file = e.target.files[0];

    if (!file || uploading || loading || enhancing) return;
    setUploading(true); setFeedback("");

    const data = new FormData();

    data.append("file", file);

    data.append("upload_preset", "karaoke");

    try {

      const res = await fetch(

        "https://api.cloudinary.com/v1_1/dcw0wqlse/image/upload",

        { method: "POST", body: data }

      );

      const json = await res.json();

      if (!res.ok || !json.secure_url) throw new Error("Upload failed");
      setImageUrl(json.secure_url);

    } catch {

      setFeedback("Image upload failed. Please try again.");

    } finally { setUploading(false); }

  };

  // ---------------- CHECKBOX ----------------

  const toggleType = (type) => {

    setSubscriberTypes((prev) =>

      prev.includes(type)

        ? prev.filter((t) => t !== type)

        : [...prev, type]

    );

  };

// ---------------- SEND EMAIL ----------------

const sendEmailsFrontend = async () => {



  const { data: subs } = await axios.get(

    `${API}/api/pride/${prideId}/subscriptions/by-types`,

    { params: { types: subscriberTypes.join(",") } }

  );


  if (!subs || subs.length === 0) {

    console.warn("⚠️ No subscribers returned. STOP.");

    return;

  }

  const tasks = subs.map((sub, i) => {

    const name = `${sub.first_name || ""} ${sub.last_name || ""}`.trim();

    const payload = {

      to_name: name || "Subscriber",

      to_email: sub.email,

      newsletter_title: title,

      newsletter_description: description,

      image_url: imageUrl || " ",

      contact_name: contactName,

      contact_email: contactEmail,

      contact_phone: contactPhone,

    };


    return emailjs

      .send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY)

      .then((res) => {


      })

      .catch((err) => {

        console.error(`❌ EMAIL FAIL (#${i + 1})`, err);

        throw err; // important so Promise.all catches error

      });

  });


  await Promise.all(tasks);


};

  // ---------------- SUBMIT ----------------

const submitNewsletter = async () => {
  if (loading || uploading || enhancing || status === "success") return;






  if (!title || !description || subscriberTypes.length === 0) {

    console.error("❌ Missing required fields");

    alert("Missing required fields");

    return;

  }

  setLoading(true);

  setStatus("");

  try {


    await sendEmailsFrontend();


    await axios.post(

      `${API}/api/pride/${prideId}/newsletter/create`,

      {

        title,

        description,

        subscriber_types: subscriberTypes,

        contact_name: contactName,

        contact_email: contactEmail,

        contact_phone: contactPhone,

        image_url: imageUrl,

      }

    );


    setStatus("success");

  } catch (err) {

    console.error("🔥 SEND NEWSLETTER FRONTEND ERROR:", err);

    setStatus("error");

  }

  setLoading(false);

};

  const locked = loading || uploading || enhancing;
  const review = e => { e.preventDefault(); if (!subscriberTypes.length) {setFeedback("Choose at least one audience group.");return;} if (!title.trim() || !description.trim()) {setFeedback("Add a title and message before reviewing.");return;} setFeedback("");setReviewMode(true); };
  return <section className={`nl-panel${largeText ? " nl-large" : ""}`} aria-label="Newsletter composer"><style>{STYLES}</style>
    <header className="nl-header"><div><p className="nl-eyebrow">Keep your community connected</p><h2>{reviewMode ? "Review newsletter" : "Create newsletter"}</h2><p>{reviewMode ? "Check your content and selected audience before sending." : "Choose your audience, write your update, and review before sending."}</p></div><button type="button" className="nl-text-size" aria-pressed={largeText} onClick={()=>setLargeText(v=>!v)}>A+ Larger text</button></header>
    <ol className="nl-steps" aria-label="Newsletter progress"><li aria-current={!reviewMode?"step":undefined}>1 · Compose</li><li aria-current={reviewMode?"step":undefined}>2 · Review & send</li></ol>
    {reviewMode ? <>
      <div className="nl-audience-summary"><strong>Audience</strong><div>{subscriberTypes.map(type=><span key={type}>{type}</span>)}</div></div>
      <article className="nl-preview"><header><p className="nl-eyebrow">Hartford Pride Center</p><h3>{title || "Untitled newsletter"}</h3></header><div className="nl-preview-body">{imageUrl && <BannerPreview src={imageUrl}/>}<p className="nl-copy">{description}</p>{(contactName || contactEmail || contactPhone)&&<div className="nl-contact-preview"><h4>Contact information</h4>{contactName&&<p>{contactName}</p>}{contactEmail&&<p>{contactEmail}</p>}{contactPhone&&<p>{contactPhone}</p>}</div>}</div><footer>Content preview · Final email styling follows your EmailJS template.</footer></article>
      {status === "success" && <div role="status" className="nl-success">✓ Newsletter sent & saved successfully.</div>}
      {status === "error" && <div role="alert" className="nl-error">Sending or saving failed. Some emails may already have been delivered. Check delivery and save results before retrying.</div>}
      <div className="nl-review-actions"><button type="button" disabled={locked} onClick={()=>setReviewMode(false)}>← Back to editing</button><button type="button" className="nl-send" disabled={locked || status === "success"} onClick={submitNewsletter}>{loading ? "Sending…" : status === "success" ? "Newsletter sent ✓" : "Send newsletter →"}</button></div>
    </> : <form onSubmit={review}>
      <fieldset className="nl-fields" disabled={locked}>
        <section className="nl-card"><h3><span>01</span>Select your audience *</h3><p className="nl-help">Choose the subscription groups that should receive this update.</p><div className="nl-audience">{SUBSCRIPTION_OPTIONS.map(type=><label key={type} className={subscriberTypes.includes(type)?"nl-selected":""}><input type="checkbox" checked={subscriberTypes.includes(type)} onChange={()=>toggleType(type)}/><span>{type}</span></label>)}</div></section>
        <section className="nl-card"><h3><span>02</span>Write your newsletter</h3><div className="nl-grid"><label className="nl-wide"><span>Newsletter title *</span><input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g. Community updates & upcoming events"/></label><div className="nl-wide"><div className="nl-message-heading"><label htmlFor="nl-message">Message *</label><button type="button" onClick={enhanceNewsletter} disabled={!description.trim() || locked}>{enhancing?"Enhancing…":"✦ Enhance message"}</button></div><textarea id="nl-message" value={description} onChange={e=>setDescription(e.target.value)} rows={8} required placeholder="Share your community news…"/><p className="nl-help">Review any enhanced text before sending.</p></div></div></section>
        <section className="nl-card"><h3><span>03</span>Banner image <small>Optional</small></h3><div className="nl-banner-layout"><div className="nl-grid"><label className="nl-wide"><span>Upload an image</span><input type="file" accept="image/*" onChange={handleFileUpload}/></label><label className="nl-wide"><span>Or paste an image URL</span><input inputMode="url" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="https://…"/></label></div>{imageUrl&&<div className="nl-banner-thumb"><BannerPreview src={imageUrl}/><button type="button" onClick={()=>setImageUrl("")}>Remove image</button></div>}</div></section>
        <section className="nl-card"><h3><span>04</span>Contact information <small>Optional</small></h3><div className="nl-contact-grid"><label><span>Contact name</span><input autoComplete="name" value={contactName} onChange={e=>setContactName(e.target.value)}/></label><label><span>Contact email</span><input type="email" autoComplete="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)}/></label><label><span>Contact phone</span><input type="tel" autoComplete="tel" maxLength={14} value={contactPhone} onChange={e=>setContactPhone(formatPhone(e.target.value))}/></label></div></section>
      </fieldset>
      {(uploading || enhancing)&&<p className="nl-feedback" role="status">{uploading?"Uploading image…":"Enhancing your message…"}</p>}{feedback&&<p className="nl-error" role="alert">{feedback}</p>}
      <div className="nl-compose-footer"><p>No email is sent until you review and choose Send.</p><button type="submit" disabled={locked || status === "success"}>{status === "success"?"Newsletter already sent":"Continue to review →"}</button></div>
    </form>}
  </section>;
}
function BannerPreview({src}) {const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return failed?<p className="nl-help">Image preview unavailable. Check the URL.</p>:<img className="nl-banner" src={src} alt="Newsletter banner" onError={()=>setFailed(true)}/>;}

const STYLES = `
.nl-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.nl-panel *{box-sizing:border-box}.nl-panel :is(h2,h3,p){margin:0}.nl-panel :is(input,textarea,button){font:inherit}.nl-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.nl-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.nl-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.nl-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.nl-header p:last-child{font-size:12px;color:#73617e}.nl-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.nl-required{font-size:11px;color:#776580;margin-bottom:12px!important}.nl-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.nl-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.nl-card:nth-child(2){border-top-color:#97bca9}.nl-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.nl-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.nl-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.nl-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.nl-grid label{min-width:0}.nl-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.nl-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.nl-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.nl-grid :is(input,textarea)::placeholder{color:#8a7b92}.nl-grid textarea{resize:vertical;min-height:120px}.nl-wide{grid-column:1/-1}.nl-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.nl-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.nl-active>span:nth-child(2){flex:1;min-width:0}.nl-active strong{display:block;font-size:13px;color:#3e5949}.nl-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.nl-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.nl-inactive{background:#e8e4ed;color:#6e5f79}.nl-footer{display:flex;justify-content:flex-end;margin-top:16px}.nl-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.nl-footer button:hover:not(:disabled){background:#62406e}.nl-footer button:disabled{opacity:.6;cursor:wait}.nl-error,.nl-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.nl-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.nl-grid{grid-template-columns:1fr;gap:13px}.nl-panel{padding:12px}.nl-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.nl-active>input{margin-top:3px}.nl-badge{margin-top:3px}.nl-footer button{width:100%}.nl-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.nl-panel *{transition:none!important}}

.nl-panel button{min-height:44px;border:1px solid #cdbed7;border-radius:7px;background:#fff;color:#694a7c;padding:9px 13px;font-size:12px;font-weight:650;cursor:pointer}.nl-panel button:disabled{opacity:.55;cursor:not-allowed}.nl-text-size{flex-shrink:0}.nl-text-size[aria-pressed=true]{background:#795587;color:#fff}.nl-steps{display:flex;gap:10px;list-style:none;margin:0 0 15px;padding:0;font-size:11px;color:#766480}.nl-steps li{padding:7px 12px;border-radius:6px;background:#eae4ee}.nl-steps li[aria-current]{background:#e3d4ee;color:#624173;font-weight:750}.nl-help{font-size:12px;color:#7a6784;margin:6px 0 10px!important}.nl-audience{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.nl-audience label{display:flex;align-items:center;gap:9px;min-height:48px;padding:10px 12px;border:1px solid #d9cde1;border-radius:7px;cursor:pointer;background:#faf7fc;font-size:13px;text-transform:capitalize}.nl-audience input{accent-color:#795587;width:18px;height:18px;flex-shrink:0}.nl-audience .nl-selected{background:#eadef3;border-color:#9a74b0;color:#604270;font-weight:700}.nl-message-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}.nl-message-heading label{font-size:11px;font-weight:750;color:#685173}.nl-grid textarea{font-size:16px;line-height:1.8}.nl-banner-layout{display:flex;align-items:start;gap:18px}.nl-banner-layout>.nl-grid{flex:1;min-width:0}.nl-panel input[type=file]{font-size:12px}.nl-banner-thumb{width:180px;flex-shrink:0}.nl-banner{display:block;width:100%;max-height:340px;object-fit:contain;border:1px solid #e4dbe9;border-radius:7px;background:#f6f2f9}.nl-banner-thumb .nl-banner{height:105px}.nl-banner-thumb button{margin-top:7px;width:100%}.nl-contact-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.nl-contact-grid label{min-width:0}.nl-contact-grid label>span{display:block;font-size:11px;font-weight:750;margin-bottom:5px;color:#685173}.nl-contact-grid input{width:100%;min-width:0;min-height:46px;padding:10px 12px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;font-size:16px}.nl-compose-footer,.nl-review-actions{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:16px}.nl-compose-footer p{font-size:11px;color:#7a6584}.nl-panel .nl-compose-footer button,.nl-panel .nl-send{background:#795587;color:#fff;border-color:#795587;min-height:48px}.nl-panel .nl-send:hover:not(:disabled),.nl-compose-footer button:hover:not(:disabled){background:#61416e}.nl-feedback{font-size:13px;color:#735087;margin-top:12px!important}.nl-audience-summary{display:flex;align-items:center;gap:14px;font-size:12px;margin-bottom:14px}.nl-audience-summary>div{display:flex;flex-wrap:wrap;gap:7px}.nl-audience-summary span{padding:4px 9px;border-radius:20px;background:#e5daee;color:#684878;text-transform:capitalize}.nl-preview{background:#fff;border:1px solid #ddd0e5;border-top:4px solid #b39ac3;border-radius:9px;overflow:hidden}.nl-preview>header{padding:20px;background:#f3edf7;border-bottom:1px solid #e3d7eb}.nl-preview h3{font-size:clamp(22px,3vw,32px);line-height:1.25;margin-top:8px;overflow-wrap:anywhere}.nl-preview-body{padding:20px;max-height:65vh;overflow-y:auto}.nl-copy{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.85;font-size:15px;margin-top:16px!important}.nl-contact-preview{padding:14px;border:1px solid #e3d8e8;background:#faf7fc;border-radius:7px;margin-top:20px;font-size:13px;overflow-wrap:anywhere}.nl-contact-preview h4{margin:0 0 7px;font-size:12px}.nl-preview>footer{padding:11px 20px;border-top:1px solid #e7ddeb;font-size:10px;color:#786781;background:#faf8fb}.nl-success,.nl-error{margin-top:14px}.nl-large .nl-copy{font-size:19px}.nl-large textarea{font-size:19px}
@media(max-width:640px){.nl-header{align-items:flex-start;flex-wrap:wrap}.nl-audience{grid-template-columns:repeat(2,minmax(0,1fr))}.nl-contact-grid{grid-template-columns:1fr}.nl-banner-layout{flex-direction:column}.nl-banner-layout>.nl-grid{width:100%}.nl-banner-thumb{width:100%}.nl-banner-thumb .nl-banner{height:140px}.nl-compose-footer{align-items:stretch;flex-direction:column}.nl-review-actions{flex-wrap:wrap}.nl-review-actions button{flex:1;min-width:130px}.nl-preview-body,.nl-preview>header{padding:15px}.nl-message-heading{flex-wrap:wrap}}
`;
