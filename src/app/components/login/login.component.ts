import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [UserService]
})

export class LoginComponent implements OnInit{
  public title:string;
  public user:User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Identificate';
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit(){
    console.log('Componente de login cargado...');
  }

  onSubmit(){
      //Loguear al usuario y conseguir sus datos
      this._userService.signup(this.user).subscribe(
      res => {
        this.identity = res.user;
        console.log(this.identity);

        if(!this.identity || !this.identity._id){
            this.status = 'error';
        }else{            

            // PERSISITIR DATOS DEL USUARIO            
            localStorage.setItem('identity', JSON.stringify(this.identity));

            // Conseguir el token
            this.getToken();
        }        
      },
      err => {
        let erroMessage = <any>err;
        console.log(erroMessage);

        if(erroMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  getToken(){
      this._userService.signup(this.user, 'true').subscribe(
        res => {
          this.token = res.token;
          console.log(this.token);

          if(this.token.length <= 0){
              this.status = 'error';
          }else{           
              
              // PERSISITIR TOKEN DEL USUARIO
              localStorage.setItem('token', this.token);

              // Conseguir los contadores o estadísticas del usuario
              this.getCounters();
          }
        },
        err => {
          let erroMessage = <any>err;
          console.log(erroMessage);

          if(erroMessage != null){
            this.status = 'error';
          }
        }
      );
  }

  getCounters(){
    this._userService.getCounters().subscribe(
      res => {
        localStorage.setItem('stats', JSON.stringify(res));
        this.status = 'success';        
        this._router.navigate(['/']);
      },
      err => {
        console.log(<any>err);
      }
    );
  }
}
