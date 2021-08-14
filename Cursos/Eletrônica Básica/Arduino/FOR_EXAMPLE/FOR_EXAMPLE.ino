int i;
int delayTime = 500;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  for(i=1;i<=10;i++){
    Serial.println(i);
    delay(delayTime);
  }
  Serial.println();
}
