int greenLED = 8;
int dit = 80;
int dah = 550;
int longWait = 1000;

void setup() {
  // put your setup code here, to run once:
  pinMode(greenLED,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(greenLED,HIGH);
  delay(dit);
  digitalWrite(greenLED,LOW);
  delay(dit);
  
  digitalWrite(greenLED,HIGH);
  delay(dit);
  digitalWrite(greenLED,LOW);
  delay(dit);

  digitalWrite(greenLED,HIGH);
  delay(dit);
  digitalWrite(greenLED,LOW);
  delay(dit);

  digitalWrite(greenLED,HIGH);
  delay(dah);
  digitalWrite(greenLED,LOW);
  delay(dah);
  
  digitalWrite(greenLED,HIGH);
  delay(dah);
  digitalWrite(greenLED,LOW);
  delay(dah);

  digitalWrite(greenLED,HIGH);
  delay(dah);
  digitalWrite(greenLED,LOW);
  delay(dah);

  digitalWrite(greenLED,HIGH);
  delay(dit);
  digitalWrite(greenLED,LOW);
  delay(dit);
  
  digitalWrite(greenLED,HIGH);
  delay(dit);
  digitalWrite(greenLED,LOW);
  delay(dit);

  digitalWrite(greenLED,HIGH);
  delay(dit);
  digitalWrite(greenLED,LOW);
  delay(dit);

  delay(longWait);
}
