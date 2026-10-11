import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const PRIDE_NAME = "Hartford Pride Center";
const STAFF_ROLES = ["Executive Director","Program Director","Operations Manager","Volunteer Coordinator","Community Outreach Coordinator","Events Coordinator","Fundraising Manager","Development Director","Communications Manager","Marketing & Social Media","Education Coordinator","Youth Program Coordinator","Health & Wellness Coordinator","Advocacy & Policy Lead","Grant Writer","Finance Manager","Office Administrator","Board Member","Software Engineer (Web Designer)","Intern","Volunteer","Support Staff"];
const emptyForm = () => ({pride_id:2,first_name:"",last_name:"",role:"",email:"",phone:"",username:"",pin:"",bio:"",image_url:""});
const roleOptions = STAFF_ROLES.map(role => ({value:role,label:role}));
const formatPhoneNumber = value => {
  const digits=(value||"").replace(/\D/g,"").slice(0,10);
  if(digits.length<4)return digits;
  if(digits.length<7)return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
};
const selectStyles = {
  control:(base,state)=>({...base,backgroundColor:"#fff",borderColor:state.isFocused?"#805995":"#cfc3d9",boxShadow:state.isFocused?"0 0 0 2px #e2d2ed":"none",minHeight:46,borderRadius:6,fontSize:16}),
  menu:base=>({...base,backgroundColor:"#fff",color:"#392f43",zIndex:20}),
  option:(base,state)=>({...base,backgroundColor:state.isFocused?"#eee5f5":"#fff",color:"#493652",minHeight:44}),
  multiValue:base=>({...base,backgroundColor:"#eee5f5",borderRadius:5}),
  multiValueLabel:base=>({...base,color:"#624575",fontWeight:650}),
  multiValueRemove:base=>({...base,color:"#624575",minWidth:28,":hover":{backgroundColor:"#e0cfe9",color:"#493652"}}),
  input:base=>({...base,color:"#392f43"}),
  placeholder:base=>({...base,color:"#80718a"}),
};
function Photo({src}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[src]);
  return <div className="ss-photo">{src&&!failed?<img src={src} alt="Staff profile preview" onError={()=>setFailed(true)}/>:<span>{failed?"Preview unavailable":"✦"}</span>}</div>;
}
export default function StaffSignup() {
  const id=useId();
  const [form,setForm]=useState(emptyForm);
  const [prideName,setPrideName]=useState("Loading…");
  const [prideError,setPrideError]=useState("");
  const [prideRetry,setPrideRetry]=useState(0);
  useEffect(()=>{
    let active=true;
    setPrideError("");setPrideName("Loading…");
    axios.get(`${API}/api/pride/2`).then(res=>{
      if(!active)return;
      if(!res.data || res.data.id!==2){setPrideError("Pride Center ID 2 not found.");setPrideName(PRIDE_NAME);return;}
      setPrideName(res.data.name || PRIDE_NAME);
    }).catch(()=>{if(active){setPrideError("Failed to load Pride Center details.");setPrideName(PRIDE_NAME);}});
    return()=>{active=false;};
  },[prideRetry]);
  const [busy,setBusy]=useState("");
  const [step,setStep]=useState(0);
  const formRef=useRef(null);
  const stepHeading=useRef(null);
  const stepLabels=["Account details","Profile & roles","Community bio"];
  const goToStep=next=>{setError("");setStep(next);requestAnimationFrame(()=>stepHeading.current?.focus());};
  const nextStep=()=>{
    const fields=formRef.current?.querySelectorAll('[data-step="'+step+'"] input');
    for(const field of fields||[]){if(!field.reportValidity())return;}
    goToStep(Math.min(2,step+1));
  };
  const [error,setError]=useState("");
  const [successData,setSuccessData]=useState(null);
  const [showPin,setShowPin]=useState(false);
  const [largeBio,setLargeBio]=useState(false);
  const pending=useRef(false);
  const fileInput=useRef(null);
  const nameInput=useRef(null);
  const dialog=useRef(null);
  useEffect(()=>{
    if(!successData)return;
    const node=dialog.current;
    if(node&&!node.open)node.showModal();
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{if(node?.open)node.close();document.body.style.overflow=previous;};
  },[successData]);
  const change=(name,value)=>setForm(prev=>({...prev,[name]:name==="phone"?formatPhoneNumber(value):value}));
  const begin=action=>{if(pending.current||successData)return false;pending.current=true;setBusy(action);setError("");return true;};
  const finish=()=>{pending.current=false;setBusy("");};
  const handleImageUpload=async e=>{
    const file=e.target.files?.[0];if(!file||!begin("upload"))return;
    try{const data=new FormData();data.append("file",file);data.append("upload_preset",UPLOAD_PRESET);data.append("folder","pride_staff");
      const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,{method:"POST",body:data});
      const result=await res.json();if(!res.ok||!result.secure_url)throw new Error("Missing image URL");change("image_url",result.secure_url);toast.success("Image uploaded");
    }catch{setError("Image upload failed. Please try again.");toast.error("Image upload failed");}
    finally{finish();if(fileInput.current)fileInput.current.value="";}
  };
  const generateBio=async()=>{
    if(!form.first_name.trim()||!form.role){setError("Add a name and role first.");toast.error("Add a name and role first");return;}
    if(!begin("bio"))return;
    try{
      const keyPoints=`Name: ${form.first_name} ${form.last_name}\nRole: ${form.role}\n\nUser-written notes to include:\n${form.bio||"(none provided)"}`;
      const res=await axios.post(`${API}/api/pride/generate-bio`,{key_points:keyPoints,role_type:"Pride Staff Member"});
      if(typeof res.data.bio!=="string")throw new Error("Missing bio");change("bio",res.data.bio);toast.success("Bio generated ✨");
    }catch{setError("Failed to generate bio. Your existing notes have been kept.");toast.error("Failed to generate bio");}finally{finish();}
  };
  const handleSubmit=async e=>{
    e.preventDefault();
    if(step<2){nextStep();return;}
    if(![form.first_name,form.last_name,form.username].every(value=>value.trim())){setError("Please complete the first name, last name, and username.");return;}
    if(!/^[0-9]+$/.test(form.pin)){setError("Enter a numeric PIN in Account details.");setStep(0);requestAnimationFrame(()=>nameInput.current?.focus());return;}
    if(!begin("save"))return;
    try{
      const res=await axios.post(`${API}/api/pride-staff`,{
        pride_id:form.pride_id,first_name:form.first_name,last_name:form.last_name,role:form.role,
        email:form.email||null,phone:form.phone||null,username:form.username,pin:form.pin,bio:form.bio||null,image_url:form.image_url||null,
      });
      const staff=res.data?.staff;
      setSuccessData({prideName:prideName==="Loading…"?PRIDE_NAME:prideName,name:`${staff?.first_name??form.first_name} ${staff?.last_name??form.last_name}`,username:staff?.username??form.username,role:staff?.role??form.role,email:staff?.email??form.email,phone:staff?.phone??form.phone});
      toast.success("Pride staff account created 🎉");setForm(emptyForm());setShowPin(false);if(fileInput.current)fileInput.current.value="";
    }catch(err){const message=typeof err.response?.data?.error==="string"?err.response.data.error:"Failed to create staff";setError(message);toast.error(message);}finally{finish();}
  };
  const closeSuccess=()=>{setSuccessData(null);setStep(0);requestAnimationFrame(()=>nameInput.current?.focus());};
  const field=(key,label,type="text",autoComplete,required=true)=> <label className="ss-field" htmlFor={`${id}-${key}`}><span>{label}{required&&" *"}</span><input ref={key==="first_name"?nameInput:undefined} id={`${id}-${key}`} type={type} name={key} autoComplete={autoComplete} value={form[key]} onChange={e=>change(key,e.target.value)} required={required&&step===0}/></label>;
  return <section className="ss-panel" aria-labelledby={`${id}-heading`}>
    <style>{STYLES}</style>
    <header className="ss-header"><div><p className="ss-eyebrow">Hartford Pride Center</p><h2 id={`${id}-heading`}>Create a staff account</h2><p>A new connection on the team. A new way to make a difference.</p></div><span className="ss-header-icon" aria-hidden="true">✦</span></header>
    <nav className="ss-steps" aria-label="Signup progress">{stepLabels.map((label,index)=><div key={label} className={`ss-step ${index===step?"is-current":index<step?"is-complete":""}`} aria-current={index===step?"step":undefined}><span aria-hidden="true">{index<step?"✓":index+1}</span><strong>{label}</strong></div>)}</nav>
    <div className="ss-step-intro"><h3 ref={stepHeading} tabIndex={-1}>{stepLabels[step]}</h3><p>{step===0?"Start with login and contact details.":step===1?"Add a photo and choose roles. Optional details can be added later.":"Add a short bio, or leave it blank and create the account."}</p><span>Step {step+1} of 3</span></div>
    <form ref={formRef} onSubmit={handleSubmit} aria-busy={!!busy}>
      <p className="ss-required">* Required. Contact information, roles, photo, and bio are optional.</p>
      {error&&<div className="ss-error" role="alert">{error}</div>}{prideError&&<div className="ss-error" role="alert">{prideError} <button className="ss-secondary" type="button" disabled={!!busy} onClick={()=>setPrideRetry(v=>v+1)}>Retry</button></div>}
      <fieldset className="ss-fields" disabled={!!busy||!!successData}><div className="ss-columns">
        <section className="ss-card" data-step="0" hidden={step!==0}><h3><span>01</span>Account details</h3><div className="ss-stack"><label className="ss-field"><span>Pride center</span><input value={prideName} readOnly/></label><div className="ss-grid">{field("first_name","First name","text","given-name")}{field("last_name","Last name","text","family-name")}</div><div className="ss-grid">{field("email","Email address","email","email",false)}{field("phone","Phone","tel","tel-national",false)}</div>{field("username","Username","text","username")}<div><label className="ss-pin-label" htmlFor={`${id}-pin`}>PIN *</label><div className="ss-pin"><input id={`${id}-pin`} name="pin" type={showPin?"text":"password"} inputMode="numeric" pattern="[0-9]*" autoComplete="new-password" value={form.pin} onChange={e=>change("pin",e.target.value)} required={step===0}/><button type="button" aria-label={showPin?"Hide PIN":"Show PIN"} aria-pressed={showPin} aria-controls={`${id}-pin`} onClick={()=>setShowPin(v=>!v)}>{showPin?"Hide":"Show"}</button></div></div></div></section>
        <section className="ss-card" data-step="1" hidden={step!==1}><h3><span>02</span>Profile & roles</h3><div className="ss-stack"><div className="ss-upload"><Photo src={form.image_url}/><label className="ss-field" htmlFor={`${id}-file`}><span>Profile image</span><input id={`${id}-file`} ref={fileInput} type="file" accept="image/*" onChange={handleImageUpload}/></label></div><label className="ss-field"><span>Or paste an image URL</span><input value={form.image_url} onChange={e=>change("image_url",e.target.value)} placeholder="https://…"/></label>{form.image_url&&<button className="ss-secondary ss-remove" type="button" onClick={()=>change("image_url","")}>Remove image</button>}

          <div><label className="ss-select-label" htmlFor={`${id}-roles`}>Staff roles</label><Select inputId={`${id}-roles`} instanceId={`${id}-role-select`} isMulti isSearchable isDisabled={!!busy||!!successData} options={roleOptions} value={form.role?form.role.split(",").map(role=>({value:role.trim(),label:role.trim()})):[]} onChange={selected=>change("role",(selected||[]).map(option=>option.value).join(", "))} placeholder="Search and select roles…" styles={selectStyles} maxMenuHeight={220}/><p className="ss-hint">Select one or more roles, or leave this blank.</p></div>
        </div></section>
        <section className="ss-card ss-wide" data-step="2" hidden={step!==2}><h3><span>03</span>Community bio <small>Optional</small></h3><div className="ss-bio-toolbar"><label htmlFor={`${id}-bio`}>About this staff member</label><button type="button" className="ss-secondary" aria-pressed={largeBio} aria-controls={`${id}-bio`} onClick={()=>setLargeBio(v=>!v)}>{largeBio?"A− Standard text":"A+ Larger text"}</button></div><textarea id={`${id}-bio`} name="bio" rows={4} value={form.bio} style={{fontSize:largeBio?"20px":"16px"}} onChange={e=>change("bio",e.target.value)} placeholder="Tell the community about this staff member, or add notes to include in a generated bio."/><div className="ss-bio-footer"><p className="ss-hint">Review generated text before saving.</p><button className="ss-secondary" type="button" onClick={generateBio}>{busy==="bio"?"Generating…":"✦ Generate bio"}</button></div></section>
      </div></fieldset>
      <footer className="ss-footer"><p role="status">{busy==="upload"?"Uploading profile image…":busy==="bio"?"Generating bio…":busy==="save"?"Creating staff…":"Your entries stay saved here as you move between steps."}</p><div className="ss-step-actions">{step>0&&<button type="button" className="ss-back" onClick={()=>goToStep(step-1)} disabled={!!busy||!!successData}>Back</button>}{step<2?<button type="button" onClick={nextStep} disabled={!!busy||!!successData}>Next: {stepLabels[step+1]} <span aria-hidden="true">→</span></button>:<button type="submit" disabled={!!busy||!!successData}>{busy==="save"?"Creating…":"Create Pride staff"}<span aria-hidden="true">+</span></button>}</div></footer>
    </form>
    {successData&&<dialog ref={dialog} className="ss-dialog" aria-labelledby={`${id}-success`} onCancel={e=>{e.preventDefault();closeSuccess();}}><span className="ss-success-star" aria-hidden="true">✦</span><h2 id={`${id}-success`}>Staff created!</h2><p>{successData.prideName}</p><dl><dt>Name</dt><dd>{successData.name}</dd><dt>Username</dt><dd>{successData.username}</dd>{successData.email&&<><dt>Email</dt><dd>{successData.email}</dd></>}{successData.phone&&<><dt>Phone</dt><dd>{successData.phone}</dd></>}<dt>Roles</dt><dd>{successData.role||"No roles selected"}</dd></dl><p className="ss-activation">✓ Staff account created</p><button type="button" onClick={closeSuccess} autoFocus>Create another staff member</button></dialog>}
  </section>;
}

