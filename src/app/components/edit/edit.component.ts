import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  constructor(private router: Router, private location: Location) {}

  // same as the create page
  // go back to past page
  goBack() {
    this.location.back();
  }
}
