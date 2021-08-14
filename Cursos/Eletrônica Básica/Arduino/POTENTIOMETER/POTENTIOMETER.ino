int VoltPin = A2;
int readVal;
int delayTime = 500;
float V2;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  readVal = analogRead(VoltPin);
  V2 = (5./1023.) * readVal;
  Serial.println(V2);
  delay(delayTime);
}