const STYLES = `
.ss-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.ss-panel *{box-sizing:border-box}.ss-panel :is(h2,h3,p){margin:0}.ss-panel :is(input,textarea,button){font:inherit}.ss-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.ss-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.ss-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.ss-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.ss-header p:last-child{font-size:12px;color:#73617e}.ss-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.ss-required{font-size:11px;color:#776580;margin-bottom:12px!important}.ss-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.ss-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.ss-card:nth-child(2){border-top-color:#97bca9}.ss-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.ss-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.ss-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.ss-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ss-grid label{min-width:0}.ss-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.ss-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.ss-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.ss-grid :is(input,textarea)::placeholder{color:#8a7b92}.ss-grid textarea{resize:vertical;min-height:120px}.ss-wide{grid-column:1/-1}.ss-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.ss-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.ss-active>span:nth-child(2){flex:1;min-width:0}.ss-active strong{display:block;font-size:13px;color:#3e5949}.ss-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.ss-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.ss-inactive{background:#e8e4ed;color:#6e5f79}.ss-footer{display:flex;justify-content:flex-end;margin-top:16px}.ss-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.ss-footer button:hover:not(:disabled){background:#62406e}.ss-footer button:disabled{opacity:.6;cursor:wait}.ss-error,.ss-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.ss-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.ss-grid{grid-template-columns:1fr;gap:13px}.ss-panel{padding:12px}.ss-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.ss-active>input{margin-top:3px}.ss-badge{margin-top:3px}.ss-footer button{width:100%}.ss-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.ss-panel *{transition:none!important}}

.ss-panel{max-width:1150px;margin-inline:auto}.ss-columns{display:grid;grid-template-columns:1fr 1fr;gap:12px;min-width:0}.ss-stack{display:grid;gap:13px}.ss-field{display:block;min-width:0}.ss-field>span,.ss-select-label,.ss-pin-label{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}.ss-panel .ss-field input,.ss-pin input,.ss-panel textarea{display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font:16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}.ss-field input[readonly]{background:#f4eff7;color:#766181}.ss-panel input::placeholder,.ss-panel textarea::placeholder{color:#80718a}.ss-pin{display:flex;gap:7px}.ss-pin input{flex:1;min-width:0}.ss-pin button,.ss-secondary{min-height:44px;padding:7px 11px;border:1px solid #d4c8df;border-radius:6px;background:#f5eff9;color:#634577;font-size:12px;font-weight:700;cursor:pointer}.ss-pin button{min-width:58px}.ss-upload{display:flex;gap:13px;align-items:center}.ss-upload .ss-field{flex:1;min-width:0}.ss-photo{width:80px;height:80px;flex-shrink:0;display:grid;place-items:center;background:linear-gradient(135deg,#f9e3ec,#e9e4f7,#e4f1eb);border:1px solid #dfd2e7;border-radius:9px;overflow:hidden}.ss-photo img{width:100%;height:100%;object-fit:cover}.ss-photo span{font-size:13px;color:#906ba0;text-align:center;padding:5px}.ss-panel input[type=file]{font-size:12px;padding:8px;overflow:hidden}.ss-panel input::file-selector-button{border:0;border-radius:4px;padding:6px 8px;background:#eee6f5;color:#654775;margin-right:7px}.ss-remove{justify-self:start}.ss-hint{font-size:11px;color:#73617e;margin-top:6px!important}.ss-role-note{font-size:11px;color:#73617e;margin:8px 0!important}.ss-role-note strong{display:inline-block;background:#e8dcf1;color:#684580;padding:3px 9px;border-radius:5px;margin-right:7px}.ss-panel textarea{height:135px;min-height:110px;max-height:280px;resize:vertical;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}.ss-bio-toolbar,.ss-bio-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.ss-bio-toolbar{margin-bottom:8px}.ss-bio-toolbar label{font-size:12px;font-weight:750;color:#685173}.ss-bio-footer{margin-top:8px}.ss-card:nth-child(3){border-top-color:#c79ba9}.ss-footer{align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.ss-footer p{font-size:12px;color:#73617e}.ss-fields:disabled{opacity:.7}.ss-dialog{position:fixed;inset:0;margin:auto;width:min(440px,calc(100% - 28px));max-height:85dvh;overflow:auto;padding:26px;border:1px solid #d7c8e2;border-radius:14px;background:#fbf8fd;color:#493652;box-shadow:0 25px 80px #30203640;text-align:center}.ss-dialog::backdrop{background:#241a32aa;backdrop-filter:blur(4px)}.ss-dialog h2{font-size:26px}.ss-dialog>p{font-size:13px;color:#73617e;margin-top:7px}.ss-success-star{display:block;font-size:36px;color:#a17bae}.ss-dialog dl{text-align:left;background:#efe8f5;padding:15px;border-radius:8px;margin:18px 0;overflow-wrap:anywhere}.ss-dialog dt{font-size:11px;font-weight:700;color:#80658d}.ss-dialog dd{margin:0 0 9px;font-size:16px;font-weight:650}.ss-dialog dd:last-child{margin-bottom:0}.ss-dialog .ss-activation{color:#436953;background:#e8f3ec;padding:10px;border-radius:6px}.ss-dialog button{width:100%;min-height:46px;padding:11px;border:0;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;margin-top:16px;cursor:pointer}@media(max-width:800px){.ss-columns{grid-template-columns:1fr}}@media(max-width:640px){.ss-footer{flex-direction:column;align-items:stretch}.ss-footer button{width:100%}.ss-upload{align-items:flex-start;flex-direction:column}.ss-upload .ss-field{width:100%}}

.ss-panel{max-width:90%}.ss-columns{display:block}.ss-card[hidden]{display:none!important}.ss-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:18px 0}.ss-step{display:flex;gap:8px;align-items:center;padding:10px 8px;background:#efebf3;border-radius:7px;color:#81738b;min-width:0}.ss-step>span{display:grid;place-items:center;width:26px;height:26px;flex-shrink:0;border-radius:50%;background:#e0d8e7;font-size:11px;font-weight:750}.ss-step strong{font-size:11px;line-height:1.3}.ss-step.is-current{background:#e9ddf2;color:#624276}.ss-step.is-current>span{background:#795587;color:white}.ss-step.is-complete{background:#e6f1eb;color:#436c55}.ss-step.is-complete>span{background:#cbe2d4}.ss-step-intro{position:relative;margin:0 0 14px;padding-right:70px}.ss-step-intro h3{margin:0;font-size:19px;color:#533c61}.ss-step-intro p{font-size:12px;color:#73617e;margin:4px 0 0}.ss-step-intro>span{position:absolute;right:0;top:3px;font-size:11px;color:#80648e}.ss-step-actions{display:flex;gap:8px;flex-wrap:wrap}.ss-footer .ss-back{background:white;color:#795587;border-color:#d4c8df}.ss-footer{align-items:flex-end}.ss-footer>p{max-width:290px}@media(max-width:640px){.ss-step{flex-direction:column;text-align:center;padding:9px 4px;gap:5px}.ss-step strong{font-size:10px}.ss-step-actions{display:flex;flex-wrap:nowrap}.ss-step-actions button{flex:1;gap:8px;padding:10px;font-size:12px}.ss-step-actions .ss-back{flex:0 0 auto;width:auto}}
`;
