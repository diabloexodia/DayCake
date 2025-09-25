import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-count-on-me',
  templateUrl: './count-on-me.component.html',
  styleUrls: ['./count-on-me.component.css']
})
export class CountOnMeComponent implements OnInit {
  popupVisible = true;
  private audio!: HTMLAudioElement;
  private animationDuration = 900; // ms - match CSS animation timing
  private emojiTimer: any = null;

  ngOnInit(): void {
    this.audio = new Audio('assets/countonme.mp3');
  }

  ngAfterViewInit(): void {
    this.startEmojiWallpaper();
  }

  ngOnDestroy(): void {
    if (this.emojiTimer) { clearInterval(this.emojiTimer); this.emojiTimer = null; }
    const wall = document.getElementById('emojiWallpaper');
    if (wall) wall.innerHTML = '';
  }

  private startEmojiWallpaper() {
    const emojis = ['🌸','✨','🌸','✨','🌸','✨'];
    const wall = document.getElementById('emojiWallpaper');
    if (!wall) return;
    const spawn = () => {
      // spawn a batch of emojis randomly placed
      for (let i = 0; i < 40; i++) {
        const span = document.createElement('span');
        span.className = 'emoji';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.top = Math.random() * 100 + '%';
        span.style.fontSize = (12 + Math.random() * 28) + 'px';
        span.style.opacity = (0.35 + Math.random() * 0.7).toString();
        wall.appendChild(span);
      }
      // keep DOM size bounded
      while (wall.children.length > 600) { wall.removeChild(wall.firstChild as ChildNode); }
    };
    spawn();
    // periodically add more for movement/refresh effect
    this.emojiTimer = setInterval(spawn, 3000);
  }

  async onEnter() {
    try {
      await this.audio.play();
    } catch (e) {
      // ignore playback error
    }
    this.popupVisible = false;
  }

  // Trigger the letter opening animation, then close popup
  onLetterClicked() {
    const el = document.querySelector('.popup .letter-image');
    if (!el) { this.onEnter(); return; }
    el.classList.add('open');
    setTimeout(() => {
      this.onEnter();
    }, this.animationDuration);
  }
}
