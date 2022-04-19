import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ChatService} from "./shared/chat.service";
import {Observable, Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  nickNameForm = new FormControl('');
  messages: String[] = [];
  unsubscribe$ = new Subject();
  nickname: string | undefined;
  clients$: Observable<string[]> | undefined;
  constructor(private chatService: ChatService ) { }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    this.chatService.listenForMessages()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.messages.push(message)});
    this.chatService.getAllMessages()
      .pipe(take(1))
      .subscribe(messages => {
        this.messages = messages});
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
      this.nickname = this.nickNameForm.value;
      this.chatService.sendNickName(this.nickNameForm.value);
    }
  }
}
