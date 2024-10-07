import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('sidepanel', { static: false }) sidepanel: ElementRef;

  openSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 250px');
  }

  closeSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 0px');
  }
}
