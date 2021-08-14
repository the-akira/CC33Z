int yellowPin = 6;
int redPin = 9;
int yellowTime = 500;
int redTime = 500;
int yellowBlink = 3;
int redBlink = 5;
int i;

void setup() {
  // put your setup code here, to run once:
  pinMode(yellowPin,OUTPUT);
  pinMode(redPin,OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  for (i=1;i<=yellowBlink;i++){
    digitalWrite(yellowPin,HIGH);
    delay(yellowTime);
    digitalWrite(yellowPin,LOW);
    delay(yellowTime);
  }

  for (i=1; i<=redBlink;i++){
    digitalWrite(redPin,HIGH);
    delay(redTime);
    digitalWrite(redPin,LOW);
    delay(redTime);
  }
}
