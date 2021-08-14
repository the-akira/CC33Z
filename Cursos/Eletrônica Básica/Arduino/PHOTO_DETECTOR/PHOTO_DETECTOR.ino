int lightPin = A0;
int lightVal;
int delayTime = 250;

void setup() {
  // put your setup code here, to run once:
  pinMode(lightPin,INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  lightVal = analogRead(lightPin);
  Serial.println(lightVal);
  delay(delayTime);
}
