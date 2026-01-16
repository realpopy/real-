// Inicialización de comportamiento del menú y estado inicial
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav.nav-menu a');
    const header = document.getElementById('header');

    function setActiveLinkById(id) {
        navLinks.forEach(a => {
            if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
            else a.classList.remove('active');
        });
    }

    navLinks.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = (a.getAttribute('href') || '').replace('#', '').trim();
            if (!targetId) return;
            mostrarServicio(targetId);
            setActiveLinkById(targetId);
        });
    });

    const btnTodos = document.getElementById('mostrar-todos');
    if (btnTodos) {
        btnTodos.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarTodos();
            navLinks.forEach(l => l.classList.remove('active'));
        });
    }

    // Estado inicial: mostrar sólo la sección de inicio
    const secciones = document.querySelectorAll('.servicio, .loteria');
    secciones.forEach(sec => {
        if (sec.id === 'inicio') {
            sec.style.display = 'flex';
            sec.style.opacity = '1';
            sec.style.transform = 'translateY(0)';
        } else {
            sec.style.display = 'none';
        }
    });
    setActiveLinkById('inicio');

    // Lógica dinámica para header: esconder al hacer scroll hacia abajo, mostrar al subir
    let lastScrollTop = 0;
    let ticking = false;

    function updateHeader() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const delta = st - lastScrollTop;

        if (Math.abs(delta) > 5) { // Umbral para evitar cambios frecuentes
            if (st > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (delta > 0 && st > 50) { // Scroll hacia abajo: esconder
                header.classList.add('hidden');
            } else { // Scroll hacia arriba: mostrar
                header.classList.remove('hidden');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Mostrar header al inicio
    header.classList.remove('hidden');
});

// Script para mostrar solo el servicio seleccionado y efectos visuales
function mostrarServicio(servicioId) {
    const secciones = document.querySelectorAll('.servicio, .loteria');
    secciones.forEach(sec => {
        if (sec.id === servicioId) {
            sec.style.display = 'flex';
            sec.style.opacity = '0';
            sec.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                sec.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                sec.style.opacity = '1';
                sec.style.transform = 'translateY(0)';
            });
            const video = sec.querySelector('video');
            if (video) {
                // No autoplay: solo preparar, reproducir solo si usuario interactúa (click en play)
                video.currentTime = 0;
                video.muted = false;
                // Remover autoplay si existiera, pero no lo tiene
                video.play().catch(e => {
                    // Si falla (por política de autoplay), no reproducir hasta interacción
                    console.warn('Video paused until user interaction:', e);
                    video.pause();
                });
            }
        } else {
            sec.style.display = 'none';
            const video = sec.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
                video.muted = true;
            }
        }
    });
    const element = document.querySelector(`#${servicioId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function mostrarTodos() {
    const secciones = document.querySelectorAll('.servicio, .loteria');
    secciones.forEach(sec => {
        if (sec.id !== 'inicio') {
            sec.style.display = 'flex';
            sec.style.opacity = '1';
            sec.style.transform = 'translateY(0)';
            sec.style.transition = 'all 0.3s ease';
            const videos = sec.querySelectorAll('video');
            videos.forEach(video => {
                video.controls = true;
                video.muted = false;
                video.pause(); // Pausar todos para aislamiento
            });
        } else {
            sec.style.display = 'none';
        }
    });
    document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
}