import { fromEvent, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import chatStore from '../store/chat';

export const chatStream = chatStore;

export const validateInput$ = (inputElement, inputAuthorElement, buttonSubmitElement) => {
  buttonSubmitElement.disabled = true;
  const input$ = fromEvent(inputElement, "input");
  const inputAuthor$ = fromEvent(inputAuthorElement,"input");
  return combineLatest(input$, inputAuthor$).pipe(
    map(([input, authorInput]) => {
      const text = input.target.value;
      const textAuthor = authorInput.target.value;
      if(text === "" || textAuthor === ""){
        buttonSubmitElement.disabled = true
      } else {
        buttonSubmitElement.disabled = false
      }
    })
  )
};
