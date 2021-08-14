int j = 0;
int waitTime = 750;
String str = "j = ";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.print(str);
  j++;
  Serial.println(j);
  delay(waitTime);
}
