import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  popupVisible = true;
  popupMessage = 'Welcome to your Birthday Bash. Are you ready ?';
  private audio!: HTMLAudioElement;
  gifts = [true, true, true, true]; // true = visible
  giftPopupActive = false;
  lastGiftIndex: number | null = null;

  constructor(private router: Router) {}

  // GIF spawner (upward only)
  private gifSources = ['assets/KazooMan.gif', 'assets/HappyBdayGirl.gif', 'assets/BdayDance.gif'];
  private gifTimer: any = null;
  private gifAnimId: any = null;
  private activeGifs: Array<any> = [];

  ngOnInit(): void {
    this.audio = new Audio('assets/HappyBirthdayPiano.mp3');
    this.startGifSpawner();
  }

  ngOnDestroy(): void {
    if (this.gifTimer) { clearInterval(this.gifTimer); this.gifTimer = null; }
    if (this.gifAnimId) { cancelAnimationFrame(this.gifAnimId); this.gifAnimId = null; }
    const layer = document.getElementById('gifLayer');
    if (layer) { layer.innerHTML = ''; }
  }

  async onEnter() {
    if (this.giftPopupActive) {
      // Hide the clicked gift
      if (this.lastGiftIndex !== null) {
        this.gifts[this.lastGiftIndex] = false;
        this.giftPopupActive = false;
        this.popupVisible = false;
        this.lastGiftIndex = null;
      }
      return;
    }
    try {
      await this.audio.play();
    } catch (e) {
      // ignore playback error
    }
    this.popupVisible = false;
    this.startConfetti();
  }

  onGiftClick(idx: number) {
    const visibleCount = this.gifts.filter(g => g).length;
    this.lastGiftIndex = idx;
    if (visibleCount === 1) {
      // Last gift: show Gift found and navigate
      this.popupMessage = 'Gift found!';
      this.popupVisible = true;
      this.giftPopupActive = true;
      setTimeout(() => {
        this.router.navigate(['/reveal']);
      }, 1200);
    } else {
      // Not last: show No Gift and hide gift after popup
      this.popupMessage = 'No Gift';
      this.popupVisible = true;
      this.giftPopupActive = true;
    }
  }

  // --- Confetti implementation converted from CoffeeScript ---
  private confettiAnim: any = null;
  private confettiParticles: any[] = [];

  startConfetti() {
    const NUM_CONFETTI = 350;
    const COLORS = [[85,71,106], [174,61,99], [219,56,83], [244,92,68], [248,182,70]];
    const PI_2 = 2 * Math.PI;

    const canvas = document.getElementById('world') as HTMLCanvasElement;
    if (!canvas) return;
    const context = canvas.getContext('2d')!;
    let w = 0, h = 0;

    const resizeWindow = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeWindow, false);
    setTimeout(resizeWindow, 0);

    const range = (a: number, b: number) => (b - a) * Math.random() + a;

    const drawCircle = (x: number, y: number, r: number, style: string) => {
      context.beginPath();
      context.arc(x, y, r, 0, PI_2, false);
      context.fillStyle = style;
      context.fill();
    };

    let xpos = 0.5;
    document.onmousemove = (e: MouseEvent) => { xpos = e.pageX / w; };

    class Confetti {
      style: number[];
      rgb: string;
      r: number;
      r2: number;
      opacity: number = 0;
      dop: number = 0.03;
      x: number = 0;
      y: number = 0;
      xmax: number = 0;
      ymax: number = 0;
      vx: number = 0;
      vy: number = 0;

      constructor() {
        this.style = COLORS[Math.floor(range(0, 5))];
        this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
        this.r = Math.floor(range(2, 6));
        this.r2 = 2 * this.r;
        this.replace();
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.03 * range(1, 4);
        this.x = range(-this.r2, w - this.r2);
        this.y = range(-20, h - this.r2);
        this.xmax = w - this.r;
        this.ymax = h - this.r;
        this.vx = range(0, 2) + 8 * xpos - 5;
        this.vy = 0.7 * this.r + range(-1, 1);
      }

      draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.dop;
        if (this.opacity > 1) { this.opacity = 1; this.dop *= -1; }
        if (this.opacity < 0 || this.y > this.ymax) this.replace();
        if (!(0 < this.x && this.x < this.xmax)) { this.x = (this.x + this.xmax) % this.xmax; }
        drawCircle(Math.floor(this.x), Math.floor(this.y), this.r, `${this.rgb},${this.opacity})`);
      }
    }

    this.confettiParticles = [];
    for (let i = 0; i < NUM_CONFETTI; i++) {
      this.confettiParticles.push(new Confetti());
    }

    const step = () => {
      this.confettiAnim = requestAnimationFrame(step);
      context.clearRect(0, 0, w, h);
      for (const c of this.confettiParticles) { c.draw(); }
    };

    step();
  }

  // spawn simple upward GIFs, slower, capped count
  private startGifSpawner() {
    const layer = document.getElementById('gifLayer');
    if (!layer) return;

    const MAX_ACTIVE = 10;
    const spawn = () => {
      if (this.activeGifs.length >= MAX_ACTIVE) return;
      const src = this.gifSources[Math.floor(Math.random() * this.gifSources.length)];
      const img = document.createElement('img');
      img.src = src;
      img.className = 'floating-gif';
      const size = 48 + Math.random() * 56; // 48..104 px
      img.style.width = size + 'px';
      img.style.position = 'absolute';
      img.style.pointerEvents = 'none';

      const startX = Math.random() * (window.innerWidth - size);
      const startY = window.innerHeight + 10;
      img.style.left = startX + 'px';
      img.style.top = startY + 'px';
      layer.appendChild(img);

      // simple upward velocity (slow)
      const vy = - (0.4 + Math.random() * 0.8); // -0.4 .. -1.2 px per frame
      const vx = (Math.random() - 0.5) * 0.2; // slight horizontal drift
      const rot = Math.random() * 360;
      const rotSpeed = (Math.random() - 0.5) * 1.5;

      const particle = { img, x: startX, y: startY, vx, vy, rot, rotSpeed, size };
      this.activeGifs.push(particle);
    };

    this.gifTimer = setInterval(() => {
      if (Math.random() < 0.7) spawn();
    }, 800);

    const update = () => {
      for (let i = this.activeGifs.length - 1; i >= 0; i--) {
        const p = this.activeGifs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        // remove when sufficiently off top
        if (p.y + p.size < -150) {
          try { p.img.remove(); } catch (e) {}
          this.activeGifs.splice(i, 1);
          continue;
        }

        p.img.style.left = Math.round(p.x) + 'px';
        p.img.style.top = Math.round(p.y) + 'px';
        p.img.style.transform = `rotate(${p.rot}deg)`;
      }
      this.gifAnimId = requestAnimationFrame(update);
    };

    this.gifAnimId = requestAnimationFrame(update);
  }
}
