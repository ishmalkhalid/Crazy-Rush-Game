//define canvas
let canvas;

//set image variables
let road, myCar, ycar, pcar, gcar, bcar, truck, coin;

//set background speed
let bgSpeed = 4;
let bgY = 0;
let bgY2 = -500;

//my car
let myCarX = 170;
let myCarY = 330;
let myCarWidth = 60;
let myCarHeight = 100;
let myCarSpeed = 4;

//traffic
let traffic, rtraffic = []

//coin x
let coinX = [26, 122, 215, 314]

//score
let score = 0;
let highscore = 0;
let coins = 0;

//sounds
let bgSound, coinCollect, carCrash;

//game states
let start = false;
let easyMode;
let pause = false;

//preload functiom
function preload() {

	//load images
	road = loadImage("media/street.png");
	myCar = loadImage("media/red-car.png");
	ycar = loadImage("media/yellow-car.png");
	pcar = loadImage("media/pink-car.png");
	gcar = loadImage("media/green-car.png");
	bcar = loadImage("media/blue-car.png");
	truck = loadImage("media/truck.png");
	bcoin = loadImage("media/coin.gif");
	yrcar = loadImage("media/reverse-yellow-car.png");
	prcar = loadImage("media/reverse-pink-car.png");
	grcar = loadImage("media/reverse-green-car.png");
	brcar = loadImage("media/reverse-blue-car.png");
	rtruck = loadImage("media/reverse-truck.png");

	//load sounds
	// bgSound = loadSound("media/bg.wav");
	coinCollect = loadSound("media/coin.wav");
	carCrash = loadSound("media/car-crash.wav");
}

function setup() {
	// set the background size of our canvas
	canvas = createCanvas(400, 500);

	// set the ID on the canvas element
	canvas.id("my_p5_canvas_element");

	// set the parent of the canvas element to the element in the DOM with an id of #center
	canvas.parent("#center");

	//set arrays of cars
	traffic = [ycar, pcar, gcar, bcar, truck];
	rtraffic = [yrcar, prcar, grcar, brcar, rtruck];

	// declare car and coin objects
	car1 = new Car(+1, 26, 700);
	car2 = new Car(+1, 122, 700);
	car3 = new Car(-1, 215, -300);
	car4 = new Car(-1, 314, -300);
	
	coin = new Coin();

	//local storage
	let hs = window.localStorage.getItem('highscore');

	// if hs value is not null use this as a highscore value
	if (hs) {
		highscore = hs;
	}


}

function draw() {

	background(128);

	//background sound
	// bgSound.play();

	//road background
	image(road, 0, bgY, 400, 500);
	image(road, 0, bgY2, 400, 500);

	// text(myCarX, myCadrX + 10, myCarY + 10);
	
	if (start == true && pause == false) {

		//display user car
		image(myCar, myCarX, myCarY, myCarWidth, myCarHeight);

		//scroll background
		bgY += bgSpeed;
		bgY2 += bgSpeed;

		if (bgY >= 500) {
			bgY = bgY2 - 500;
		}

		if (bgY2 >= 500) {
			bgY2 = bgY - 500;
		}

		//move the car up using W
		if (keyIsDown(87) && myCarY >= 0) {
			myCarY -= myCarSpeed;
		}

		//move the car left using A
		if (keyIsDown(65) && myCarX >= 0) {
			myCarX -= myCarSpeed;
		}

		//move the car down using S
		if (keyIsDown(83) && myCarY <= 500 - myCarHeight) {
			myCarY += myCarSpeed;
		}

		//move the car right using D
		if (keyIsDown(68) && myCarX <= 400 - myCarWidth) {
			myCarX += myCarSpeed;
		}

		//display same way traffic after 100 frames
		if (frameCount >= 100) {
			//display cars
			car1.display()
			car2.display()
			car1.move()
			car2.move()
		}

		//display incoming traffic after 300 frames
		if (frameCount >= 300) {
			car3.display()
			car4.display()
			car3.move()
			car4.move()
		}

		//display coins
		coin.display();
		coin.move();
		
		//detect collision with cars
		if (checkCollision(car1.x, car1.y, car1.width, car1.height) == true
			|| checkCollision(car2.x, car2.y, car2.width, car2.height) == true
			|| checkCollision(car3.x, car3.y, car3.width, car3.height) == true
			|| checkCollision(car4.x, car4.y, car4.width, car4.height) == true){
			text("GAME OVER!", 200, 200);
			// setVolume(0.25, 2)
			carCrash.play();
			start = false;

		}

		//detect collision with coins
		if (checkCollision(coin.x, coin.y, 80, 80) == true 
			|| coin.y > 570){

			if (checkCollision(coin.x, coin.y, 80, 80) == true){
				coins += 1;
				score += 100;
				coinCollect.play();
			}
			coin.x = random(coinX);
			coin.y = random(-120, 0);
		}


		//display points
		fill(255);
		textSize(16);
		text("Score: " + score, 15, 15);
		text("Coins: " + coins, 15, 35);
		text("Highscore: " + highscore, 265, 15);

		// increment score but get more points for driving on the wrong way
		if (myCarX > 200) {
			score += round(getFrameRate()/20);
			//set highscore
			if (score >= highscore){
				highscore = score;
			}
			// console.log(getFrameRate())

		}
		else {
			score += ceil(round(getFrameRate()/60)/20);
			if (score >= highscore){
				highscore = score;
			}
			// console.log(getFrameRate())

		}
	}

	//if game is in pause mode
	else if (pause == true && start == false) {
		//display user car
		image(myCar, myCarX, myCarY, myCarWidth, myCarHeight);


		//display coins
		coin.display();

		//display cars

		//display paused cars
		if (frameCount >= 100) {
			//display cars
			car1.display()
			car2.display()
		}

		if (frameCount >= 300) {
			car3.display()
			car4.display()

		}

		//display points
		fill(255);
		textSize(16);
		text("Score: " + score, 15, 15);
		text("Coins: " + coins, 15, 35);
		text("Highscore: " + highscore, 285, 15);

	}

	//if game has not been started
	else if (start == false && pause == false) {
		//display player car
		image(myCar, 170, 360, myCarWidth, myCarHeight);

		//display the menu screen
		fill(255, 204, 102);
		textSize(35);
		textStyle(BOLDITALIC);
		textWrap(WORD);
		text("CRAZY RUSH", 80, 120);
		fill(153, 0, 51);
		textSize(26);
		
		text("Score: " + score, 130, 220);
		text("High Score: " + highscore, 100, 245);

		//save highscore
		window.localStorage.setItem('highscore', highscore);

		//display easy and hard options
		strokeWeight(2);
		fill(0, 153, 204);
		rect(150, 300, 100, 35);
		rect(150, 340, 100, 35);

		fill(0);
		textSize(18);
		text("Easy", 180, 322);
		text("Hard", 180, 362);

	}
	
}

