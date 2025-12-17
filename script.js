// =====================================
// NEXUS THEME CONTROL SYSTEM v2.1
// =====================================
class NexusTheme {
    constructor() {
        // Estado del sistema
        this.isDarkMode = false;
        this.themeChanges = parseInt(localStorage.getItem('themeChanges')) || 0;
        this.startTime = Date.now();
        this.particleCount = 50;
        
        // Referencias a elementos del DOM
        this.initializeElements();
        
        // Inicializar sistema
        this.init();
    }
    
    // =====================================
    // INICIALIZACIÓN DEL SISTEMA
    // =====================================
    initializeElements() {
        // Elementos principales
        this.body = document.body;
        this.themeToggle = document.getElementById('themeToggle');
        this.themeStatus = document.getElementById('themeStatus');
        this.sunIcon = document.getElementById('sunIcon');
        this.moonIcon = document.getElementById('moonIcon');
        
        // Previsualización
        this.previewBtns = document.querySelectorAll('.preview-btn');
        this.previewLight = document.getElementById('previewLight');
        this.previewDark = document.getElementById('previewDark');
        
        // Contadores y estadísticas
        this.themeChangesElement = document.getElementById('themeChanges');
        this.uptimeElement = document.getElementById('uptime');
        
        // Botones de acción
        this.resetBtn = document.getElementById('resetBtn');
        this.aboutBtn = document.getElementById('aboutBtn');
        
        // Modal
        this.infoModal = document.getElementById('infoModal');
        this.closeModalBtn = document.getElementById('closeModal');
        
        // Contenedor de partículas
        this.particlesContainer = document.getElementById('particles');
    }
    
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.createParticles();
        this.startUptimeCounter();
        this.updateStats();
        this.initializeSystemEffects();
    }
    
    // =====================================
    // MANEJO DE EVENTOS
    // =====================================
    setupEventListeners() {
        // Toggle principal
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Botones de previsualización
        this.previewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.closest('.preview-btn').dataset.theme;
                this.previewTheme(theme);
            });
        });
        
        // Botones de acción
        this.resetBtn.addEventListener('click', () => this.resetPreferences());
        this.aboutBtn.addEventListener('click', () => this.showInfo());
        this.closeModalBtn.addEventListener('click', () => this.hideInfo());
        
        // Cerrar modal al hacer clic fuera
        this.infoModal.addEventListener('click', (e) => {
            if (e.target === this.infoModal) this.hideInfo();
        });
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Detectar preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applySystemPreference(e.matches);
            }
        });
    }
    
    // =====================================
    // CONTROL DEL TEMA
    // =====================================
    toggleTheme() {
        // Cambiar estado
        this.isDarkMode = !this.isDarkMode;
        
        // Aplicar cambios
        this.applyTheme();
        
        // Guardar preferencia
        this.savePreference();
        
        // Actualizar contador
        this.themeChanges++;
        localStorage.setItem('themeChanges', this.themeChanges);
        
        // Actualizar interfaz
        this.updateInterface();
        
        // Efectos de transición
        this.triggerTransitionEffects();
        
        // Sonido (opcional)
        this.playTransitionSound();
        
        console.log(`🔁 Tema cambiado a: ${this.isDarkMode ? 'OSCURO' : 'CLARO'}`);
        console.log(`📊 Total de cambios: ${this.themeChanges}`);
    }
    
    applyTheme() {
        if (this.isDarkMode) {
            this.body.classList.add('dark-mode');
        } else {
            this.body.classList.remove('dark-mode');
        }
        
        // Actualizar vista previa
        this.updatePreview();
    }
    
    updateInterface() {
        // Actualizar estado
        this.themeStatus.textContent = this.isDarkMode ? 'MODO OSCURO' : 'MODO CLARO';
        
        // Actualizar iconos
        if (this.isDarkMode) {
            this.sunIcon.style.opacity = '0';
            this.sunIcon.style.transform = 'rotate(-180deg)';
            this.moonIcon.style.opacity = '1';
            this.moonIcon.style.transform = 'rotate(0)';
        } else {
            this.sunIcon.style.opacity = '1';
            this.sunIcon.style.transform = 'rotate(0)';
            this.moonIcon.style.opacity = '0';
            this.moonIcon.style.transform = 'rotate(180deg)';
        }
        
        // Actualizar botones de previsualización
        this.previewBtns.forEach(btn => {
            const theme = btn.dataset.theme;
            btn.classList.remove('active');
            
            if ((this.isDarkMode && theme === 'dark') || (!this.isDarkMode && theme === 'light')) {
                btn.classList.add('active');
            }
        });
        
        // Actualizar estadísticas
        this.updateStats();
    }
    
    // =====================================
    // PERSISTENCIA Y CARGA
    // =====================================
    savePreference() {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    
    loadTheme() {
        // Cargar preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        } else {
            // Detectar preferencia del sistema
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode = prefersDark;
        }
        
        // Aplicar tema cargado
        this.applyTheme();
        this.updateInterface();
        
        console.log(`📂 Tema cargado: ${savedTheme || 'Preferencia del sistema'}`);
    }
    
    applySystemPreference(isDark) {
        if (!localStorage.getItem('theme')) {
            this.isDarkMode = isDark;
            this.applyTheme();
            this.updateInterface();
            console.log(`🌐 Tema del sistema aplicado: ${isDark ? 'OSCURO' : 'CLARO'}`);
        }
    }
    
    // =====================================
    // PREVISUALIZACIÓN
    // =====================================
    previewTheme(theme) {
        const isDarkPreview = theme === 'dark';
        
        // Actualizar botones
        this.previewBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar vista previa
        if (isDarkPreview) {
            this.previewLight.style.opacity = '0.5';
            this.previewDark.style.opacity = '1';
        } else {
            this.previewLight.style.opacity = '1';
            this.previewDark.style.opacity = '0.5';
        }
        
        console.log(`👁️ Vista previa: ${isDarkPreview ? 'Tema Oscuro' : 'Tema Claro'}`);
    }
    
    updatePreview() {
        // Sincronizar vista previa con tema actual
        if (this.isDarkMode) {
            this.previewLight.style.opacity = '0.5';
            this.previewDark.style.opacity = '1';
        } else {
            this.previewLight.style.opacity = '1';
            this.previewDark.style.opacity = '0.5';
        }
    }
    
    // =====================================
    // EFECTOS Y ANIMACIONES
    // =====================================
    triggerTransitionEffects() {
        // Efecto de partículas
        this.createParticles();
        
        // Efecto de brillo
        const glow = document.createElement('div');
        glow.className = 'transition-glow';
        glow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle, ${this.isDarkMode ? 'rgba(114, 9, 183, 0.3)' : 'rgba(67, 97, 238, 0.3)'} 0%, transparent 70%);
            pointer-events: none;
            z-index: 999;
            animation: fadeOut 1s ease forwards;
        `;
        
        document.body.appendChild(glow);
        
        // Definir animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
            }
        `;
        document.head.appendChild(style);
        
        // Eliminar después de la animación
        setTimeout(() => {
            if (glow.parentNode) glow.parentNode.removeChild(glow);
            if (style.parentNode) style.parentNode.removeChild(style);
        }, 1000);
    }
    
    createParticles() {
        // Limpiar partículas existentes
        this.particlesContainer.innerHTML = '';
        
        // Crear nuevas partículas
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posición aleatoria
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Tamaño aleatorio
            const size = Math.random() * 3 + 1;
            
            // Duración aleatoria
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            // Aplicar estilos
            particle.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: ${this.isDarkMode ? '#7209b7' : '#4361ee'};
                animation: particleFloat ${duration}s linear ${delay}s infinite;
            `;
            
            this.particlesContainer.appendChild(particle);
        }
    }
    
    playTransitionSound() {
        // Crear sonido de transición (opcional)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = this.isDarkMode ? 220 : 440;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Silenciar error si el audio no está soportado
        }
    }
    
    // =====================================
    // SISTEMA DE ESTADÍSTICAS
    // =====================================
    updateStats() {
        this.themeChangesElement.textContent = this.themeChanges;
    }
    
    startUptimeCounter() {
        setInterval(() => {
            const uptime = Date.now() - this.startTime;
            const hours = Math.floor(uptime / 3600000);
            const minutes = Math.floor((uptime % 3600000) / 60000);
            const seconds = Math.floor((uptime % 60000) / 1000);
            
            this.uptimeElement.textContent = 
                `${String(hours).padStart(2, '0')}:` +
                `${String(minutes).padStart(2, '0')}:` +
                `${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }
    
    // =====================================
    // FUNCIONES DEL SISTEMA
    // =====================================
    resetPreferences() {
        if (confirm('¿Restablecer todas las preferencias del sistema?')) {
            localStorage.removeItem('theme');
            localStorage.removeItem('themeChanges');
            
            this.themeChanges = 0;
            this.startTime = Date.now();
            
            // Aplicar preferencia del sistema
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode = prefersDark;
            
            this.applyTheme();
            this.updateInterface();
            this.updateStats();
            
            this.showNotification('✅ Preferencias restablecidas', 'success');
            console.log('🔄 Sistema reiniciado');
        }
    }
    
    showInfo() {
        this.infoModal.classList.add('show');
    }
    
    hideInfo() {
        this.infoModal.classList.remove('show');
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.isDarkMode ? '#1a1a2e' : '#ffffff'};
            color: ${this.isDarkMode ? '#e0e0e0' : '#1a1a2e'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border-left: 4px solid ${type === 'success' ? '#06d6a0' : '#4361ee'};
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            opacity: 0;
            animation: slideIn 0.3s ease forwards, slideOut 0.3s ease 2.7s forwards;
            z-index: 1000;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Definir animaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Eliminar después de la animación
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
            if (style.parentNode) style.parentNode.removeChild(style);
        }, 3000);
    }
    
    // =====================================
    // ATAJOS DE TECLADO
    // =====================================
    handleKeyboardShortcuts(e) {
        // Ignorar si el usuario está escribiendo
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl + Shift + T - Alternar tema
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            this.toggleTheme();
            this.showNotification('🎨 Tema alternado', 'info');
        }
        
        // Ctrl + Shift + D - Modo oscuro
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            if (!this.isDarkMode) this.toggleTheme();
            this.showNotification('🌙 Modo oscuro activado', 'info');
        }
        
        // Ctrl + Shift + L - Modo claro
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            if (this.isDarkMode) this.toggleTheme();
            this.showNotification('☀️ Modo claro activado', 'info');
        }
        
        // Ctrl + Shift + R - Reiniciar
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            this.resetPreferences();
        }
        
        // Escape - Cerrar modales
        if (e.key === 'Escape') {
            this.hideInfo();
        }
    }
    
    // =====================================
    // EFECTOS DE INICIALIZACIÓN
    // =====================================
    initializeSystemEffects() {
        // Efecto de entrada
        setTimeout(() => {
            this.showNotification('🚀 NexusTheme v2.1 iniciado', 'info');
        }, 500);
        
        // Mostrar atajos de teclado
        setTimeout(() => {
            console.log('⌨️  Atajos disponibles:');
            console.log('Ctrl + Shift + T - Alternar tema');
            console.log('Ctrl + Shift + D - Modo oscuro');
            console.log('Ctrl + Shift + L - Modo claro');
            console.log('Ctrl + Shift + R - Reiniciar');
            console.log('Escape - Cerrar modales');
        }, 1000);
    }
    
    // =====================================
    // INICIALIZAR APLICACIÓN
    // =====================================
    static init() {
        // Crear instancia singleton
        if (!window.nexusTheme) {
            window.nexusTheme = new NexusTheme();
        }
        return window.nexusTheme;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    NexusTheme.init();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('❌ Error en NexusTheme:', e.error);
});

// Exportar para uso global (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusTheme;
}