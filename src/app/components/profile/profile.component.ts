import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'profile',
	templateUrl: 'profile.component.html',
	providers: [UserService, FollowService]
})

export class ProfileComponent implements OnInit{
	public title: string;
	public user: User;
	public status: string;
	public identity;
	public token;
	public stats;
	public followed;
	public following;
	public url;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService
	){
		this.title = 'Perfil';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.followed = false;
		this.following = false;
	}

	ngOnInit(){
		console.log('Profile component, cargado correctamente');
		this.loadPage();
	}

	loadPage(){
		this._route.params.subscribe(params => {
			let id = params['id'];
			this.getUser(id);
			this.getCounters(id);
		});
	}

	getUser(id){
		this._userService.getUser(id).subscribe(
			res => {
				console.log(res);
				if(res.user){
					this.user = res.user;	

					if(res.following && res.following._id){
						this.following = true;
					}else{
						this.following = false;
					}

					if(res.followed && res.followed._id){
						this.followed = true;
					}else{
						this.followed = false;
					}

				}else{
					this.status = 'error';
				}
			},
			err =>{
				console.log(<any>err);
				this._router.navigate(['/perfil', this.identity._id]);
			}
		);
	}

	getCounters(id){
		this._userService.getCounters(id).subscribe(
			res => {				
				this.stats = res;
			},
			err => {
				console.log(<any>err);
			}
		);
	}

	followUser(followed){
		let follow = new Follow('', this.identity._id, followed);

		this._followService.addFollow(this.token, follow).subscribe(
			res => {
				this.following = true;
			},
			err => {
				console.log(<any>err);
			}
		);
	}

	unfollowUser(followed){
		this._followService.deleteFollow(this.token, followed).subscribe(
			res => {
				this.following = false;
			},
			err => {
				console.log(<any>err);
			}
		);
	}

	public followUserOver;
	mouseEnter(user_id){
		this.followUserOver = user_id;
	}

	mouseLeave(){
		this.followUserOver = 0;
	}
}
