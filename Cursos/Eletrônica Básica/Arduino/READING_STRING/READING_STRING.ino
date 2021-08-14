String name;
String msg = "Digite o seu nome: ";
String msg2 = "Olá ";
String msg3 = "Bem-vindo ao Arduino!";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(msg);
  while(Serial.available() == 0) {
    
  }
  name = Serial.readString();
  Serial.print(msg2);
  Serial.print(name);
  Serial.println(msg3);
}
