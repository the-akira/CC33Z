int potVal;
int delayTime = 100;
int potPin = A0;
int redPin = 7;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(potPin,INPUT);
  pinMode(redPin,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  potVal = analogRead(potPin);
  Serial.println(potVal);
  delay(delayTime);

  while(potVal > 1000){
    digitalWrite(redPin,HIGH);
    potVal = analogRead(potPin);
    Serial.println(potVal);
    delay(delayTime);
  }
  digitalWrite(redPin,LOW);
}
