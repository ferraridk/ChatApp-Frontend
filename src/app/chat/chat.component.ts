import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {ChatService} from "./shared/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message = new FormControl('');
  constructor(private chatService: ChatService ) { }

  ngOnInit(): void {
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }
}
