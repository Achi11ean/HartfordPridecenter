import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const PRIDE_NAME = "Hartford Pride Center";
const ROLE_OPTIONS = ["Admin","Director","Coordinator","Event Lead","Volunteer Manager","Software Engineer","Marketing","Finance","Community Outreach","Executive Director","Program Director","Operations Manager","Volunteer Coordinator","Web Designer","Community Outreach Coordinator","Events Coordinator","Fundraising Manager","Development Director","Communications Manager","Marketing & Social Media","Grant Writer","Finance Manager","Office Administrator","Board Member","Intern","Volunteer","Support Staff"];
const emptyForm = () => ({pride_id:2,name:"",email:"",username:"",pin:"",roles:["Admin"],image_url:"",bio:""});
const roleOptions = ROLE_OPTIONS.filter(role => role !== "Admin").map(role => ({value:role,label:role}));
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
  return <div className="as-photo">{src&&!failed?<img src={src} alt="Admin profile preview" onError={()=>setFailed(true)}/>:<span>{failed?"Preview unavailable":"✦"}</span>}</div>;
}
export default function AdminSignup() {
  const id=useId();
  const [form,setForm]=useState(emptyForm);
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
  const change=(name,value)=>setForm(prev=>({...prev,[name]:value}));
  const begin=action=>{if(pending.current||successData)return false;pending.current=true;setBusy(action);setError("");return true;};
  const finish=()=>{pending.current=false;setBusy("");};
  const handleImageUpload=async e=>{
    const file=e.target.files?.[0];if(!file||!begin("upload"))return;
    try{const data=new FormData();data.append("file",file);data.append("upload_preset",UPLOAD_PRESET);
      const res=await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,data);
      if(!res.data.secure_url)throw new Error("Missing image URL");change("image_url",res.data.secure_url);
    }catch{setError("Image upload failed. Please try again.");toast.error("Image upload failed");}
    finally{finish();if(fileInput.current)fileInput.current.value="";}
  };
  const generateBio=async()=>{
    if(!form.name.trim()||!form.roles.length){setError("Add a name and role first.");toast.error("Add a name and role first");return;}
    if(!begin("bio"))return;
    try{
      const keyPoints=`Name: ${form.name}\nRoles: ${form.roles.join(", ")}\n\nUser-written notes to include:\n${form.bio||"(none provided)"}`;
      const res=await axios.post(`${API}/api/pride/generate-bio`,{key_points:keyPoints,role_type:"Pride Administrator"});
      if(typeof res.data.bio!=="string")throw new Error("Missing bio");change("bio",res.data.bio);toast.success("Bio generated ✨");
    }catch{setError("Failed to generate bio. Your existing notes have been kept.");toast.error("Failed to generate bio");}finally{finish();}
  };
  const handleSubmit=async e=>{
    e.preventDefault();
    if(step<2){nextStep();return;}
    if(![form.name,form.email,form.username].every(value=>value.trim())){setError("Please complete the name, email, and username.");return;}
    if(!/^[0-9]+$/.test(form.pin)){setError("Enter a numeric PIN in Account details.");setStep(0);requestAnimationFrame(()=>nameInput.current?.focus());return;}
    if(!begin("save"))return;
    try{
      const res=await axios.post(`${API}/api/pride/2/admins`,{name:form.name,email:form.email,username:form.username,pin:form.pin,image_url:form.image_url||null,bio:form.bio||null,other_roles:form.roles.filter(role=>role!=="Admin").join(", ")});
      const admin=res.data?.admin;
      setSuccessData({prideName:PRIDE_NAME,name:admin?.name??form.name,username:admin?.username??form.username,isActive:admin?.is_active});
      toast.success("Pride admin created successfully 🎉");setForm(emptyForm());setShowPin(false);if(fileInput.current)fileInput.current.value="";
    }catch(err){const message=typeof err.response?.data?.error==="string"?err.response.data.error:"Failed to create Pride admin";setError(message);toast.error(message);}finally{finish();}
  };
  const closeSuccess=()=>{setSuccessData(null);setStep(0);requestAnimationFrame(()=>nameInput.current?.focus());};
  const field=(key,label,type="text",autoComplete)=> <label className="as-field" htmlFor={`${id}-${key}`}><span>{label} *</span><input ref={key==="name"?nameInput:undefined} id={`${id}-${key}`} type={type} name={key} autoComplete={autoComplete} value={form[key]} onChange={e=>change(key,e.target.value)} required={step===0}/></label>;
  return <section className="as-panel" aria-labelledby={`${id}-heading`}>
    <style>{STYLES}</style>
    <header className="as-header"><div><p className="as-eyebrow">Hartford Pride Center</p><h2 id={`${id}-heading`}>Create an admin</h2><p>A new connection on the team. A new way to make a difference.</p></div><span className="as-header-icon" aria-hidden="true">✦</span></header>
    <nav className="as-steps" aria-label="Signup progress">{stepLabels.map((label,index)=><div key={label} className={`as-step ${index===step?"is-current":index<step?"is-complete":""}`} aria-current={index===step?"step":undefined}><span aria-hidden="true">{index<step?"✓":index+1}</span><strong>{label}</strong></div>)}</nav>
    <div className="as-step-intro"><h3 ref={stepHeading} tabIndex={-1}>{stepLabels[step]}</h3><p>{step===0?"Start with login and contact details.":step===1?"Add a photo and choose roles. Optional details can be added later.":"Add a short bio, or leave it blank and create the account."}</p><span>Step {step+1} of 3</span></div>
    <form ref={formRef} onSubmit={handleSubmit} aria-busy={!!busy}>
      <p className="as-required">* Required. Profile image, additional roles, and bio are optional.</p>
      {error&&<div className="as-error" role="alert">{error}</div>}
      <fieldset className="as-fields" disabled={!!busy||!!successData}><div className="as-columns">
        <section className="as-card" data-step="0" hidden={step!==0}><h3><span>01</span>Account details</h3><div className="as-stack"><label className="as-field"><span>Pride center</span><input value={PRIDE_NAME} readOnly/></label>{field("name","Full name","text","name")}{field("email","Email address","email","email")}{field("username","Username","text","username")}<div><label className="as-pin-label" htmlFor={`${id}-pin`}>PIN *</label><div className="as-pin"><input id={`${id}-pin`} name="pin" type={showPin?"text":"password"} inputMode="numeric" pattern="[0-9]*" autoComplete="new-password" value={form.pin} onChange={e=>change("pin",e.target.value)} required={step===0}/><button type="button" aria-label={showPin?"Hide PIN":"Show PIN"} aria-pressed={showPin} aria-controls={`${id}-pin`} onClick={()=>setShowPin(v=>!v)}>{showPin?"Hide":"Show"}</button></div></div></div></section>
        <section className="as-card" data-step="1" hidden={step!==1}><h3><span>02</span>Profile & roles</h3><div className="as-stack"><div className="as-upload"><Photo src={form.image_url}/><label className="as-field" htmlFor={`${id}-file`}><span>Profile image</span><input id={`${id}-file`} ref={fileInput} type="file" accept="image/*" onChange={handleImageUpload}/></label></div>{form.image_url&&<><label className="as-field"><span>Uploaded image URL</span><input value={form.image_url} readOnly/></label><button className="as-secondary as-remove" type="button" onClick={()=>change("image_url","")}>Remove image</button></>}
          <div><label className="as-select-label" htmlFor={`${id}-roles`}>Additional roles</label><p className="as-role-note"><strong>Admin</strong> Always included</p><Select inputId={`${id}-roles`} instanceId={`${id}-role-select`} isMulti isSearchable isDisabled={!!busy||!!successData} options={roleOptions} value={form.roles.filter(role=>role!=="Admin").map(role=>({value:role,label:role}))} onChange={selected=>change("roles",["Admin",...(selected||[]).map(option=>option.value)])} placeholder="Search and select roles…" styles={selectStyles} maxMenuHeight={220}/><p className="as-hint">The Admin role is permanent and cannot be removed.</p></div>
        </div></section>
        <section className="as-card as-wide" data-step="2" hidden={step!==2}><h3><span>03</span>Community bio <small>Optional</small></h3><div className="as-bio-toolbar"><label htmlFor={`${id}-bio`}>About this admin</label><button type="button" className="as-secondary" aria-pressed={largeBio} aria-controls={`${id}-bio`} onClick={()=>setLargeBio(v=>!v)}>{largeBio?"A− Standard text":"A+ Larger text"}</button></div><textarea id={`${id}-bio`} name="bio" rows={4} value={form.bio} style={{fontSize:largeBio?"20px":"16px"}} onChange={e=>change("bio",e.target.value)} placeholder="Tell the community about this admin, or add notes to include in a generated bio."/><div className="as-bio-footer"><p className="as-hint">This appears on the public “Our Team” page. Review generated text before saving.</p><button className="as-secondary" type="button" onClick={generateBio}>{busy==="bio"?"Generating…":"✦ Generate bio"}</button></div></section>
      </div></fieldset>
      <footer className="as-footer"><p role="status">{busy==="upload"?"Uploading profile image…":busy==="bio"?"Generating bio…":busy==="save"?"Creating admin…":"Your entries stay saved here as you move between steps."}</p><div className="as-step-actions">{step>0&&<button type="button" className="as-back" onClick={()=>goToStep(step-1)} disabled={!!busy||!!successData}>Back</button>}{step<2?<button type="button" onClick={nextStep} disabled={!!busy||!!successData}>Next: {stepLabels[step+1]} <span aria-hidden="true">→</span></button>:<button type="submit" disabled={!!busy||!!successData}>{busy==="save"?"Creating…":"Create Pride admin"}<span aria-hidden="true">+</span></button>}</div></footer>
    </form>
    {successData&&<dialog ref={dialog} className="as-dialog" aria-labelledby={`${id}-success`} onCancel={e=>{e.preventDefault();closeSuccess();}}><span className="as-success-star" aria-hidden="true">✦</span><h2 id={`${id}-success`}>Admin created!</h2><p>{successData.prideName}</p><dl><dt>Name</dt><dd>{successData.name}</dd><dt>Username</dt><dd>{successData.username}</dd></dl><p className="as-activation">{successData.isActive?"✓ Admin is active immediately":"Admin pending activation"}</p><button type="button" onClick={closeSuccess} autoFocus>Create another admin</button></dialog>}
  </section>;
}

