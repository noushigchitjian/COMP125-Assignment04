(function(){
    // Function scoped Variables
    let stage: createjs.Stage;
    let assets: createjs.LoadQueue;
    let slotMachineBackground: Core.GameObject;
    let spinButton: UIObjects.Button;
    let bet1Button: UIObjects.Button;
    let bet10Button: UIObjects.Button;
    let bet100Button: UIObjects.Button;
    let betMaxButton: UIObjects.Button;
    let jackPotLabel: UIObjects.Label;
    let creditLabel: UIObjects.Label;
    let winningsLabel: UIObjects.Label;
    let betLabel: UIObjects.Label;
    let leftReel: Core.GameObject;
    let middleReel: Core.GameObject;
    let rightReel: Core.GameObject;
    let betLine: Core.GameObject;

    // symbol tallies
    let grapes = 0;
    let bananas = 0;
    let oranges = 0;
    let cherries = 0;
    let bars = 0;
    let bells = 0;
    let sevens = 0;
    let blanks = 0;

    let manifest: Core.Item[] = [
        {id:"background", src:"./Assets/images/background.png"},
        {id:"banana", src:"./Assets/images/banana.gif"},
        {id:"bar", src:"./Assets/images/bar.gif"},
        {id:"bell", src:"./Assets/images/bell.gif"},
        {id:"bet_line", src:"./Assets/images/bet_line.gif"},
        {id:"bet1Button", src:"./Assets/images/bet1Button.png"},
        {id:"bet10Button", src:"./Assets/images/bet10Button.png"},
        {id:"bet100Button", src:"./Assets/images/bet100Button.png"},
        {id:"betMaxButton", src:"./Assets/images/betMaxButton.png"},
        {id:"blank", src:"./Assets/images/blank.gif"},
        {id:"cherry", src:"./Assets/images/cherry.gif"},
        {id:"grapes", src:"./Assets/images/grapes.gif"},
        {id:"orange", src:"./Assets/images/orange.gif"},
        {id:"seven", src:"./Assets/images/seven.gif"},
        {id:"spinButton", src:"./Assets/images/spinButton.png"},
    ];   

    // This function triggers first and "Preloads" all the assets
    function Preload()
    {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", Start);

        assets.loadManifest(manifest);
    }

    // This function triggers after everything has been preloaded
    // This function is used for config and initialization
    function Start():void
    {
        console.log("App Started...");
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        stage = new createjs.Stage(canvas);
        createjs.Ticker.framerate = 60; // 60 FPS or 16.667 ms
        createjs.Ticker.on("tick", Update);

        stage.enableMouseOver(20);

        Config.Globals.AssetManifest = assets;

        Main();
    }

    // called every frame
    function Update():void
    {
        stage.update();
    }

    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value:number, lowerBounds:number, upperBounds:number):number | boolean {
        if (value >= lowerBounds && value <= upperBounds)
        {
            return value;
        }
        else {
            return !value;
        }
    }

    /* When this function is called it determines the betLine results.
    e.g. Bar - Orange - Banana */
    function Reels():string[] {
        var betLine = [" ", " ", " "];
        var outCome = [0, 0, 0];

        for (var spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 65) + 1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37): // 15.4% probability
                    betLine[spin] = "grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46): // 13.8% probability
                    betLine[spin] = "banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54): // 12.3% probability
                    betLine[spin] = "orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59): //  7.7% probability
                    betLine[spin] = "cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62): //  4.6% probability
                    betLine[spin] = "bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64): //  3.1% probability
                    betLine[spin] = "bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65): //  1.5% probability
                    betLine[spin] = "seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }

    function buildInterface():void
    {
        // Slot Machine Background
        slotMachineBackground = new Core.GameObject("background", Config.Screen.CENTER_X, Config.Screen.CENTER_Y, true );
        stage.addChild(slotMachineBackground);

        // Buttons
        spinButton = new UIObjects.Button("spinButton", Config.Screen.CENTER_X + 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(spinButton);

        bet1Button = new UIObjects.Button("bet1Button", Config.Screen.CENTER_X - 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet1Button);

        bet10Button = new UIObjects.Button("bet10Button", Config.Screen.CENTER_X - 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet10Button);

        bet100Button = new UIObjects.Button("bet100Button", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet100Button);

        betMaxButton = new UIObjects.Button("betMaxButton", Config.Screen.CENTER_X + 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(betMaxButton);

        // Labels
        jackPotLabel = new UIObjects.Label("10000000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 175, true);
        stage.addChild(jackPotLabel);

        creditLabel = new UIObjects.Label("00050000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X - 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(creditLabel);

        winningsLabel = new UIObjects.Label("00000000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X + 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(winningsLabel);

        betLabel = new UIObjects.Label("0000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(betLabel);

        // Reel GameObjects
        leftReel = new Core.GameObject("bell", Config.Screen.CENTER_X - 79, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(leftReel);

        middleReel = new Core.GameObject("banana", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(middleReel);

        rightReel = new Core.GameObject("bar", Config.Screen.CENTER_X + 78, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(rightReel);

        // Bet Line
        betLine = new Core.GameObject("bet_line", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(betLine);
    }

    function interfaceLogic():void
    {
        spinButton.on("click", ()=>
        {
            if(creditLabel.text == "0")
            {   //this will tell the player that he /she does'nt have enough money and will ask the player if he/she wants to continue to play
                if(confirm(`No Enough Money\n would You Like To Continue Playing?`))
                Main();
            }
            else if(Number(betLabel.text) > Number(creditLabel.text))
            {   //this will inform the player that he/she does'nt have enough money to to bet
                alert(`There is Not Enough Money To Bet`);
                Main();
            }
                //this will let the player to continue playing because he/she has enough Money
            else if(Number(betLabel.text) <= Number(creditLabel.text))
            {   

            // reel test
            let reels = Reels();

            // example of how to replace the images in the reels
            leftReel.image = assets.getResult(reels[0]) as HTMLImageElement;
            middleReel.image = assets.getResult(reels[1]) as HTMLImageElement;
            rightReel.image = assets.getResult(reels[2]) as HTMLImageElement;
            Winnings();                   
            }})

              
            

        bet1Button.on("click", ()=>
        {
            console.log("bet1Button Clicked");
            betLabel.setText((Number(betLabel.text)+1).toString());
        });

        bet10Button.on("click", ()=>
        {
            console.log("bet10Button Clicked");
            betLabel.setText((Number(betLabel.text)+10).toString());
        });

        bet100Button.on("click", ()=>
        {
            console.log("bet100Button Clicked");
            betLabel.setText((Number(betLabel.text)+100).toString());
        });

        betMaxButton.on("click", ()=>
        {
            console.log("betMaxButton Clicked");
            betLabel.setText(Number(creditLabel.text).toString());
        });
    }
    
    
    function Winnings()
    {
        let reels = Reels();

            let grapesC = 0;
            let bananasC = 0;
            let orangesC = 0;
            let cherriesC = 0;
            let barsC = 0;
            let bellsC = 0;
            let sevensC = 0;
            let blanksC = 0;


                for(let i=0;i<reels.length;i++)
                {                     
                    if(reels[i]=="grape")
                    grapesC++;
                    if(reels[i]=="banana")
                    bananasC++;
                    if(reels[i]=="orange")
                    orangesC++;
                    if(reels[i]=="cherry")
                    cherriesC++;
                    if(reels[i]=="bar")
                    barsC++;
                    if(reels[i]=="bell")
                    bellsC++;
                    if(reels[i]=="seven")
                    sevensC++;
                    if(reels[i]=="blank")
                    blanksC++;                    
                }  
                
                console.log(`The number of {grape, banana, orange, cherrie, bar, bell, seven, blank \n +
                    ${grapesC},${bananasC},${orangesC},${cherriesC},${barsC},${bellsC},${sevensC},${blanksC}`)

                
                    if(blanksC == 0){
                        if (sevensC==1){
                            winningsLabel.setText((Number(betLabel.text)*15).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        }
                        else if(grapesC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*3).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(bananasC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*6).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(orangesC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*9).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(cherriesC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*12).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(barsC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*15).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(bellsC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*20).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        }
                        else if(sevensC==2)
                        {
                            winningsLabel.setText((Number(betLabel.text)*30).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(grapesC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*10).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
         
                        } 
                        else if(bananasC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*20).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(orangesC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*30).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(cherriesC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*40).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(barsC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*50).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(bellsC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*75).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                        } 
                        else if(sevensC==3)
                        {
                            winningsLabel.setText((Number(betLabel.text)*100).toString());
                            creditLabel.setText((Number(creditLabel.text)+Number(winningsLabel.text)).toString());
                            confirm(`You Won The Jackpot! \n+
                             Your JACKPOT Total win is : ${jackPotLabel.text} and Your WINNING Total is : ${winningsLabel.text}}`)
                        }
                    }
                else{
                    creditLabel.setText((Number(creditLabel.text)-Number(betLabel.text)).toString());
                }
            }
        })    
                                                             
                                        
                                       
            

        bet1Button.on("click", ()=>{
            console.log("bet1Button Button Clicked");
        });

        bet10Button.on("click", ()=>{
            console.log("bet10Button Button Clicked");
        });

        bet100Button.on("click", ()=>{
            console.log("bet100Button Button Clicked");
        });

        betMaxButton.on("click", ()=>{
            console.log("betMaxButton Button Clicked");
        });
    }

    // app logic goes here
    function Main():void
    {
        buildInterface();

        interfaceLogic();       
    }

    window.addEventListener("load", Preload);
})();