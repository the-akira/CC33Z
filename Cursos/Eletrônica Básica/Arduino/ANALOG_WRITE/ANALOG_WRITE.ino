int redPin = 9; // PIN Analógico (~)
int bright = 255; // Analógico = 0-255 | 0V-5V

void setup() {
  // put your setup code here, to run once:
  pinMode(redPin,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  analogWrite(redPin, bright);
}
