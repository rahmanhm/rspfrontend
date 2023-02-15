import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RSP (Rock Scissors Paper)';
  userScore = 0;
  computerScore=0;

  authIn: boolean=true;
  haveSomeFun: boolean=false;
  manuelGame:boolean=false;
  callManu:boolean=true;
  displayResult:boolean=false;
  quit:boolean=true;

  userChoice: string='';
  result: string='';
  passPhrase:string='';
  errorMessage:string='';
  gameMode:string='';
  cssClass:string='';
  cssBgUser:string='';
  cssBgComputer:string='';

  autoplay(mode:string):void{
    this.gameMode=mode;
    if (this.gameMode=='auto'){
      fetch('http://localhost:8080/autoplay', {
        method: 'POST',
        body: JSON.stringify({
          choice: this.gameMode
          }),
          headers:{
            'Content-Type':'application/json'
          }
      })
      .then(response => response.json())
        .then(data => {
           this.result = data.result;
           this.displayResult=true;
           if(this.result==="\*\**Human has won the Game*\**"){
             this.cssClass='alert-success'
           }else if(this.result==="*\**Computer has won the Game*\**"){
               this.cssClass='alert-warning';
           }else{
              this.cssClass='alert-info';
           }
        });
    }else {
      this.manuelGame = true;
      this.displayResult =  false;
      this.haveSomeFun = false;
    }
   }

  getPassphrase(event:any): void {
     this.passPhrase = event.target.value;
  }

  submitPassphrase(): void {
    fetch('http://localhost:8080/verify', {
      method: 'POST',
      body: JSON.stringify({
        passPhrase: this.passPhrase
      }),
       headers:{
          'Content-Type':'application/json'
       }
    })
    .then(response => {
      if(response.ok){
        return response.json();
      }else {
        throw Error("Backend Server is not Running!");
       }
      })
    .then(data => {
      if (data.result === 'success') {
        // Start the game
        console.log(data.result);
        this.errorMessage='';
        this.authIn=false;
        this.haveSomeFun=true;
      } else {
        // Show an error message
        this.errorMessage='Passphrase is incorrect.';
        this.haveSomeFun=false;
      }
    })
    .catch(error=> {
      console.log(error);
      this.errorMessage="No Vitals on Backend Server found! Please make sure the Server is Running!";
    });
  }

    submitChoice(tool: string): void {
      this.userChoice = tool;
      // Send the userChoice to the backend
      fetch('http://localhost:8080/play', {
        method: 'POST',
        body: JSON.stringify({
          tool: this.userChoice
        }),
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        this.result = data.result;
        this.displayResult=true;
         if (this.result === 'User') {
            this.userScore++;
            this.result="Human is Victorious!";
            this.cssClass='alert-success'
            this.cssBgUser='bg-warning';
            this.cssBgComputer='';
         } else if (this.result === 'Computer') {
              this.computerScore++;
              this.result="Computer has the Victory! ";
              this.cssClass='alert-warning';
         }else{
              this.result="It's a Draw. Please Try Again!";
              this.cssClass='alert-info'
         }
         if(this.computerScore===this.userScore){
             this.cssBgComputer='';
             this.cssBgUser='';
         }else if(this.computerScore>this.userScore){
             this.cssBgComputer='bg-success';
             this.cssBgUser='';
         }else{
               this.cssBgUser='bg-success';
               this.cssBgComputer='';
         }
      });
    }
    logout(): void {
      this.quit = false;
      this.haveSomeFun = false;
      this.manuelGame = false;
      this.displayResult =  false;
      this.authIn=true;
    }
}// end of class
