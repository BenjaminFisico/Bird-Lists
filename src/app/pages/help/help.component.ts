import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements AfterViewInit{

  @ViewChild('helpSection') helpSection!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    let nativeElement = this.helpSection.nativeElement as HTMLElement;
    let elementChildren = nativeElement.children as HTMLCollectionOf<HTMLElement>;
    for(let i=1; i < elementChildren.length+1; i++){
      setTimeout(() => {
        elementChildren[i-1].style.opacity = "1";
      }, 350*i)
    }
  }

}
