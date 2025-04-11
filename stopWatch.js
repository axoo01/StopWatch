class Stopwatch {
    constructor() {
        this.display = document.getElementById('display');
        this.lapList = document.getElementById('lap-list');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.lapBtn = document.getElementById('lap-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.clickSound = document.getElementById('click-sound');
        
        this.timer = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.laps = JSON.parse(localStorage.getItem('laps')) || [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTheme();
        this.renderLaps();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.lapBtn.addEventListener('click', () => this.lap());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timer = setInterval(() => this.update(), 10);
            this.isRunning = true;
            this.playSound();
            this.updateButtonStates();
            this.display.classList.add('active');
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.elapsedTime = Date.now() - this.startTime;
            this.isRunning = false;
            this.playSound();
            this.updateButtonStates();
            this.display.classList.remove('active');
        }
    }

    lap() {
        if (this.isRunning) {
            const time = this.formatTime(this.elapsedTime);
            this.laps.push(time);
            localStorage.setItem('laps', JSON.stringify(this.laps));
            this.renderLaps();
            this.playSound();
        }
    }

    reset() {
        clearInterval(this.timer);
        this.elapsedTime = 0;
        this.startTime = 0;
        this.isRunning = false;
        this.display.textContent = '00:00:00.00';
        this.laps = [];
        localStorage.removeItem('laps');
        this.renderLaps();
        this.playSound();
        this.updateButtonStates();
        this.display.classList.remove('active');
    }

    update() {
        this.elapsedTime = Date.now() - this.startTime;
        this.display.textContent = this.formatTime(this.elapsedTime);
    }

    formatTime(time) {
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const seconds = Math.floor((time / 1000) % 60);
        const milliseconds = Math.floor((time % 1000) / 10);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }

    renderLaps() {
        this.lapList.innerHTML = this.laps.length ? 
            this.laps.map((lap, index) => `<div class="lap-item"><span>Lap ${index + 1}</span><span>${lap}</span></div>`).join('') : 
            '<div class="lap-item">No laps recorded</div>';
    }

    updateButtonStates() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        this.lapBtn.disabled = !this.isRunning;
        this.resetBtn.disabled = this.elapsedTime === 0;
    }

    toggleTheme() {
        document.body.classList.toggle('dark');
        this.themeToggle.innerHTML = document.body.classList.contains('dark') ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        this.playSound();
    }

    loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    playSound() {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
    }
}

document.addEventListener('DOMContentLoaded', () => new Stopwatch());