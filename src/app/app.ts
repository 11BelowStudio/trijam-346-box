import {afterNextRender, Component, ElementRef, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {Asset_db} from '../game_backend/config/asset_db';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSlideToggleModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('trijam-346-box');

  ngOnInit(): void {
    // Component initialization logic goes here
    //Asset_db.sfx_game_over();
  }
  /*
  constructor() {
    const elementRef = inject(ElementRef);
    afterNextRender({
      read: (didWrite) => {
        Asset_db.sfx_game_over();
      }

    });
  }*/



}
