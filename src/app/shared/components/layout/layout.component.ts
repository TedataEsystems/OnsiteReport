import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  isMenuOpen = true;
  contentMargin = 240;
 // @ViewChild('side') side?:ElementRef ;

  constructor() {  }

  ngOnInit(){ 
    //(this.side as ElementRef).nativeElement.style.marginLeft="240px";
  }

  

  onToolbarMenuToggle() {
 
    this.isMenuOpen = !this.isMenuOpen;

    if(!this.isMenuOpen) {
      this.contentMargin = 0 ;
     
      
    } else {
      this.contentMargin = 240;
  
     

    }
  }

 

}
