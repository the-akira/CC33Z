byte Byte = 0;
int delayTime = 500;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(Byte,HEX);
  Byte++;
  delay(delayTime);
}
