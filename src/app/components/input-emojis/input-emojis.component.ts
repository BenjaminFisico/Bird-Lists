import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DocumentClickService } from 'src/app/services/document-click.service';

@Component({
  selector: 'app-input-emojis',
  templateUrl: './input-emojis.component.html',
  styleUrls: ['./input-emojis.component.css']
})
export class InputEmojisComponent implements AfterViewInit {
  @ViewChild('formEmoji') emojiForm!: ElementRef;
  protected clickEventListener: EventListener | undefined;

  constructor( private documentClickEvents: DocumentClickService ){
    this.clickEventListener = undefined;
  }

  ngAfterViewInit(): void {
    this.documentClickEvents.setEmojiForm(this);
    this.emojiForm.nativeElement.style.display = "none";
  }

  moveEmojiSection(sectionStart: number){
    let emojiContainer = document.getElementById('emojiContainer');
    emojiContainer?.scrollTo(sectionStart, 0);
  }

  emojiSelect(emojiValue: string){
    this.documentClickEvents.emojiFormClicked(emojiValue);
  }

  clickEventConfiguration(){
    const focusOutFunction = this.documentClickEvents.formFocusOut(" ", ()=>{
      this.closeEmojiPanel();
    });

    this.clickEventListener = (e) => focusOutFunction(e);
    document.addEventListener('mousedown', this.clickEventListener);
  }

  closeEmojiPanel(){
    this.emojiForm.nativeElement.style.display = "none";
    if(this.clickEventListener){
      document.removeEventListener('mousedown', this.clickEventListener);
    }
  }

}
