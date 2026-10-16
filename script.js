// El formulario prepara un mensaje dirigido al correo corporativo.
const CORREO_OFICIAL = "contacto.aurasoft@aurasoft.com";
const botonMenu = document.querySelector('.menu-btn');
const nav = document.querySelector('#nav');
if (botonMenu && nav) {
  botonMenu.addEventListener('click', () => {
    const abierto = nav.classList.toggle('open');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.textContent = abierto ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.textContent = '☰';
  }));
}
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const body = `Nombre: ${data.get('nombre')}\nCorreo de respuesta: ${data.get('email')}\n\nMensaje:\n${data.get('mensaje')}`;
  const url = `mailto:${CORREO_OFICIAL}?subject=${encodeURIComponent('AURABEAUTY: ' + data.get('asunto'))}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Se abrirá tu aplicación de correo para revisar y enviar el mensaje.';
  window.location.href = url;
});


// Microinteracciones: progreso de lectura, animaciones accesibles y quiz de descubrimiento.
const header = document.querySelector('.header');
const progressBar = document.querySelector('#scroll-progress-bar');
const backTop = document.querySelector('#back-top');
function updateScrollUI(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  if(progressBar) progressBar.style.width = `${progress}%`;
  if(header) header.classList.toggle('scrolled', window.scrollY > 10);
  if(backTop) backTop.classList.toggle('visible', window.scrollY > 420);
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();
if(backTop) backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));

const revealTargets = document.querySelectorAll('.section-title,.services article,.thirds article,.halves article,.product,.field-grid,.research-block,.notice,.team,.extra-panel');
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), {threshold:.12});
  revealTargets.forEach((el,i) => {el.classList.add('reveal'); el.style.transitionDelay = `${(i%4)*65}ms`; revealObserver.observe(el);});
}

// Mantiene el enlace de navegación activo según la sección visible.
const navLinks = [...document.querySelectorAll('#nav a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){navLinks.forEach(link => link.classList.toggle('active',link.getAttribute('href') === `#${entry.target.id}`));}
  }), {rootMargin:'-25% 0px -65% 0px'});
  navSections.forEach(section => sectionObserver.observe(section));
}

const quiz = {category:null,priority:null};
const categoryInfo = {
  cuidado:{title:'Explora cuidado personal',text:'Empieza por productos de cuidado facial y personal. Compara la información, las necesidades que atienden y las indicaciones de cada comercio aliado.'},
  belleza:{title:'Explora maquillaje y belleza',text:'Puedes comenzar revisando tonos, acabados y descripciones de productos. Verifica siempre la información específica de cada marca.'},
  moda:{title:'Explora moda y accesorios',text:'Busca prendas y accesorios por estilo, ocasión y descripción. Si compras en línea, revisa tallas, materiales y condiciones del comercio.'},
  todo:{title:'Explora todas las categorías',text:'Recorre cuidado personal, belleza, moda y accesorios para comparar alternativas de los comercios aliados.'}
};
const priorityInfo = {
  calidad:'Prioridad: calidad y confianza. Revisa descripción, materiales o ingredientes cuando corresponda, información del vendedor y condiciones de compra.',
  precio:'Prioridad: precios y ofertas. Compara el precio final, condiciones de la promoción y posibles costos adicionales.',
  estilo:'Prioridad: estilo personal. Usa tus gustos y necesidades como guía, sin dejar de revisar los detalles de cada producto.',
  facilidad:'Prioridad: facilidad. Empieza con categorías claras y compara la información esencial antes de decidir.'
};
const resultBox = document.querySelector('#vibe-result');
function updateQuiz(){
  document.querySelectorAll('[data-category]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.category===quiz.category));
  document.querySelectorAll('[data-priority]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.priority===quiz.priority));
  if(!resultBox)return;
  if(!quiz.category || !quiz.priority){
    resultBox.innerHTML='<span class="result-icon">✧</span><div><b>Tu descubrimiento empieza aquí</b><p>Selecciona una categoría y una prioridad para ver una sugerencia de exploración.</p></div>';return;
  }
  resultBox.innerHTML=`<span class="result-icon">✦</span><div><b>${categoryInfo[quiz.category].title}</b><p>${categoryInfo[quiz.category].text}</p><p><strong>${priorityInfo[quiz.priority]}</strong></p></div>`;
}
document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{quiz.category=btn.dataset.category;updateQuiz()}));
document.querySelectorAll('[data-priority]').forEach(btn=>btn.addEventListener('click',()=>{quiz.priority=btn.dataset.priority;updateQuiz()}));
const resetQuiz=document.querySelector('#reset-quiz');
if(resetQuiz)resetQuiz.addEventListener('click',()=>{quiz.category=null;quiz.priority=null;updateQuiz()});
