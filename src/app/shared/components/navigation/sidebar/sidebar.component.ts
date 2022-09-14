import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole = localStorage.getItem('userGroup');
  userName = localStorage.getItem('userName');
  constructor(private titleService: Title) {
    //this.titleService.setTitle("sidnave");
  
   }

  ngOnInit(): void {
  }


 
 
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  

}
