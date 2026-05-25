"use client";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg1:"#151d24",bg2:"#1c2730",bg3:"#202c36",
  accent1:"#22ff99",accent2:"#29f59c",
  graphite:"#2a3640",text:"#d4dde5",textDim:"#6b8090",
};

function useCounter(target,duration=2000,start=false){
  const[count,setCount]=useState(0);
  useEffect(()=>{
    if(!start)return;
    let t0=null;
    const step=ts=>{
      if(!t0)t0=ts;
      const p=Math.min((ts-t0)/duration,1);
      setCount(Math.floor(p*target));
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[target,duration,start]);
  return count;
}

function useInView(threshold=0.2){
  const ref=useRef(null);
  const[inView,setInView]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setInView(true);obs.disconnect();}
    },{threshold});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[threshold]);
  return[ref,inView];
}

function ParticleCanvas(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    c.width=window.innerWidth;c.height=window.innerHeight;
    const pts=Array.from({length:60},()=>({
      x:Math.random()*c.width,y:Math.random()*c.height,
      vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
      s:Math.random()*1.5+.5,o:Math.random()*.4+.1
    }));
    let id;
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;
        if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
        ctx.fillStyle=`rgba(34,255,153,${p.o})`;ctx.fill();
      });
      pts.forEach((p,i)=>pts.slice(i+1).forEach(q=>{
        const d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<120){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(34,255,153,${.06*(1-d/120)})`;
          ctx.lineWidth=.5;ctx.stroke();
        }
      }));
      id=requestAnimationFrame(draw);
    };
    draw();
    const rs=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};
    window.addEventListener("resize",rs);
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",rs);};
  },[]);
  return<canvas ref={ref} style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1}}/>;
}

function Reveal({children,delay=0}){
  const[ref,inView]=useInView();
  return(
    <div ref={ref} style={{opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(40px)",transition:`opacity .8s ease ${delay}s,transform .8s ease ${delay}s`}}>
      {children}
    </div>
  );
}

function Diag({color="#151d24"}){
  return(
    <div style={{position:"relative",height:80,overflow:"hidden",marginTop:-1}}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <polygon points="0,80 1440,0 0,0" fill={color}/>
      </svg>
    </div>
  );
}

const SERVICES=[
  {num:"01",title:"Petroleum Product Marketing",sub:"Downstream distribution at national scale",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"},
  {num:"02",title:"Industrial Chemicals",sub:"Precision-grade chemical supply chains",img:"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80"},
  {num:"03",title:"Lubricants & Petrochemicals",sub:"High-performance industrial lubricants",img:"https://images.unsplash.com/photo-1563302111-eab4b145bd6e?w=600&q=80"},
  {num:"04",title:"Bitumen Distribution",sub:"Infrastructure-grade bitumen solutions",img:"https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&q=80"},
  {num:"05",title:"Refinery Support Services",sub:"Technical operations and plant engineering",img:"https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80"},
  {num:"06",title:"Gas Plant Engineering",sub:"LPG infrastructure and gas systems",img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"},
];

const INDUSTRIES=[
  {icon:"⚙️",title:"Manufacturing",desc:"Industrial fuel, lubricants & chemical supply for production facilities"},
  {icon:"🚛",title:"Transportation",desc:"Bulk petroleum logistics and fleet energy management solutions"},
  {icon:"🏗️",title:"Construction",desc:"Bitumen, heavy fuel oils, and equipment lubricants for infrastructure"},
  {icon:"🏭",title:"Refinery Systems",desc:"Technical support, chemical supply, and operational engineering"},
  {icon:"📦",title:"Logistics & Depots",desc:"Fuel depot management, tanker operations, distribution systems"},
  {icon:"⛽",title:"Commercial Fuel",desc:"Volume petroleum supply for commercial operations nationwide"},
];

const STATS=[
  {value:25,suffix:"+",label:"Years of Operation"},
  {value:36,suffix:"",label:"States Served"},
  {value:500,suffix:"M+",label:"Litres Distributed"},
  {value:200,suffix:"+",label:"Industry Partners"},
];

export default function MamuOil(){
  const[scrolled,setScrolled]=useState(false);
  const[menu,setMenu]=useState(false);
  const[form,setForm]=useState({name:"",email:"",company:"",message:""});
  const[sRef,sInView]=useInView(.3);
  const c0=useCounter(STATS[0].value,2000,sInView);
  const c1=useCounter(STATS[1].value,2000,sInView);
  const c2=useCounter(STATS[2].value,2000,sInView);
  const c3=useCounter(STATS[3].value,2000,sInView);
  const CC=[c0,c1,c2,c3];

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenu(false);};

  return(
    <>
      <style>{`
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .nl:hover{color:#22ff99!important}
        .sc:hover .si{transform:scale(1.08)}
        .sc:hover .so{opacity:.5!important}
        .sc:hover .sg{opacity:1!important}
        .sc:hover .sn{color:#22ff99!important}
        .cb:hover{box-shadow:0 0 30px rgba(34,255,153,.5)!important;transform:translateY(-2px)}
        .ic:hover{border-color:#22ff99!important;transform:translateY(-4px)}
        .ic:hover .ii{background:#22ff99!important;color:#151d24!important}
        input:focus,textarea:focus{outline:none;border-color:#22ff99!important}
        .si2:hover{color:#22ff99!important;border-color:#22ff99!important}
        .bt:hover{background:#22ff99!important;color:#151d24!important}
        .mt{display:none}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#1c2730}
        ::-webkit-scrollbar-thumb{background:#22ff99;border-radius:2px}
        @media(max-width:768px){
          .nd{display:none!important}.mt{display:block!important}
          .hh{font-size:clamp(48px,12vw,72px)!important}
          .sg2{grid-template-columns:1fr!important}
          .stg{grid-template-columns:1fr 1fr!important}
          .ab{flex-direction:column!important}
          .ct{flex-direction:column!important}
          .ig{grid-template-columns:1fr 1fr!important}
          .fg{flex-direction:column!important;gap:24px!important}
          .gg{grid-template-columns:1fr 1fr!important;grid-template-rows:auto!important}
          .gg>div:first-child{grid-row:auto!important}
        }
        @media(max-width:480px){
          .ig{grid-template-columns:1fr!important}
          .stg{grid-template-columns:1fr!important}
        }
      `}</style>

      <div style={{fontFamily:"'Oswald',sans-serif",background:COLORS.bg1,color:COLORS.text,overflowX:"hidden"}}>

        {/* NAV */}
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",height:72,background:scrolled?"rgba(21,29,36,.97)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(34,255,153,.1)":"none",transition:"all .4s"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>go("hero")}>
            <div style={{width:38,height:38,background:`linear-gradient(135deg,${COLORS.accent1},${COLORS.accent2})`,clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:COLORS.bg1}}>M</div>
            <div>
              <div style={{fontSize:18,fontWeight:700,letterSpacing:".15em",color:"#fff",lineHeight:1.1}}>MAMU OIL</div>
              <div style={{fontSize:9,letterSpacing:".3em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>NIGERIA LIMITED</div>
            </div>
          </div>
          <ul className="nd" style={{display:"flex",gap:36,listStyle:"none",margin:0,padding:0}}>
            {["Services","About","Industries","Contact"].map(l=>(
              <li key={l}><span className="nl" style={{fontSize:12,letterSpacing:".2em",color:COLORS.textDim,cursor:"pointer",transition:"color .2s"}} onClick={()=>go(l.toLowerCase())}>{l}</span></li>
            ))}
          </ul>
          <div className="nd" style={{display:"flex",alignItems:"center",gap:20}}>
            <span style={{fontSize:11,color:COLORS.textDim,letterSpacing:".1em",fontFamily:"'Barlow Condensed',sans-serif"}}>+234 803 000 0000</span>
            <button className="cb" onClick={()=>go("contact")} style={{fontSize:11,letterSpacing:".2em",padding:"10px 24px",background:COLORS.accent1,color:COLORS.bg1,border:"none",cursor:"pointer",fontWeight:700,clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",transition:"all .2s"}}>GET IN TOUCH</button>
          </div>
          <button className="mt" style={{background:"none",border:"none",color:"#fff",fontSize:24,cursor:"pointer"}} onClick={()=>setMenu(!menu)}>{menu?"✕":"☰"}</button>
        </nav>

        {menu&&(
          <div style={{position:"fixed",inset:0,zIndex:90,background:"rgba(21,29,36,.98)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:32}}>
            {["Services","About","Industries","Contact"].map(l=>(
              <div key={l} onClick={()=>go(l.toLowerCase())} style={{fontSize:40,letterSpacing:".2em",color:"#fff",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif"}}>{l}</div>
            ))}
          </div>
        )}

        {/* HERO */}
        <section id="hero" style={{position:"relative",height:"100vh",minHeight:700,overflow:"hidden",display:"flex",alignItems:"center"}}>
          <div style={{position:"absolute",inset:0,zIndex:0,backgroundImage:"url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80)",backgroundSize:"cover",backgroundPosition:"center",filter:"saturate(.4) brightness(.35)"}}/>
          <div style={{position:"absolute",inset:0,zIndex:2,background:`linear-gradient(135deg,${COLORS.bg1}ee 0%,transparent 60%,${COLORS.bg1}99 100%)`}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",zIndex:2,background:`linear-gradient(to top,${COLORS.bg1},transparent)`}}/>
          <div style={{position:"absolute",inset:0,zIndex:2,overflow:"hidden"}}>
            <div style={{position:"absolute",right:0,top:0,width:"45%",height:"100%",background:"linear-gradient(135deg,transparent,rgba(34,255,153,.03))",clipPath:"polygon(20% 0%,100% 0%,100% 100%,0% 100%)"}}/>
            <div style={{position:"absolute",left:"30%",top:0,width:"2px",height:"100%",background:"linear-gradient(to bottom,transparent,rgba(34,255,153,.2),transparent)",transform:"rotate(-8deg) scaleY(1.5)",transformOrigin:"top"}}/>
          </div>
          <ParticleCanvas/>
          <div style={{position:"absolute",top:120,right:40,zIndex:10,textAlign:"right"}}>
            <div style={{fontSize:10,letterSpacing:".4em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:4}}>EST. 1999</div>
            <div style={{width:40,height:1,background:COLORS.accent1,marginLeft:"auto"}}/>
          </div>
          <div style={{position:"relative",zIndex:10,maxWidth:900,padding:"0 48px",marginTop:60}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
              <div style={{width:40,height:2,background:COLORS.accent1}}/>
              <span style={{fontSize:11,letterSpacing:".5em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>DOWNSTREAM PETROLEUM · INDUSTRIAL ENERGY</span>
            </div>
            <h1 className="hh" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(64px,8vw,110px)",lineHeight:.9,fontWeight:400,letterSpacing:".04em",color:"#fff",marginBottom:28,textTransform:"uppercase"}}>
              POWERING<br/>
              <span style={{WebkitTextStroke:"1px #22ff99",color:"transparent"}}>NIGERIA'S</span><br/>
              INDUSTRIAL<br/>FUTURE
            </h1>
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:COLORS.textDim,maxWidth:520,lineHeight:1.6,marginBottom:40,fontWeight:300,letterSpacing:".05em"}}>
              25 years of downstream petroleum excellence. Industrial chemicals, lubricants, bitumen, refinery support — delivered with precision across Nigeria's energy infrastructure.
            </p>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <button className="cb" onClick={()=>go("services")} style={{fontSize:13,letterSpacing:".3em",padding:"18px 40px",background:COLORS.accent1,color:COLORS.bg1,border:"none",cursor:"pointer",fontWeight:700,fontFamily:"'Oswald',sans-serif",clipPath:"polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)",transition:"all .3s"}}>EXPLORE SERVICES</button>
              <button className="cb" onClick={()=>go("contact")} style={{fontSize:13,letterSpacing:".3em",padding:"18px 40px",background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,.2)",cursor:"pointer",fontFamily:"'Oswald',sans-serif",transition:"all .3s"}}>CONTACT US</button>
            </div>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:5}}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{width:"100%",height:80,display:"block"}}>
              <polygon points="0,80 1440,20 1440,80" fill={COLORS.bg1}/>
            </svg>
          </div>
        </section>

        {/* TICKER */}
        <div style={{background:COLORS.accent1,padding:"10px 0",overflow:"hidden"}}>
          <div style={{display:"flex",gap:60,whiteSpace:"nowrap",animation:"marquee 20s linear infinite",fontFamily:"'Oswald',sans-serif",fontSize:12,letterSpacing:".3em",color:COLORS.bg1,fontWeight:600}}>
            {["PETROLEUM MARKETING","INDUSTRIAL CHEMICALS","LUBRICANTS","BITUMEN DISTRIBUTION","REFINERY SUPPORT","GAS ENGINEERING","PETROCHEMICALS","NATIONWIDE SUPPLY","PETROLEUM MARKETING","INDUSTRIAL CHEMICALS","LUBRICANTS","BITUMEN DISTRIBUTION"].map((t,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:20}}>{t}<span style={{width:6,height:6,background:COLORS.bg1,display:"inline-block",transform:"rotate(45deg)",marginLeft:30}}/></span>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" style={{background:COLORS.bg2,padding:"120px 48px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-100,right:-200,width:600,height:600,borderRadius:"50%",background:"rgba(34,255,153,.02)",filter:"blur(60px)"}}/>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                <div style={{width:50,height:2,background:COLORS.accent1}}/>
                <span style={{fontSize:11,letterSpacing:".5em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>CORE CAPABILITIES</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:64,flexWrap:"wrap",gap:20}}>
                <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,6vw,80px)",letterSpacing:".05em",lineHeight:.9,color:"#fff"}}>
                  OUR INDUSTRIAL<br/><span style={{color:COLORS.accent1}}>SERVICE PORTFOLIO</span>
                </h2>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,color:COLORS.textDim,maxWidth:360,lineHeight:1.7}}>
                  Integrated downstream petroleum and industrial energy services delivered with precision, scale, and 25 years of operational excellence across Nigeria.
                </p>
              </div>
            </Reveal>
            <div className="sg2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
              {SERVICES.map((s,i)=>(
                <Reveal key={i} delay={i*.1}>
                  <div className="sc" style={{position:"relative",height:380,overflow:"hidden",cursor:"pointer",background:COLORS.bg1}}>
                    <img className="si" src={s.img} alt={s.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"saturate(.3) brightness(.4)",transition:"transform .6s ease"}}/>
                    <div className="so" style={{position:"absolute",inset:0,background:`linear-gradient(to top,${COLORS.bg1}ee,transparent)`,transition:"opacity .4s",opacity:.85}}/>
                    <div className="sg" style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${COLORS.accent1}08,transparent)`,opacity:0,transition:"opacity .4s",borderLeft:`2px solid ${COLORS.accent1}`}}/>
                    <div style={{position:"absolute",inset:0,padding:28,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <span className="sn" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:48,color:"rgba(255,255,255,.08)",letterSpacing:".1em",transition:"color .3s"}}>{s.num}</span>
                      <div>
                        <div style={{width:30,height:1,background:COLORS.accent1,marginBottom:12}}/>
                        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,letterSpacing:".1em",color:"#fff",textTransform:"uppercase",marginBottom:8}}>{s.title}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:COLORS.textDim}}>{s.sub}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Diag color={COLORS.bg1}/>

        {/* SHOWCASE GRID */}
        <section style={{background:COLORS.bg1,padding:"80px 48px 120px"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:48}}>
                <div style={{width:50,height:2,background:COLORS.accent1}}/>
                <span style={{fontSize:11,letterSpacing:".5em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>INFRASTRUCTURE AT SCALE</span>
              </div>
            </Reveal>
            <div className="gg" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gridTemplateRows:"280px 280px",gap:3}}>
              {[
                {img:"https://images.unsplash.com/photo-1581094488379-6a10d4e5e0a3?w=800&q=80",label:"PETROLEUM LOGISTICS",style:{gridRow:"1/3"}},
                {img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",label:"REFINERY OPERATIONS"},
                {img:"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",label:"TANKER SYSTEMS"},
                {img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",label:"GAS INFRASTRUCTURE"},
                {img:"https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&q=80",label:"FUEL DEPOTS"},
              ].map((item,i)=>(
                <div key={i} style={{position:"relative",overflow:"hidden",...item.style}}>
                  <img src={item.img} alt={item.label} style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(.3) brightness(.45)"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(21,29,36,.9) 0%,transparent 60%)"}}/>
                  <div style={{position:"absolute",bottom:20,left:20,fontFamily:"'Oswald',sans-serif",fontSize:13,letterSpacing:".25em",color:"#fff",fontWeight:500}}>{item.label}</div>
                  <div style={{position:"absolute",bottom:0,left:0,width:"100%",height:2,background:`linear-gradient(90deg,${COLORS.accent1},transparent)`,opacity:.6}}/>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{background:COLORS.bg3,padding:"120px 48px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${COLORS.accent1}33,transparent)`}}/>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div className="ab" style={{display:"flex",gap:80,alignItems:"center"}}>
              <div style={{flex:1,minWidth:280}}>
                <Reveal>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
                    <div style={{width:40,height:2,background:COLORS.accent1}}/>
                    <span style={{fontSize:11,letterSpacing:".5em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>COMPANY LEGACY</span>
                  </div>
                  <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(42px,5vw,72px)",lineHeight:.9,letterSpacing:".04em",color:"#fff",marginBottom:32}}>
                    BUILT ON 25 YEARS<br/>OF<span style={{color:COLORS.accent1}}> INDUSTRIAL</span><br/>AUTHORITY
                  </h2>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:COLORS.textDim,lineHeight:1.8,marginBottom:24}}>
                    Since 1999, Mamu Oil Nigeria Limited has been a cornerstone of Nigeria's downstream petroleum sector. We have built an integrated platform spanning petroleum product marketing, industrial chemicals, lubricants, petrochemicals, bitumen distribution, and refinery support services.
                  </p>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:COLORS.textDim,lineHeight:1.8,marginBottom:40}}>
                    Our operational infrastructure reaches across 36 states, serving manufacturers, construction firms, logistics operators, and industrial facilities with precision-grade energy solutions.
                  </p>
                  <button className="cb" onClick={()=>go("contact")} style={{fontSize:12,letterSpacing:".3em",padding:"16px 32px",background:COLORS.accent1,color:COLORS.bg1,border:"none",cursor:"pointer",fontWeight:700,fontFamily:"'Oswald',sans-serif",clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",transition:"all .3s"}}>PARTNER WITH US</button>
                </Reveal>
              </div>
              <div style={{flex:1,minWidth:280}}>
                <Reveal delay={.2}>
                  <div style={{position:"relative",height:480}}>
                    <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700&q=80" alt="refinery" style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(.35) brightness(.5)",clipPath:"polygon(0 0,100% 0,100% 85%,90% 100%,0 100%)"}}/>
                    <div style={{position:"absolute",bottom:40,left:-20,background:COLORS.bg1,padding:"20px 28px",borderLeft:`3px solid ${COLORS.accent1}`}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:COLORS.accent1,lineHeight:1}}>1999</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:".3em",color:COLORS.textDim,marginTop:4}}>FOUNDED · ABUJA, NIGERIA</div>
                    </div>
                    <div style={{position:"absolute",top:30,right:-10,background:COLORS.graphite,padding:"16px 20px",border:`1px solid rgba(34,255,153,.2)`}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#fff",lineHeight:1}}>ISO</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:".3em",color:COLORS.accent1}}>CERTIFIED</div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section ref={sRef} style={{background:COLORS.bg1,padding:"80px 48px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1400&q=80)",backgroundSize:"cover",backgroundPosition:"center",filter:"saturate(.2) brightness(.12)"}}/>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${COLORS.bg1}f0,${COLORS.bg2}e0)`}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${COLORS.accent1}66,transparent)`}}/>
          <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:2}}>
            <div className="stg" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2}}>
              {STATS.map((s,i)=>(
                <div key={i} style={{padding:"48px 32px",textAlign:"center",borderRight:i<3?"1px solid rgba(34,255,153,.1)":"none"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(56px,6vw,80px)",color:"#fff",lineHeight:1,letterSpacing:".05em"}}>
                    {CC[i]}<span style={{color:COLORS.accent1}}>{s.suffix}</span>
                  </div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:".4em",color:COLORS.textDim,marginTop:12,textTransform:"uppercase"}}>{s.label}</div>
                  <div style={{width:30,height:2,background:COLORS.accent1,margin:"16px auto 0",opacity:.5}}/>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Diag color={COLORS.bg2}/>

        {/* INDUSTRIES */}
        <section id="industries" style={{background:COLORS.bg2,padding:"120px 48px"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                <div style={{width:40,height:2,background:COLORS.accent1}}/>
                <span style={{fontSize:11,letterSpacing:".5em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>SECTORS WE SERVE</span>
              </div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(42px,5vw,72px)",lineHeight:.9,letterSpacing:".04em",color:"#fff",marginBottom:64}}>
                INDUSTRIES WE<br/><span style={{color:COLORS.accent1}}>POWER</span>
              </h2>
            </Reveal>
            <div className="ig" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
              {INDUSTRIES.map((ind,i)=>(
                <Reveal key={i} delay={i*.08}>
                  <div className="ic" style={{background:COLORS.bg1,padding:"40px 32px",border:"1px solid rgba(255,255,255,.04)",transition:"all .3s ease",borderTop:`2px solid rgba(34,255,153,.15)`,position:"relative"}}>
                    <div style={{position:"absolute",top:0,right:0,width:60,height:60,background:"rgba(34,255,153,.03)",clipPath:"polygon(100% 0,100% 100%,0 0)"}}/>
                    <div className="ii" style={{width:52,height:52,marginBottom:24,background:COLORS.graphite,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,transition:"all .3s",clipPath:"polygon(10% 0%,90% 0%,100% 50%,90% 100%,10% 100%,0% 50%)"}}>{ind.icon}</div>
                    <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,letterSpacing:".1em",color:"#fff",marginBottom:12,textTransform:"uppercase"}}>{ind.title}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:COLORS.textDim,lineHeight:1.7}}>{ind.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{position:"relative",padding:"100px 48px",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80)",backgroundSize:"cover",backgroundPosition:"center",filter:"saturate(.2) brightness(.2)"}}/>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${COLORS.bg1}f5,${COLORS.bg3}dd)`}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${COLORS.accent1},${COLORS.accent2},transparent)`}}/>
          <div style={{position:"relative",zIndex:2,maxWidth:900,margin:"0 auto",textAlign:"center"}}>
            <Reveal>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,5vw,64px)",color:"#fff",letterSpacing:".08em",lineHeight:1,marginBottom:24}}>
                READY TO POWER YOUR<br/><span style={{color:COLORS.accent1}}>INDUSTRIAL OPERATIONS?</span>
              </div>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,color:COLORS.textDim,marginBottom:40,lineHeight:1.7}}>
                Join hundreds of Nigerian enterprises that rely on Mamu Oil for petroleum products, industrial chemicals, and energy infrastructure solutions.
              </p>
              <button className="cb" onClick={()=>go("contact")} style={{fontSize:14,letterSpacing:".3em",padding:"20px 56px",background:COLORS.accent1,color:COLORS.bg1,border:"none",cursor:"pointer",fontWeight:700,fontFamily:"'Oswald',sans-serif",clipPath:"polygon(16px 0%,100% 0%,calc(100% - 16px) 100%,0% 100%)",transition:"all .3s"}}>START A PARTNERSHIP</button>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{background:COLORS.bg3,padding:"120px 48px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${COLORS.accent1}44,transparent)`}}/>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                <div style={{width:40,height:2,background:COLORS.accent1}}/>
                <span style={{fontSize:11,letterSpacing:".5em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>GET IN TOUCH</span>
              </div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(42px,5vw,72px)",lineHeight:.9,letterSpacing:".04em",color:"#fff",marginBottom:64}}>
                CONNECT WITH<br/><span style={{color:COLORS.accent1}}>OUR TEAM</span>
              </h2>
            </Reveal>
            <div className="ct" style={{display:"flex",gap:80}}>
              <div style={{flex:1.2,minWidth:280}}>
                <Reveal>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {[{id:"name",label:"FULL NAME",type:"text"},{id:"email",label:"EMAIL ADDRESS",type:"email"},{id:"company",label:"COMPANY / ORGANIZATION",type:"text"}].map(f=>(
                      <div key={f.id}>
                        <label style={{display:"block",fontSize:10,letterSpacing:".4em",color:COLORS.textDim,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:6}}>{f.label}</label>
                        <input type={f.type} value={form[f.id]} onChange={e=>setForm(p=>({...p,[f.id]:e.target.value}))} style={{width:"100%",padding:"16px 20px",background:COLORS.bg2,border:"1px solid rgba(255,255,255,.06)",color:"#fff",fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:12,transition:"border-color .2s"}}/>
                      </div>
                    ))}
                    <div>
                      <label style={{display:"block",fontSize:10,letterSpacing:".4em",color:COLORS.textDim,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:6}}>MESSAGE / INQUIRY</label>
                      <textarea rows={5} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{width:"100%",padding:"16px 20px",background:COLORS.bg2,border:"1px solid rgba(255,255,255,.06)",color:"#fff",fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",resize:"vertical",transition:"border-color .2s"}}/>
                    </div>
                    <button className="cb" style={{fontSize:13,letterSpacing:".3em",padding:"18px",background:COLORS.accent1,color:COLORS.bg1,border:"none",cursor:"pointer",fontWeight:700,fontFamily:"'Oswald',sans-serif",clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",transition:"all .3s",marginTop:8}}>SEND INQUIRY</button>
                  </div>
                </Reveal>
              </div>
              <div style={{flex:1,minWidth:260}}>
                <Reveal delay={.2}>
                  <div style={{marginBottom:40}}>
                    <div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,letterSpacing:".2em",color:COLORS.accent1,marginBottom:16}}>HEADQUARTERS</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:COLORS.text,lineHeight:1.8}}>Mamu Oil Nigeria Limited<br/>Abuja, Federal Capital Territory<br/>Nigeria</div>
                  </div>
                  <div style={{width:"100%",height:1,background:"rgba(255,255,255,.06)",marginBottom:32}}/>
                  {[{label:"PHONE",val:"+234 803 000 0000"},{label:"EMAIL",val:"info@mamuoil.com"},{label:"OPERATIONS",val:"operations@mamuoil.com"}].map(item=>(
                    <div key={item.label} style={{marginBottom:24}}>
                      <div style={{fontSize:10,letterSpacing:".4em",color:COLORS.textDim,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:4}}>{item.label}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:"#fff"}}>{item.val}</div>
                    </div>
                  ))}
                  <div style={{width:"100%",height:1,background:"rgba(255,255,255,.06)",marginBottom:32}}/>
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:10,letterSpacing:".4em",color:COLORS.textDim,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:12}}>OPERATING HOURS</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:COLORS.textDim,lineHeight:2}}>Monday – Friday: 08:00 – 18:00<br/>Saturday: 09:00 – 14:00</div>
                  </div>
                  <div style={{marginTop:32,display:"flex",gap:12}}>
                    {["LI","TW","FB","YT"].map(s=>(
                      <div key={s} className="si2" style={{width:40,height:40,border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Oswald',sans-serif",fontSize:12,color:COLORS.textDim,cursor:"pointer",transition:"all .2s"}}>{s}</div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:COLORS.bg1,borderTop:`3px solid ${COLORS.accent1}`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:3,background:`linear-gradient(90deg,${COLORS.accent1},${COLORS.accent2},transparent)`}}/>
          <div style={{maxWidth:1280,margin:"0 auto",padding:"60px 48px 40px"}}>
            <div className="fg" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:40,marginBottom:48}}>
              <div style={{maxWidth:280}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                  <div style={{width:36,height:36,background:`linear-gradient(135deg,${COLORS.accent1},${COLORS.accent2})`,clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:COLORS.bg1}}>M</div>
                  <div>
                    <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,letterSpacing:".2em",color:"#fff"}}>MAMU OIL</div>
                    <div style={{fontSize:8,letterSpacing:".4em",color:COLORS.accent1,fontFamily:"'Barlow Condensed',sans-serif"}}>NIGERIA LIMITED</div>
                  </div>
                </div>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:COLORS.textDim,lineHeight:1.8}}>Nigeria's downstream petroleum and industrial energy authority since 1999.</p>
              </div>
              {[{heading:"SERVICES",links:["Petroleum Marketing","Industrial Chemicals","Lubricants","Bitumen Distribution"]},{heading:"COMPANY",links:["About Us","Industries","Projects","Careers"]},{heading:"CONTACT",links:["Get in Touch","Operations","Partnerships","Media"]}].map(col=>(
                <div key={col.heading}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,letterSpacing:".4em",color:COLORS.accent1,marginBottom:20}}>{col.heading}</div>
                  {col.links.map(l=>(
                    <div key={l} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:COLORS.textDim,marginBottom:12,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color=COLORS.textDim}>{l}</div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{height:1,background:"rgba(255,255,255,.05)",marginBottom:28}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:COLORS.textDim,letterSpacing:".1em"}}>© 2024 Mamu Oil Nigeria Limited. All rights reserved.</div>
              <button className="bt" onClick={()=>go("hero")} style={{fontFamily:"'Oswald',sans-serif",fontSize:11,letterSpacing:".3em",padding:"10px 20px",background:"transparent",border:"1px solid rgba(34,255,153,.3)",color:COLORS.accent1,cursor:"pointer",transition:"all .2s",clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)"}}>↑ BACK TO TOP</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
