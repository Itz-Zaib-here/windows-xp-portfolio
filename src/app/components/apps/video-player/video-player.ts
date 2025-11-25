import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer {
  private sanitizer = inject(DomSanitizer);
  
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;

  // Default video: Windows XP Installation Music
  currentVideoId = '7nQ2oiVqKHw';
  videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.currentVideoId}?autoplay=1&enablejsapi=1`);

  playlist = [
    '7nQ2oiVqKHw', // XP Startup
    'Gb2jGy76v0Y', // XP Shutdown 
    'rnbmhOAKRHI'  // XP Tour
  ];
  currentIndex = 0;

  updateVideo(url: string) {
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }

    if (videoId) {
      this.loadVideo(videoId);
    }
  }

  loadVideo(videoId: string) {
    this.currentVideoId = videoId;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadVideo(this.playlist[this.currentIndex]);
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadVideo(this.playlist[this.currentIndex]);
  }

  private sendCommand(command: string) {
    if (this.videoIframe && this.videoIframe.nativeElement.contentWindow) {
      this.videoIframe.nativeElement.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    }
  }

  play() {
    this.sendCommand('playVideo');
  }

  pause() {
    this.sendCommand('pauseVideo');
  }

  stop() {
    this.sendCommand('stopVideo');
  }
}

