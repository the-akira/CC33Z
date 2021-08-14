int i;
int blinkTime = 500;
int numBlinks;
int redPin = 12;
String msg = "How many Blinks do you Want: ";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(redPin,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(msg);
  while(Serial.available() == 0){
    
  }
  numBlinks = Serial.parseInt();
  for(i=1;i<=numBlinks;i++){
     digitalWrite(redPin,HIGH);
     delay(blinkTime);
     digitalWrite(redPin,LOW);
     delay(blinkTime);
  }
}
