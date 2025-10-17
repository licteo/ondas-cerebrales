const DATA = {"Dormir / descanso profundo": {"hz": "Delta (0.5–4 Hz)", "bpm": "40–60", "verse": "Salmo 4:8 — En paz me acostaré y asimismo dormiré, porque solo tú, Señor, me haces vivir confiado.", "note": "Descansar en la confianza de Dios", "category": "Sueño"}, "Despertar / transición al día": {"hz": "Theta–Alpha (6–10 Hz)", "bpm": "60–80", "verse": "Lamentaciones 3:23 — Nuevas son cada mañana tus misericordias; grande es tu fidelidad.", "note": "Agradece las misericordias de la mañana", "category": "Rutina"}, "Oración / meditación bíblica": {"hz": "Theta (4–8 Hz)", "bpm": "60–70", "verse": "Salmo 46:10 — Estad quietos y conoced que yo soy Dios; seré exaltado entre las naciones, enaltecido seré en la tierra.", "note": "Silencio y escucha activa", "category": "Espiritual"}, "Desayuno / alimentación consciente": {"hz": "Alpha (8–13 Hz)", "bpm": "70–90", "verse": "1 Timoteo 4:4–5 — Porque todo lo que Dios creó es bueno, y nada es de desecharse, si se toma con acción de gracias; porque por la palabra de Dios y por la oración es santificado.", "note": "Acción de gracias antes de comer", "category": "Comida"}, "Ejercicio físico": {"hz": "Beta (13–30 Hz)", "bpm": "110–130", "verse": "1 Corintios 6:19–20 — ¿No sabéis que vuestro cuerpo es templo del Espíritu Santo, que está en vosotros, el cual tenéis de Dios, y que no sois vuestros? Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu, los cuales son de Dios.", "note": "Cuidar el cuerpo como templo", "category": "Movimiento"}, "Trabajo / concentración activa": {"hz": "Beta medio (15–25 Hz)", "bpm": "100–120", "verse": "Colosenses 3:23 — Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.", "note": "Trabaja como para el Señor", "category": "Laboral"}, "Estudio / aprendizaje": {"hz": "Alpha–Beta (10–18 Hz)", "bpm": "80–100", "verse": "Proverbios 2:6 — Porque Jehová da la sabiduría, y de su boca viene el conocimiento y la inteligencia.", "note": "Pide sabiduría antes de leer", "category": "Estudio"}, "Conversación / vida social": {"hz": "Alpha (8–12 Hz)", "bpm": "90–100", "verse": "Efesios 4:29 — Ninguna palabra corrompida salga de vuestra boca, sino la que sea buena para la necesaria edificación, a fin de dar gracia a los oyentes.", "note": "Habla para edificar", "category": "Social"}, "Recreación / creatividad / juegos": {"hz": "Alpha–Beta (10–20 Hz)", "bpm": "100–120", "verse": "Eclesiastés 3:4 — Tiempo de llorar, y tiempo de reír; tiempo de endechar, y tiempo de bailar.", "note": "Deja espacio para la alegría", "category": "Recreo"}, "Tiempo en pareja / intimidad": {"hz": "Theta–Alpha (6–10 Hz)", "bpm": "60–80", "verse": "Génesis 2:24 — Por tanto dejará el hombre a su padre y a su madre, y se unirá a su mujer, y serán una sola carne.", "note": "Presencia y respeto mutuo", "category": "Relacional"}, "Cena / descanso familiar": {"hz": "Alpha (8–12 Hz)", "bpm": "70–85", "verse": "Salmo 128:3–4 — Tu mujer será como vid que lleva fruto a los lados de tu casa; tus hijos como plantas de olivo alrededor de tu mesa. He aquí que así será bendecido el hombre que teme a Jehová.", "note": "Cena sin pantallas, comparte gratitud", "category": "Familia"}, "Oración nocturna / reflexión": {"hz": "Theta–Delta (3–6 Hz)", "bpm": "50–60", "verse": "Salmo 16:7 — Bendeciré a Jehová que me aconseja; aun en las noches me enseña mi conciencia.", "note": "Examinar el día y entregar cargas", "category": "Espiritual"}};


