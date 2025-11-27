import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopIcon } from '../../services/file-system';

@Component({
  selector: 'app-properties-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="properties-dialog">
      <div class="title-bar">
        <div class="title-bar-text">{{ icon.title }} Properties</div>
        <div class="title-bar-controls">
          <button aria-label="Close" (click)="close.emit()"></button>
        </div>
      </div>
      <div class="dialog-body">
        <div class="tabs">
          <div class="tab active">General</div>
        </div>
        <div class="tab-content">
          <div class="general-info">
            <div class="icon-preview">
              <div class="icon-img" [ngClass]="icon.id.startsWith('folder') ? 'folder' : icon.id"></div>
            </div>
            <div class="info-rows">
              <div class="row">
                <label>Type:</label>
                <span>{{ getTypeDescription(icon.type) }}</span>
              </div>
              <div class="row">
                <label>Location:</label>
                <span>C:\\Desktop</span>
              </div>
              <div class="row">
                <label>Size:</label>
                <span>{{ getRandomSize() }} KB</span>
              </div>
              <div class="separator"></div>
              <div class="row">
                <label>Created:</label>
                <span>{{ currentDate | date:'longDate' }}</span>
              </div>
              <div class="separator"></div>
              <div class="row checkbox-row">
                <label>Attributes:</label>
                <div class="checkboxes">
                  <label><input type="checkbox" disabled> Read-only</label>
                  <label><input type="checkbox" disabled> Hidden</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-buttons">
          <button (click)="close.emit()">OK</button>
          <button (click)="close.emit()">Cancel</button>
          <button disabled>Apply</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .properties-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 350px;
      background: #ece9d8;
      border: 1px solid #0055ea;
      border-radius: 3px;
      box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
      z-index: 10000;
      font-family: 'Tahoma', sans-serif;
      font-size: 11px;
      display: flex;
      flex-direction: column;
    }

    .title-bar {
      background: linear-gradient(to right, #0058ee 0%, #3593ff 4%, #288eff 18%, #127dff 100%);
      padding: 3px 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-weight: bold;
      border-radius: 3px 3px 0 0;
    }

    .title-bar-controls button {
      width: 21px;
      height: 21px;
      background: url('/assets/icons/close.png') no-repeat center; /* Fallback or use CSS shape */
      background-color: #d74b2e;
      border: 1px solid white;
      border-radius: 3px;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .title-bar-controls button::after {
      content: '×';
      font-size: 16px;
      line-height: 16px;
    }

    .dialog-body {
      padding: 10px;
      flex: 1;
    }

    .tabs {
      display: flex;
      margin-bottom: -1px;
      padding-left: 5px;
    }

    .tab {
      padding: 3px 10px;
      background: #ece9d8;
      border: 1px solid #aca899;
      border-bottom: none;
      border-radius: 3px 3px 0 0;
      margin-right: 2px;
      cursor: default;
      
      &.active {
        background: white;
        border-bottom: 1px solid white;
        position: relative;
        z-index: 1;
        top: 1px;
      }
    }

    .tab-content {
      background: white;
      border: 1px solid #aca899;
      padding: 15px;
      min-height: 250px;
    }

    .general-info {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .icon-preview {
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #aca899;
      
      .icon-img {
        width: 48px;
        height: 48px;
        /* Reusing desktop icon styles via global or mixin would be better, but duplicating for now */
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        
        &.projects::after { content: '👩‍💻'; }
        &.browser::after { content: '🌐'; }
        &.paint::after { content: '🎨'; }
        &.video::after { content: '🎬'; }
        &.connect::after { content: '💬'; }
        &.recycle::after { content: '🗑️'; }
        &.folder::after { content: '📁'; }
        &.resume::after { content: '📝'; }
        &.experience::after { content: '💼'; }
        &.services::after { content: '🛠️'; }
      }
    }

    .info-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .row {
      display: flex;
      align-items: center;
      
      label {
        width: 80px;
        color: #666;
      }
    }

    .separator {
      height: 1px;
      background: #aca899;
      margin: 5px 0;
    }

    .checkboxes {
      display: flex;
      gap: 10px;
    }

    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 5px;
      margin-top: 10px;
      
      button {
        min-width: 75px;
        padding: 3px 10px;
        font-family: 'Tahoma', sans-serif;
        font-size: 11px;
        cursor: pointer;
      }
    }
  `]
})
export class PropertiesDialog {
  @Input({ required: true }) icon!: DesktopIcon;
  @Output() close = new EventEmitter<void>();

  currentDate = new Date();

  getTypeDescription(type: string): string {
    switch (type) {
      case 'app': return 'Application';
      case 'folder': return 'File Folder';
      case 'link': return 'Shortcut';
      default: return 'File';
    }
  }

  getRandomSize(): number {
    return Math.floor(Math.random() * 1000) + 10;
  }
}
