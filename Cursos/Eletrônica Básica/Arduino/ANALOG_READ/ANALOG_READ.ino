int readPin = A3; // 0 = 0V | 1023 = 5V
int readVal;
float V2 = 0;
int delayTime = 700;

void setup() {
  // put your setup code here, to run once:
  pinMode(readPin,INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  readVal = analogRead(readPin);
  V2 = (5./1023.) * readVal;
  Serial.println(V2);
  delay(delayTime);
}
