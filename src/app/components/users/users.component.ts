import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'users',
	templateUrl: './users.component.html',
	providers: [UserService]
})
export class UsersComponent implements OnInit{
	public title: string;
	public url: string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;
	public status: string;
	public total;
	public pages;
	public users: User[];
	public follows;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Gente';
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		console.log("users.component ha sido cargado");
		this.actualPage();
	}

	actualPage(){
		this._route.params.subscribe(params => {
			let page = +params['page'];
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

			// devolver listado de usuarios
			this.getUsers(page);

		});
	}

	getUsers(page){
		this._userService.getUsers(page).subscribe(
			res => {
				if(!res.users){
					this.status = 'error';
				}else{
					this.total = res.total;
					this.users = res.users;
					this.pages = res.pages;
					this.follows = res.users_following;

					if(page > this.pages){
						this._router.navigate(['/gente', 1]);
					}
				}
			},
			err => {
				let errMessage = <any>err;
				console.log(errMessage);

				if(errMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	public followUserOver;
	mouseEnter(user_id){
		this.followUserOver = user_id;
	}

	mouseLeave(user_id){
		this.followUserOver = 0;		
	}
}