const STYLES = `
.as-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.as-panel *{box-sizing:border-box}.as-panel :is(h2,h3,p){margin:0}.as-panel :is(input,textarea,button){font:inherit}.as-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.as-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.as-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.as-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.as-header p:last-child{font-size:12px;color:#73617e}.as-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.as-required{font-size:11px;color:#776580;margin-bottom:12px!important}.as-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.as-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.as-card:nth-child(2){border-top-color:#97bca9}.as-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.as-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.as-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.as-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.as-grid label{min-width:0}.as-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.as-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.as-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.as-grid :is(input,textarea)::placeholder{color:#8a7b92}.as-grid textarea{resize:vertical;min-height:120px}.as-wide{grid-column:1/-1}.as-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.as-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.as-active>span:nth-child(2){flex:1;min-width:0}.as-active strong{display:block;font-size:13px;color:#3e5949}.as-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.as-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.as-inactive{background:#e8e4ed;color:#6e5f79}.as-footer{display:flex;justify-content:flex-end;margin-top:16px}.as-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.as-footer button:hover:not(:disabled){background:#62406e}.as-footer button:disabled{opacity:.6;cursor:wait}.as-error,.as-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.as-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.as-grid{grid-template-columns:1fr;gap:13px}.as-panel{padding:12px}.as-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.as-active>input{margin-top:3px}.as-badge{margin-top:3px}.as-footer button{width:100%}.as-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.as-panel *{transition:none!important}}

.as-panel{max-width:1150px;margin-inline:auto}.as-columns{display:grid;grid-template-columns:1fr 1fr;gap:12px;min-width:0}.as-stack{display:grid;gap:13px}.as-field{display:block;min-width:0}.as-field>span,.as-select-label,.as-pin-label{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}.as-panel .as-field input,.as-pin input,.as-panel textarea{display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font:16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}.as-field input[readonly]{background:#f4eff7;color:#766181}.as-panel input::placeholder,.as-panel textarea::placeholder{color:#80718a}.as-pin{display:flex;gap:7px}.as-pin input{flex:1;min-width:0}.as-pin button,.as-secondary{min-height:44px;padding:7px 11px;border:1px solid #d4c8df;border-radius:6px;background:#f5eff9;color:#634577;font-size:12px;font-weight:700;cursor:pointer}.as-pin button{min-width:58px}.as-upload{display:flex;gap:13px;align-items:center}.as-upload .as-field{flex:1;min-width:0}.as-photo{width:80px;height:80px;flex-shrink:0;display:grid;place-items:center;background:linear-gradient(135deg,#f9e3ec,#e9e4f7,#e4f1eb);border:1px solid #dfd2e7;border-radius:9px;overflow:hidden}.as-photo img{width:100%;height:100%;object-fit:cover}.as-photo span{font-size:13px;color:#906ba0;text-align:center;padding:5px}.as-panel input[type=file]{font-size:12px;padding:8px;overflow:hidden}.as-panel input::file-selector-button{border:0;border-radius:4px;padding:6px 8px;background:#eee6f5;color:#654775;margin-right:7px}.as-remove{justify-self:start}.as-hint{font-size:11px;color:#73617e;margin-top:6px!important}.as-role-note{font-size:11px;color:#73617e;margin:8px 0!important}.as-role-note strong{display:inline-block;background:#e8dcf1;color:#684580;padding:3px 9px;border-radius:5px;margin-right:7px}.as-panel textarea{height:135px;min-height:110px;max-height:280px;resize:vertical;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}.as-bio-toolbar,.as-bio-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.as-bio-toolbar{margin-bottom:8px}.as-bio-toolbar label{font-size:12px;font-weight:750;color:#685173}.as-bio-footer{margin-top:8px}.as-card:nth-child(3){border-top-color:#c79ba9}.as-footer{align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.as-footer p{font-size:12px;color:#73617e}.as-fields:disabled{opacity:.7}.as-dialog{position:fixed;inset:0;margin:auto;width:min(440px,calc(100% - 28px));max-height:85dvh;overflow:auto;padding:26px;border:1px solid #d7c8e2;border-radius:14px;background:#fbf8fd;color:#493652;box-shadow:0 25px 80px #30203640;text-align:center}.as-dialog::backdrop{background:#241a32aa;backdrop-filter:blur(4px)}.as-dialog h2{font-size:26px}.as-dialog>p{font-size:13px;color:#73617e;margin-top:7px}.as-success-star{display:block;font-size:36px;color:#a17bae}.as-dialog dl{text-align:left;background:#efe8f5;padding:15px;border-radius:8px;margin:18px 0;overflow-wrap:anywhere}.as-dialog dt{font-size:11px;font-weight:700;color:#80658d}.as-dialog dd{margin:0 0 9px;font-size:16px;font-weight:650}.as-dialog dd:last-child{margin-bottom:0}.as-dialog .as-activation{color:#436953;background:#e8f3ec;padding:10px;border-radius:6px}.as-dialog button{width:100%;min-height:46px;padding:11px;border:0;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;margin-top:16px;cursor:pointer}@media(max-width:800px){.as-columns{grid-template-columns:1fr}}@media(max-width:640px){.as-footer{flex-direction:column;align-items:stretch}.as-footer button{width:100%}.as-upload{align-items:flex-start;flex-direction:column}.as-upload .as-field{width:100%}}

.as-panel{max-width:90%}.as-columns{display:block}.as-card[hidden]{display:none!important}.as-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:18px 0}.as-step{display:flex;gap:8px;align-items:center;padding:10px 8px;background:#efebf3;border-radius:7px;color:#81738b;min-width:0}.as-step>span{display:grid;place-items:center;width:26px;height:26px;flex-shrink:0;border-radius:50%;background:#e0d8e7;font-size:11px;font-weight:750}.as-step strong{font-size:11px;line-height:1.3}.as-step.is-current{background:#e9ddf2;color:#624276}.as-step.is-current>span{background:#795587;color:white}.as-step.is-complete{background:#e6f1eb;color:#436c55}.as-step.is-complete>span{background:#cbe2d4}.as-step-intro{position:relative;margin:0 0 14px;padding-right:70px}.as-step-intro h3{margin:0;font-size:19px;color:#533c61}.as-step-intro p{font-size:12px;color:#73617e;margin:4px 0 0}.as-step-intro>span{position:absolute;right:0;top:3px;font-size:11px;color:#80648e}.as-step-actions{display:flex;gap:8px;flex-wrap:wrap}.as-footer .as-back{background:white;color:#795587;border-color:#d4c8df}.as-footer{align-items:flex-end}.as-footer>p{max-width:290px}@media(max-width:640px){.as-step{flex-direction:column;text-align:center;padding:9px 4px;gap:5px}.as-step strong{font-size:10px}.as-step-actions{display:flex;flex-wrap:nowrap}.as-step-actions button{flex:1;gap:8px;padding:10px;font-size:12px}.as-step-actions .as-back{flex:0 0 auto;width:auto}}
`;
