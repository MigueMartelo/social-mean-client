import {Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { Follow } from '../../../models/follow';
import { User } from '../../../models/user';
import { GLOBAL } from '../../../services/global';
import { FollowService } from '../../../services/follow.service';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'sended',
	templateUrl: './sended.component.html',
	providers: [MessageService, FollowService, UserService]
})
export class SendedComponent implements OnInit{
	public title: string;	
	public idendity;
	public token;
	public url: string;
	public status: string;
	public messages: Message[];
	public page;
	public pages;
	public total;
	public next_page;
	public prev_page;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _followService: FollowService,
		private _messageService: MessageService,
		private _userService: UserService
	){
		this.title = 'Mensajes enviados';
		this.url = GLOBAL.url;		
		this.idendity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		console.log('El componente Sended se ha cargado!');
		this.actualPage();
	}

	actualPage(){
		this._route.params.subscribe(params => {
			let page = +params['page'];
			let user_id = params['id'];
			this.page = page;

			if(!params['page']){
				page = 1;
			}

			if(!page){
				page = 1;
			}else{
				this.next_page = page + 1;
				this.prev_page = page - 1;

				if(this.prev_page <= 0){
					this.prev_page = 1;
				}
			}

			// devolver listado de mensajes
			this.getMessages(this.token, this.page);

		});
	}

	getMessages(token, page){
		this._messageService.getEmmitMessages(token, page).subscribe(
			res => {
				if(res.messages){
					this.messages = res.messages;
					this.total = res.total;
					this.pages = res.pages;
				}
			},
			err => {
				console.log(<any>err);
			}
		);
	}
}