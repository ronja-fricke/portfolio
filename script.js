const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll(".reveal").forEach(x=>io.observe(x));
const glow=document.querySelector(".cursor-glow");addEventListener("mousemove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}});
const modal=document.getElementById("projectModal"),backdrop=document.getElementById("modalBackdrop"),title=document.getElementById("modalTitle"),view=document.getElementById("projectView"),projectLink=document.getElementById("projectLink");
document.querySelectorAll(".project-tile").forEach(b=>b.addEventListener("click",()=>{
  const imgs=(b.dataset.gallery||"").split("|").filter(Boolean), video=b.dataset.video;
  title.textContent=b.dataset.title;projectLink.href=b.dataset.url||"#";projectLink.style.display=b.dataset.url?"inline-flex":"none";view.innerHTML='';
  if(video){
    const browser=document.createElement('div');browser.className='video-browser';
    const chrome=document.createElement('div');chrome.className='browser-chrome';chrome.innerHTML='<div class="browser-dots"><i></i><i></i><i></i></div><div class="browser-address">'+(b.dataset.url||'Projektvorschau')+'</div><span class="browser-live">VIDEO</span>';
    const stage=document.createElement('div');stage.className='video-stage';
    const v=document.createElement('video');v.src=video;v.controls=true;v.playsInline=true;v.preload='metadata';v.setAttribute('aria-label',b.dataset.title+' – Website-Durchgang');
    stage.appendChild(v);browser.append(chrome,stage);view.appendChild(browser);
    const hint=document.createElement('p');hint.className='video-hint';hint.textContent='Website-Durchgang · Mit den Videosteuerungen kannst du während der Präsentation jederzeit pausieren und Details erklären.';view.appendChild(hint);
  }else{
    const gallery=document.createElement('div');gallery.className='project-gallery'+(imgs.length===1?' single':'');
    imgs.forEach((src,i)=>{const wrap=document.createElement('div');wrap.className='project-shot';const img=document.createElement('img');img.src=src;img.alt=b.dataset.title+' – Projektmotiv '+(i+1);img.loading='lazy';wrap.appendChild(img);gallery.appendChild(wrap)});view.appendChild(gallery);
  }
  modal.classList.add("open");backdrop.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";view.scrollTop=0;
}));
function close(){const v=view.querySelector('video');if(v)v.pause();modal.classList.remove("open");backdrop.classList.remove("open");modal.setAttribute("aria-hidden","true");view.innerHTML='';document.body.style.overflow=""}document.getElementById("closeModal").onclick=close;backdrop.onclick=close;addEventListener("keydown",e=>{if(e.key==="Escape")close()});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"})}}));
