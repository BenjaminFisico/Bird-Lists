import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentClickService {

  constructor() { }

  formFocusOut(idForm: string, destroyFuncion: () => void){
    const handleFormGroupEvent = (event: Event) => {
      const target = event.target as any;
      if(target.form?.id != idForm && target.id != idForm && target.tagName != 'HTML'){
        destroyFuncion();
      }
    }
    return handleFormGroupEvent;
  }
}
