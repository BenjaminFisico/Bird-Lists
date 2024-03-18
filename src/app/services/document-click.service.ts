import { ComponentRef, Injectable } from '@angular/core';
import { InputEmojisComponent } from '../components/input-emojis/input-emojis.component';

@Injectable({
  providedIn: 'root'
})
export class DocumentClickService {

  private insertEmojiInput!: HTMLInputElement | HTMLTextAreaElement | undefined;
  private emojiForm!: InputEmojisComponent;

  constructor() { }

  formFocusOut(idForm: string, destroyFuncion: () => void){
    const handleFormGroupEvent = (event: Event) => {
      const target = event.target as any;
      if(target.form?.id == "formEmoji" || target.id == "formEmoji" || target.role == "button"){ 
        console.log("Emoji form pressed");
        return;
      }
      if(target.form?.id != idForm && target.id != idForm && target.tagName != 'HTML'){
        destroyFuncion();
      }
    }
    return handleFormGroupEvent;
  }

  openEmojiForm(insertIn:HTMLInputElement | HTMLTextAreaElement){
    const emojiForm: HTMLElement = document.getElementById("formEmoji") as HTMLElement;
    if(emojiForm != null){
      emojiForm.style.display = "block";
      emojiForm.style.top = (insertIn.getBoundingClientRect().bottom + window.scrollY) + "px";
      emojiForm.style.left = ((insertIn.getBoundingClientRect().right + window.scrollX) - emojiForm.clientWidth) + "px";
    }
    this.insertEmojiInput = insertIn;
    insertIn.focus();
    this.emojiForm.clickEventConfiguration();
  }

  closeEmojiForm(){
    this.insertEmojiInput = undefined;
    this.emojiForm.closeEmojiPanel();
  }

  emojiFormClicked(emoji :string){
    if(this.insertEmojiInput && ( this.insertEmojiInput.maxLength == -1 || this.insertEmojiInput.maxLength > this.insertEmojiInput.value.length) ){
      this.insertEmojiInput.value = this.insertEmojiInput.value + emoji;
      this.insertEmojiInput.focus();
    }
  }

  setEmojiForm(element: InputEmojisComponent){
    this.emojiForm = element;
  }
}