// class car traffic
class Car {

	//initiate a car
	constructor (pOn, x, y){
		this.x = x;
		this.y = y;
		this.pOn = pOn;
		this.width = 60;
		this.height = 100;

		//set less speed for easy mode traffic cars
		if (easyMode == true)
		{
			if (pOn == +1) {
				this.graphic = random(traffic);
				this.speed = random() * this.pOn;
			}
			else {
				this.graphic = random(rtraffic);
				this.speed = random(1, 2) * this.pOn;
			}
		}
		//set more speed for hard mode
		else 

		{
			if (pOn == +1) {
				this.graphic = random(traffic);
				this.speed = random(1, 3) * this.pOn;
			}
			else {
				this.graphic = random(rtraffic);
				this.speed = random(3, 5) * this.pOn;
			}
		}
		
	}
	//display the cars
	display () {
		image(this.graphic, this.x, this.y, this.width, this.height);
	}

	//move the cars
	move () {

		this.y -= this.speed;

		//cars appear on the screen after longer intervals in easy mode
		//cars have less speed in easy mode
		if (easyMode == true)
		{
			if (this.y < -200){
				this.y = 650;
				this.graphic = random(traffic);
				this.speed = random() * this.pOn;
			}

			else if (this.y > 650){
				this.y = -200;
				this.graphic = random(rtraffic);
				this.speed = random(1, 2) * this.pOn;
			}
		}
		//cars appear on the screen after shorter intervals in hard mode
		//cars have more speed in hard mode
		else
		{
			if (this.y < -130){
				this.y = 500;
				this.graphic = random(traffic);
				this.speed = random(1, 3) * this.pOn;
			}

			else if (this.y > 550){
				this.y = -110;
				this.graphic = random(rtraffic);
				this.speed = random(3, 5) * this.pOn;
			}
		}

	}

}

//coin class
class Coin {

	//generate coin
	constructor() {
		this.x = random(coinX);
		this.y = random(10, 450);
		this.speed = 1;

	}
	//display coins
	display() {
		image(bcoin, this.x, this.y, 80, 80);
	}
	//move coins
	move () {
		this.y += this.speed;
	}

}

// generic function to compute when collision happens
function checkCollision(x, y, w, h) {
	// rectangle 1 is to the left of rectangle #2
	if (x + w < myCarX) {
		console.log("LEFT");
		return false;
	}
	// rectangle 1 is to the right of rectangle #2
	if (x > myCarX + myCarWidth) {
		console.log("RIGHT");
		return false;
	}
	// rectangle 1 is above rectangle #2
	if (y + h < myCarY) {
		console.log("ABOVE");
		return false;
	}
	// rectangle 1 is below rectangle #2
	if (y > myCarY + myCarHeight) {
		console.log("BELOW");
		return false;
	}

	// collision occurred
	return true;
}

//choose mode to start the game
function mousePressed() {

	//set easy mode
	if (start == false 
	&& mouseX >= 150
	&& mouseX <= 250
	&& mouseY >= 300
	&& mouseY <= 335) 
	{	
		//reset variables
		easyMode = true;
		myCarX = 170;
		myCarY = 330;
		bgSpeed = 3;
		score = 0
		start = true;
		car1 = new Car(+1, 26, 700);
		car2 = new Car(+1, 122, 700);
		car3 = new Car(-1, 215, -300);
		car4 = new Car(-1, 314, -300);
	}

	//set hard mode
	if (start == false 
	&& mouseX >= 150
	&& mouseX <= 250
	&& mouseY >= 340
	&& mouseY <= 375) 
	{

		//reset variables
		easyMode = false;
		myCarX = 170;
		myCarY = 330;
		bgSpeed = 5;
		score = 0;
		start = true;
		car1 = new Car(+1, 26, 700);
		car2 = new Car(+1, 122, 700);
		car3 = new Car(-1, 215, -300);
		car4 = new Car(-1, 314, -300);
	}
}

//function to pause game
function pauseGame() {
	pause = true;
	start = false;
}

//function to resume game
function resumeGame() {
	pause = false;
	start = true;
}

//function to restart game
function restartGame() {
	start = false;
}