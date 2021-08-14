int greenPin = 12;
int redPin = 11;
int yellowPin = 10;
String color = "red";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(redPin,OUTPUT);
  pinMode(greenPin,OUTPUT);
  pinMode(yellowPin,OUTPUT);
  Serial.print(color);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(color=="red"){
    digitalWrite(redPin,HIGH);
    digitalWrite(greenPin,LOW);
    digitalWrite(yellowPin,LOW);
  }
  if(color=="green"){
    digitalWrite(redPin,LOW);
    digitalWrite(greenPin,HIGH);
    digitalWrite(yellowPin,LOW);
  }
  if(color=="yellow"){
    digitalWrite(redPin,LOW);
    digitalWrite(greenPin,LOW);
    digitalWrite(yellowPin,HIGH);
  }
}