/* Remaining app.js logic (same as published previously) */

const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
let selectedDay = 'Sábado';

const STORAGE_KEYS = { ASSIGN: 'guia_assignments_v1', NOTES: 'guia_notes_v1' };

function $(sel){return document.querySelector(sel);}
function $all(sel){return Array.from(document.querySelectorAll(sel));}

function loadAssignments(){
  try{ const raw = localStorage.getItem(STORAGE_KEYS.ASSIGN); if(raw) return JSON.parse(raw); }catch(e){console.warn(e)}
  const map = {}; DAYS.forEach(d=> map[d] = Object.keys(DATA).slice() );
  return map;
}
function saveAssignments(obj){ try{ localStorage.setItem(STORAGE_KEYS.ASSIGN, JSON.stringify(obj)); }catch(e){console.warn(e)} }
function loadNotes(){ try{ const raw = localStorage.getItem(STORAGE_KEYS.NOTES); return raw?JSON.parse(raw):{} }catch(e){return{}} }
function saveNotes(n){ try{ localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(n)); }catch(e){console.warn(e)} }

let ASSIGNMENTS = loadAssignments();
let NOTES = loadNotes();

function init(){
  renderDays();
  renderDailyBox();
  applyAutoDark();
  renderCards();
  renderDayPanel();
  bindUI();
  registerSW();
}

function renderDailyBox(){
  try{
    const todayIndex = new Date().getDay() - 1;
    const idx = (todayIndex+7)%7;
    const item = window.DAILY && window.DAILY[idx] ? window.DAILY[idx] : {day:'',verse:'',dev:''};
    const box = document.getElementById('dailyBox');
    box.innerHTML = `<strong>${item.day}</strong>: <em>${item.verse}</em> <div style="margin-top:6px;font-size:13px;color:var(--muted)">${item.dev}</div>`;
  }catch(e){ console.warn('daily render',e); }
}

function applyAutoDark(){
  try{
    const hour = new Date().getHours();
    if(hour>=19 || hour<6) document.body.classList.add('dark');
  }catch(e){console.warn(e)}
}

function renderDays(){
  const daysEl = document.getElementById('days');
  daysEl.innerHTML='';
  DAYS.forEach(d=>{
    const b = document.createElement('button'); b.className='day-btn'; if(d===selectedDay) b.classList.add('active');
    b.textContent = d;
    b.addEventListener('click', ()=>{ selectedDay=d; $all('.day-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderCards(); renderDayPanel(); showToast('Día seleccionado: '+d); });
    daysEl.appendChild(b);
  });
}

function renderCards(){
  const container = document.getElementById('cards');
  container.innerHTML='';
  const showAll = document.getElementById('showAll').checked;
  const showAssignedOnly = document.getElementById('showAssigned').checked;
  const assigned = ASSIGNMENTS[selectedDay]||[];

  Object.entries(DATA).forEach(([title,info])=>{
    if(!showAll && showAssignedOnly && !assigned.includes(title)) return;
    const card = document.createElement('article'); card.className='card';
    card.innerHTML = `
      <h2>${escapeHtml(title)}</h2>
      <div class="meta"><strong>Frecuencia:</strong> ${escapeHtml(info.hz)}</div>
      <div class="meta"><strong>BPM sugerido:</strong> ${escapeHtml(info.bpm)}</div>
      <div class="verse">${escapeHtml(info.verse)}</div>
      <div class="note">${escapeHtml(info.note)}</div>
      <div class="controls-row">
        <button class="small copy copy-btn">Copiar</button>
        <button class="small assign assign-btn">${assigned.includes(title)?'Quitar del día':'Asignar al día'}</button>
        <button class="small notebtn note-btn">Nota</button>
      </div>
    `;
    // copy
    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', async ()=>{
      const txt = `${title} — ${info.verse} — ${info.bpm} BPM`;
      const res = await safeCopy(txt);
      if(res.ok) showToast('Copiado al portapapeles'); else showToast('Copia manual disponible.');
    });
    // assign
    card.querySelector('.assign-btn').addEventListener('click', ()=>{ toggleAssignment(selectedDay, title); renderCards(); renderDayPanel(); });
    // note
    card.querySelector('.note-btn').addEventListener('click', ()=>{ const t = prompt('Escribe una nota para esta actividad:', NOTES[title]||''); if(t!==null){ NOTES[title]=t; saveNotes(NOTES); showToast('Nota guardada'); } });

    container.appendChild(card);
  });
}

function renderDayPanel(){
  const panel = document.getElementById('dayList');
  panel.innerHTML='';
  const assigned = ASSIGNMENTS[selectedDay]||[];
  if(assigned.length===0){ panel.innerHTML = '<div class="meta">No hay actividades asignadas a este día.</div>'; return; }
  assigned.forEach(a=>{ const el = document.createElement('div'); el.className='meta'; el.textContent = '• '+a; panel.appendChild(el); });
  const noteArea = document.getElementById('noteArea'); const notes = loadNotes(); noteArea.value = notes[selectedDay]||'';
}

function toggleAssignment(day,title){ const list = ASSIGNMENTS[day]||[]; const idx = list.indexOf(title); if(idx>=0) list.splice(idx,1); else list.push(title); ASSIGNMENTS[day]=list; saveAssignments(ASSIGNMENTS); }

async function safeCopy(text){
  try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(text); return {ok:true}; } }catch(e){ console.warn('clipboard fail',e); }
  try{ const ta = document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.position='absolute'; ta.style.left='-9999px'; document.body.appendChild(ta); const sel=document.getSelection(); const r=document.createRange(); r.selectNodeContents(ta); sel.removeAllRanges(); sel.addRange(r); const ok=document.execCommand('copy'); sel.removeAllRanges(); document.body.removeChild(ta); if(ok) return {ok:true}; }catch(e){ console.warn('exec fallback',e); }
  try{ window.prompt('Copia manualmente:', text); return {ok:false}; }catch(e){ return {ok:false}; }
}

