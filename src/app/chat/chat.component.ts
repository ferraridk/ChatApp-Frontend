import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ChatService} from "./shared/chat.service";
import {Observable, Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";
import {ChatClient} from "./shared/chat-client.model";
import {ChatMessage} from "./shared/chat-message.model";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  nickNameForm = new FormControl('');
  messages: ChatMessage[] = [];
  unsubscribe$ = new Subject();
  clients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  constructor(private chatService: ChatService ) { }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    this.chatService.listenForMessages()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.messages.push(message)});
    this.chatService.connect();
  }

  ngOnDestroy(): void {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.chatService.disconnect();
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  sendNickName(): void {
    if (this.nickNameForm.value){
      this.chatService.listenForWelcome().pipe(takeUntil(this.unsubscribe$))
        .subscribe(welcome =>{
        this.messages = welcome.messages
          this.chatClient = welcome.client;
      });
      this.chatService.sendNickName(this.nickNameForm.value);
    }
  }
}
