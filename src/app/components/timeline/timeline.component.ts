import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
	selector: 'timeline',
	templateUrl: './timeline.component.html',
	providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit{
	public identity;
	public token;
	public title: string;
	public url: string;
	public status: string;
	public page;
	public total;
	public pages;
	public itemsPerPage;
	public noMore: boolean = false;
	public publications: Publication[];
	public showImage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService
	){
		this.title = 'Timeline';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.page = 1;
	}

	ngOnInit(){
		console.log('Componente TimeLine cargado');
		this.getPublications(this.page);
	}

	getPublications(page, adding = false){
		this._publicationService.getPublications(this.token, page).subscribe(
			res => {				
				if(res.publications){
					
					this.total = res.total_items;
					this.pages = res.pages;
					this.itemsPerPage = res.items_per_page;

					if(!adding){
						this.publications = res.publications;
					}else{
						let arrayA = this.publications;
						let arrayB = res.publications;
						this.publications = arrayA.concat(arrayB);

						$('html, body').animate({scrollTop: $('html').prop('scrollHeight')}, 500);
					}

					if(page > this.page){
						this._router.navigate(['/home']);
					}
				}else{
					this.status = 'error';
				}
			},
			err => {
				let errorMessage = <any>err;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	viewMore(){
		this.page += 1;

		if(this.page == this.pages){
			this.noMore = true;
		}

		this.getPublications(this.page, true);
	}

	refresh(event = null){
		this.getPublications(1);
	}

	showThisImage(id){
		this.showImage = id;
	}

	hideThisImage(id){
		this.showImage = 0;
	}

	deletePublication(id){
		this._publicationService.deletePublication(this.token, id).subscribe(
			res => {
				this.refresh();
			},
			err => {
				console.log(<any>err);
			}
		);
	}
}