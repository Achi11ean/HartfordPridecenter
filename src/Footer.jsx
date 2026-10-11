import { useId } from "react";
import { Cog } from "lucide-react";

function RainbowGear({ size, strokeWidth, className = "" }) {
  const gradientId = `jwhit-gear-${useId().replace(/:/g, "")}`;
  return (
    <Cog
      size={size}
      strokeWidth={strokeWidth}
      stroke={`url(#${gradientId})`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="20%" stopColor="#fbad66" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#6ee7a0" />
          <stop offset="80%" stopColor="#7db8ff" />
          <stop offset="100%" stopColor="#d8a4ff" />
        </linearGradient>
      </defs>
    </Cog>
  );
}

const Footer = () => (
  <>
    <footer className="jwhit-pride-footer">
      <div className="jwhit-footer-gear" aria-hidden="true">
        <RainbowGear size={180} strokeWidth={1.2} />
      </div>
      <div className="jwhit-footer-glow" aria-hidden="true" />
      <div className="jwhit-footer-content">
        <a href="https://jwhitproductions.com/" target="_blank" rel="noopener noreferrer" className="jwhit-footer-brand">
          <RainbowGear size={18} strokeWidth={2.2} className="jwhit-brand-gear" />
          <span>© {new Date().getFullYear()} JWHIT Productions</span>
        </a>
        <div className="jwhit-footer-divider" aria-hidden="true" />
        <p>
          All Rights Reserved • Patent Pending • Unauthorized reproduction
          or distribution of any portion of this website is strictly prohibited.
        </p>
      </div>
    </footer>
    <style>{`
      .jwhit-pride-footer{
        position:relative;isolation:isolate;overflow:hidden;padding:15px 16px;
        background:linear-gradient(180deg,#171321,#100e17 65%,#0b0a10);
        color:#f1eaf8;font-family:Inter,ui-sans-serif,system-ui,sans-serif;
      }
      .jwhit-pride-footer::before,.jwhit-pride-footer::after{
        content:"";position:absolute;left:0;right:0;height:1px;pointer-events:none;
        background:linear-gradient(90deg,#ed809b,#e8ad72,#dbc56c,#81ba98,#83a9d9,#ba94d4);
      }
      .jwhit-pride-footer::before{top:0;opacity:.8}
      .jwhit-pride-footer::after{bottom:0;opacity:.5}
      .jwhit-footer-gear{
        position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        pointer-events:none;overflow:hidden;z-index:0;
      }
      .jwhit-footer-gear>svg{
        width:180px;height:180px;flex-shrink:0;opacity:.12;
        animation:jwhit-pride-gear-spin 35s linear infinite;transform-origin:center;
      }
      .jwhit-footer-glow{
        position:absolute;inset:0;pointer-events:none;z-index:0;
        background:radial-gradient(ellipse at 20% 50%,#ed809b0b,transparent 45%),
          radial-gradient(ellipse at 50% 70%,#81ba980a,transparent 42%),
          radial-gradient(ellipse at 80% 50%,#ba94d410,transparent 45%);
      }
      .jwhit-footer-content{position:relative;z-index:1;max-width:1024px;margin:auto;text-align:center}
      .jwhit-footer-brand{
        position:relative;display:inline-flex;align-items:center;justify-content:center;
        gap:9px;max-width:100%;min-height:30px;padding:3px 5px;border-radius:6px;
        color:#f1eaf8;text-decoration:none;transition:color .2s;
      }
      .jwhit-footer-brand>span{font-size:11px;font-weight:650;line-height:1.6;letter-spacing:.16em;text-transform:uppercase}
      .jwhit-brand-gear{flex-shrink:0;filter:drop-shadow(0 0 4px #b08ddd35)}
      .jwhit-footer-brand:hover{color:#fff}
      .jwhit-footer-brand:hover .jwhit-brand-gear{animation:jwhit-pride-gear-spin 8s linear infinite}
      .jwhit-footer-brand:focus-visible{outline:2px solid #d8b6ee;outline-offset:4px}
      .jwhit-footer-divider{
        height:1px;width:88px;margin:6px auto 9px;
        background:linear-gradient(90deg,transparent,#ed809b,#e5c776,#85bfa4,#8baedc,#b892d3,transparent);
        opacity:.6;
      }
      .jwhit-footer-content>p{max-width:768px;margin:auto;color:#b2a9bd;font-size:10px;line-height:1.75}
      @keyframes jwhit-pride-gear-spin{to{transform:rotate(360deg)}}
      @media(min-width:640px){.jwhit-footer-brand>span{font-size:12px}.jwhit-footer-content>p{font-size:11px}}
      @media(max-width:639px){
        .jwhit-pride-footer{padding:12px 13px}
        .jwhit-footer-gear>svg{width:120px;height:120px;opacity:.09}
        .jwhit-footer-brand{gap:7px}
        .jwhit-footer-brand>span{letter-spacing:.1em}
      }
      @media(prefers-reduced-motion:reduce){
        .jwhit-footer-gear>svg,.jwhit-footer-brand:hover .jwhit-brand-gear{animation:none}
        .jwhit-footer-brand{transition:none}
      }
    `}</style>
  </>
);

export default Footer;
