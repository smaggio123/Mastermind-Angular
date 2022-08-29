import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'mastermindProject';
  
  public code = ""; //The code the user has to guess
  
  constructor(){
    //Generate code on load
    this.generateCode();
  }
  //-----------------------------
  //Affects look of input buttons
  //-----------------------------
  public listOfValues = ['R','G','Y','B','O','P'];
  public listOfColors = ["red","green","yellow","blue","orange","purple"]
  public listOfTextColors = ["white","white","black","white","black","white"]
  
  //-----------------------------
  //The value of input buttons
  //-----------------------------
  public listOfInputBtnValues = [0,0,0,0];
  
  //-----------------------------
  //Affects the guesses
  //-----------------------------
  public displayList = ["none","none","none","none","none","none","none","none","none","none","none"];
  public guesses : number[][] = [ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ];
  public guessCount = 0;
  public gameOn = true;
  
  
  //-----------------------------
  //Affects the hints
  //-----------------------------
  public listOfHintColors = ["grey","white","red"];
  public hints : number[][] = [ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ];
  public displayListHint = ["none","none","none","none","none","none","none","none","none","none","none"];
  
  /**
   * Generates code
   */
  public generateCode(){
    this.code = "";
    for(let i=0;i<4;i++) {
        this.code += ""+ Math.round(Math.random()*5);
      }
  }

  /**
   * @param btnIDNum The index of the button in the array
   * @returns The value of the button
   */
  public getValue(btnIDNum:number){
    return this.listOfValues[this.listOfInputBtnValues[btnIDNum]];
  }
  /**
   * The color of the button depends on the values in the array
   * So by changing the value in the array, it changes the color
   * @param btnIDNum The index of the button in the array
   */
  public updateColor(btnIDNum:number){
    const expression = this.listOfValues[this.listOfInputBtnValues[btnIDNum]];
    this.listOfInputBtnValues[btnIDNum] = (this.listOfInputBtnValues[btnIDNum] + 1) % 6;
  }
  /**
   * 
   * @param btnIDNum The index of the button in the array
   * @returns The color of the button based on the value in the array
   */
  public getColor(btnIDNum:number){
    return this.listOfColors[this.listOfInputBtnValues[btnIDNum]];
  }

  /**
   * (click) event
   * Analyzes the values of the input buttons and determines whether the game should continue or not
   */
  public submit(){
    //If the game is still going on
    if(this.guessCount < 10 && this.gameOn) {
      let inputGuess = "";
      //Puts input in string for easier comparison between input and code
      for(let i = 0;i<4;i++){
        inputGuess+=this.listOfInputBtnValues[i];
      }
      //If the user guessed correctly
      if(inputGuess === this.code) {
          this.processGuess(inputGuess)
          //The game is over
          this.gameOn = false;
          alert("you win!!!")
      }
      else {
        //If the user is out of guesses
        if(this.guessCount==9) {
          let displayCode = "";
          //The code is a string of numbers, this will turn the code into a string of letters (corresponding to the available colors)
          for(let i = 0;i<4;i++){
            switch(this.code.charAt(i)){
              case '0':{
                displayCode+="R";
                break;
              }
              case '1':{
                displayCode+="G";
                break;
              }
              case '2':{
                displayCode+="Y";
                break;
              }
              case '3':{
                displayCode+="B";
                break;
              }
              case '4':{
                displayCode+="O";
                break;
              }
              case '5':{
                displayCode+="P";
                break;
              }
            }
          }
          alert("You lose! Answer was: "+displayCode);
          //The game is over
          this.gameOn = false;
          this.processGuess(inputGuess);
        }
        else {
          this.processGuess(inputGuess);
        }
      }
      this.updateList();
      this.guessCount++;
    }
  }
  /**
   * Shows last guess and hints at how close the guess is
   */
  public updateList(){
    for(let i=0;i<4;i++){
      this.guesses[this.guessCount][i]=this.listOfInputBtnValues[i];
      //Makes hint buttons visible
      this.displayListHint[this.guessCount]="inline";
      this.displayList[this.guessCount]="inline";
    }
  }
  /**
   * Test if user won, will end game if so
   * @param str The input guess
   */
   public processGuess(str:string){
    let correctPlace=0;
    let correctColor=0;
    //Keeps track of the total number of colors for input and code
    let guessColors = [0,0,0,0,0,0];
    let codeColors = [0,0,0,0,0,0];
    for(let i=0;i<4;i++){
      //If the colors don't match
      if((str.charAt(i)==this.code.charAt(i)) == false){
        guessColors[parseInt(str.charAt(i))]++;
        codeColors[parseInt(this.code.charAt(i))]++;
      }
      else{
        //If the color is in the correct position
        correctPlace++;
      }
    }
    for(let k=0;k<guessColors.length;k++){
      //Dealing with more than one of the same color
      while(guessColors[k]>0&&codeColors[k]>0){
        correctColor++;
        guessColors[k]--;
        codeColors[k]--;
      }
    }
    //Handles the 
    this.handleHint(correctPlace,correctColor);
   }

   /**
    * 
    * @param cp number of colors in correct position
    * @param cc number of colors in the code, not in correct position
    */
  public handleHint(cp:number,cc:number){
    let difference = 4-(cc+cp);
    let index=0;
    //If the input guessed any incorrect colors
    for(let d = 0; d<difference;d++){
      index++;
    }
    //If the input had any correct colors not in the correct position
    for(let i = 0; i<cc;i++){
      this.hints[this.guessCount][index]=1;
      index++;
    }
    //If the input had any correct colors, in the correct position
    for(let i = 0; i<cp;i++){
      this.hints[this.guessCount][index]=2;
      index++;
    }
  }
  
  //Resets values that makes the game work
  public reset(){
    this.generateCode();
    this.listOfInputBtnValues = [0,0,0,0];
    this.displayList = ["none","none","none","none","none","none","none","none","none","none","none"];
    this.guesses = [ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ];
    this.guessCount = 0;
    this.gameOn = true;
    this.hints = [ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ];
    this.displayListHint = ["none","none","none","none","none","none","none","none","none","none","none"];
  }

}