function bindUI(){
  document.getElementById('showAll').addEventListener('change', ()=>renderCards());
  document.getElementById('showAssigned').addEventListener('change', ()=>renderCards());
  document.getElementById('saveNote').addEventListener('click', ()=>{ const a=document.getElementById('noteArea'); const nm=loadNotes(); nm[selectedDay]=a.value; saveNotes(nm); showToast('Nota guardada para '+selectedDay); });
  document.getElementById('exportBtn').addEventListener('click', ()=>downloadSummary());
  document.addEventListener('keydown',(e)=>{ if(e.key.toLowerCase()==='d') downloadSummary(); });
  document.getElementById('modeBtn').addEventListener('click', ()=>{ document.body.classList.toggle('dark'); document.getElementById('modeBtn').textContent = document.body.classList.contains('dark') ? 'Modo día' : 'Modo noche'; });

  // install prompt handling
  let deferredPrompt; const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt = e; installBtn.hidden=false; });
  installBtn.addEventListener('click', async ()=>{ try{ if(deferredPrompt){ deferredPrompt.prompt(); const choice = await deferredPrompt.userChoice; if(choice.outcome==='accepted') showToast('App instalada (o aceptada)'); deferredPrompt=null; installBtn.hidden=true; } }catch(e){ console.warn('install failed',e); } });
}

function showToast(msg,ms=2200){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), ms); }

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function downloadSummary(){ const lines=['Guía espiritual del cuerpo y la mente - Resumen','Día: '+selectedDay,'']; Object.entries(DATA).forEach(([k,v])=>{ lines.push('- '+k); lines.push('   Frecuencia: '+v.hz); lines.push('   BPM sugerido: '+v.bpm); lines.push('   Versículo: '+v.verse); lines.push('   Nota: '+v.note); lines.push(''); }); const blob=new Blob([lines.join('
')],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='guia_'+selectedDay.replace(/\s+/g,'_')+'.txt'; document.body.appendChild(a); a.click(); a.remove(); }

function registerSW(){ if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').then(()=>console.log('SW registered')).catch(e=>console.warn('SW failed',e)); } }

document.addEventListener('DOMContentLoaded', init);
