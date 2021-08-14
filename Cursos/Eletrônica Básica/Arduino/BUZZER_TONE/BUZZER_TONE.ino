int buzzPin = 8;
int delay1 = 1;
int delay2 = 2;
int i;

void setup() {
  // put your setup code here, to run once:
  pinMode(buzzPin,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  for(i=1;i<=100;i++){
    digitalWrite(buzzPin,HIGH);
    delay(delay1);
    digitalWrite(buzzPin,LOW);
    delay(delay1);
  }
  for(i=1;i<=100;i++){
    digitalWrite(buzzPin,HIGH);
    delay(delay2);
    digitalWrite(buzzPin,LOW);
    delay(delay2);   
  }
}
