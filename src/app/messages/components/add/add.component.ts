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
	selector: 'add',
	templateUrl: './add.component.html',
	providers: [MessageService, FollowService, UserService]
})
export class AddComponent implements OnInit{
	public title: string;
	public message: Message;
	public idendity;
	public token;
	public url: string;
	public status: string;
	public follows;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _followService: FollowService,
		private _messageService: MessageService,
		private _userService: UserService
	){
		this.title = 'Enviar mensaje';
		this.url = GLOBAL.url;		
		this.idendity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.message = new Message('', '', '', '', this.idendity._id, '');
	}

	ngOnInit(){
		console.log('El componente Add se ha cargado!');
		this.getMyFollows();
	}

	onSubmit(form){		
		this._messageService.addMessage(this.token, this.message).subscribe(
			res => {
				if(res.message){
					this.status = 'success';
					form.reset();
				}
			},
			err => {
				this.status = 'error';
				console.log(<any>err);
			}
		);
	}

	getMyFollows(){
		this._followService.getMyFollows(this.token).subscribe(
			res => {
				this.follows = res.follows;
			},
			err => {
				console.log(<any>err);
			}
		);
	}
}