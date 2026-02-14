document.addEventListener('DOMContentLoaded', () => {
    
    // Referencias
    const coverScreen = document.getElementById('cover-screen');
    const btnAbrir = document.getElementById('btnAbrir');
    const audioPlayer = document.getElementById('audioPlayer');
    const popSound = document.getElementById('popSound');
    const dockBtns = document.querySelectorAll('.dock-btn');
    const tabs = document.querySelectorAll('.tab');

    // Zoom
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('expanded-img');
    const closeBtn = document.querySelector('.close-modal');
    const zoomableImgs = document.querySelectorAll('img');

    // Sonido
    function playPop() {
        popSound.currentTime = 0;
        popSound.volume = 0.5;
        popSound.play().catch(()=>{});
    }

    // 1. INICIAR SISTEMA
    btnAbrir.addEventListener('click', () => {
        playPop();
        coverScreen.style.transform = 'translateY(-100%)';
        audioPlayer.volume = 0.5;
        audioPlayer.play().catch(e => console.log("Audio autoplay bloqueado"));
    });

    // 2. NAVEGACIÓN DOCK
    dockBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playPop();
            
            // UI Update
            dockBtns.forEach(b => b.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');

            // Si es la pestaña carta, iniciar máquina de escribir
            if(target === 'tab-carta') {
                startTypewriter();
            }
        });
    });

    // 3. MÁQUINA DE ESCRIBIR (TYPEWRITER EFFECT)
    let typed = false;
    function startTypewriter() {
        if(typed) return; // Solo escribir una vez
        typed = true;
        
        const rawText = document.getElementById('raw-text').innerText;
        const targetElement = document.getElementById('typewriter-text');
        let i = 0;

        targetElement.innerHTML = '<span class="typing-cursor"></span>';

        function type() {
            if (i < rawText.length) {
                // Manejar saltos de linea
                if(rawText.charAt(i) === '\n') {
                    targetElement.innerHTML = rawText.substring(0, i+1) + '<br><span class="typing-cursor"></span>';
                } else {
                    targetElement.innerHTML = rawText.substring(0, i+1) + '<span class="typing-cursor"></span>';
                }
                i++;
                setTimeout(type, 30); // Velocidad de escritura
            } else {
                // Quitar cursor al final
                 targetElement.innerHTML = rawText; 
            }
        }
        type();
    }

    // 4. ZOOM LIGHTBOX
    zoomableImgs.forEach(img => {
        img.addEventListener('click', (e) => {
            if(img.classList.contains('modal-content')) return; // No zoom al modal
            playPop();
            modal.style.display = "flex";
            modalImg.src = img.src;
        });
    });
    closeBtn.addEventListener('click', () => modal.style.display = "none");
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.style.display = "none";
    });

    // 5. CORAZONES AL HACER CLICK EN EL FONDO
    document.body.addEventListener('click', (e) => {
        // Solo si clickea en el fondo (body o app-container, no botones)
        if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'IMG') {
            createHeart(e.clientX, e.clientY);
        }
    });

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.classList.add('heart-click');
        heart.innerHTML = ['❤️', '✨', '💜', '🎮'][Math.floor(Math.random()*4)];
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
});