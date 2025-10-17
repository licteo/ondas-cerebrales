/* ...existing code... */
/* App for "Guía Espiritual del Cuerpo y la Mente" */
/* Mobile-friendly PWA; no frameworks */

const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

const ACTIVITIES = [
  { id:'sleep', title:'Dormir / descanso profundo', brain:'Delta', bpm:'40-60 BPM',
    verse:'Salmo 4:8 “En paz me acostaré y asimismo dormiré; porque solo tú, Jehová, me haces vivir confiado.”',
    note:'Prioriza un ambiente silencioso y rutina para sueño reparador.'},
  { id:'wake', title:'Despertar / transición al día', brain:'Theta → Alpha', bpm:'60-70 BPM',
    verse:'Salmo 5:3 “Oh Jehová, de mañana oirás mi voz; de mañana me presentaré delante de ti, y esperaré.”',
    note:'Respira conscientemente y establece intención para el día.'},
  { id:'prayer', title:'Oración / meditación', brain:'Alpha', bpm:'60-80 BPM',
    verse:'Filipenses 4:6-7 “No se inquieten por nada; sino que en todo, mediante oración y súplica... y la paz de Dios guardará sus corazones.”',
    note:'Cinco minutos de silencio centrado puede recalibrar la mente.'},
  { id:'breakfast', title:'Desayuno / alimentación consciente', brain:'Beta', bpm:'70-80 BPM',
    verse:'1 Corintios 10:31 “...hacedlo todo para la gloria de Dios.”',
    note:'Come despacio, saborea y agradece cada bocado.'},
  { id:'exercise', title:'Ejercicio físico', brain:'Beta → Gamma', bpm:'110-140 BPM',
    verse:'1 Corintios 6:19-20 “...su cuerpo es templo del Espíritu Santo...”',
    note:'Movimiento moderado para energía y claridad mental.'},
  { id:'work', title:'Trabajo / concentración activa', brain:'Beta', bpm:'70-90 BPM',
    verse:'Colosenses 3:23 “Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.”',
    note:'Bloques de trabajo sin distracciones de 45-60 minutos.'},
  { id:'study', title:'Estudio / aprendizaje', brain:'Gamma', bpm:'60-85 BPM',
    verse:'Proverbios 1:5 “Oirá el sabio y aumentará su saber...”',
    note:'Combina lectura activa con pequeñas prácticas.'},
  { id:'talk', title:'Conversación / vida social', brain:'Alpha → Beta', bpm:'70-85 BPM',
    verse:'Proverbios 27:17 “El hierro se afila con hierro; y el hombre, con el rostro de su amigo.”',
    note:'Conexiones profundas nutren el espíritu; escucha activamente.'},
  { id:'play', title:'Recreación / creatividad / juegos', brain:'Alpha', bpm:'60-100 BPM',
    verse:'Eclesiastés 3:4 “Tiempo de llorar, y tiempo de reír; tiempo de prorrumpir en danza...”',
    note:'Reserva tiempo para creatividad sin juicio.'},
  { id:'intimacy', title:'Tiempo en pareja / intimidad', brain:'Alpha', bpm:'60-90 BPM',
    verse:'Efesios 5:25 “Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia...”',
    note:'Comunicación amorosa y presencia plena.'},
  { id:'dinner', title:'Cena / descanso familiar', brain:'Theta → Alpha', bpm:'60-75 BPM',
    verse:'Salmo 127:3 “Los hijos son herencia de Jehová; cosa de estima el fruto del vientre.”',
    note:'Comida familiar como práctica de gratitud.'},
  { id:'nightprayer', title:'Oración nocturna / reflexión', brain:'Theta', bpm:'50-70 BPM',
    verse:'Salmo 119:105 “Lámpara es a mis pies tu palabra, y lumbrera a mi camino.”',
    note:'Reflexiona sobre el día y entrega preocupaciones.'}
];

/* DOM refs */
const daysEl = document.querySelector('.days');
const activitiesEl = document.getElementById('activities');
const selectedDayEl = document.getElementById('selected-day');
const dayNoteEl = document.getElementById('day-note');
const tpl = document.getElementById('activity-tpl');
const themeToggle = document.getElementById('theme-toggle');
const installBtn = document.getElementById('install-btn');

let deferredPrompt = null;

/* render day buttons */
function renderDays(){
  DAYS.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'day-btn';
    btn.textContent = d;
    btn.dataset.index = i;
    btn.addEventListener('click', () => selectDay(i, btn));
    daysEl.appendChild(btn);
  });
}

/* handle selection with small animation */
function selectDay(index, btn){
  // clear active
  document.querySelectorAll('.day-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const dayName = DAYS[index];
  selectedDayEl.textContent = dayName;
  dayNoteEl.textContent = `Actividades espirituales sugeridas para ${dayName}.`;
  // animate content swap
  activitiesEl.style.opacity = 0;
  setTimeout(()=> {
    renderActivitiesForDay(index);
    activitiesEl.style.opacity = 1;
  }, 180);
}

/* For demo purposes, show all activities each day; could be customized per day */
function renderActivitiesForDay(){
  activitiesEl.innerHTML = '';
  ACTIVITIES.forEach(act=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.activity-title').textContent = act.title;
    node.querySelector('.activity-reflection').textContent = act.note;
    node.querySelector('.brainwave').textContent = act.brain;
    node.querySelector('.bpm').textContent = act.bpm;
    node.querySelector('.verse').textContent = act.verse;
    activitiesEl.appendChild(node);
  });
}

/* Theme handling */
function initTheme(){
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
  themeToggle.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(curr === 'dark' ? 'light' : 'dark');
  });
}
function setTheme(name){
  if(name === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', name);
  themeToggle.setAttribute('aria-pressed', name === 'dark');
}

/* PWA install button handling */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if(choice.outcome === 'accepted'){
    installBtn.hidden = true;
  }
  deferredPrompt = null;
});

/* Register service worker */
if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
    try{
      const reg = await navigator.serviceWorker.register('service-worker.js');
      console.log('ServiceWorker registrado', reg);
    }catch(err){
      console.warn('ServiceWorker fallo', err);
    }
  });
}

/* initialize */
renderDays();
initTheme();
/* initial placeholder content */
renderActivitiesForDay();
/* ...existing code... */

