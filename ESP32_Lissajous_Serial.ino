#define PI 3.14159265
int connect = 1;
const int ledPin = LED_BUILTIN;  
String result ;
int ledState = HIGH; 
float f1 = .1;
float f2 = .4;
float p1 = 30.0;
float p2 = 0.0;
float sr = 20.0;
float ph1;
float ph2;
unsigned long previousMillis = 0;  // will store last time LED was updated
int countUp = 0; 
float deltaT = 1/sr*1000;  // interval at which to blink (milliseconds)
float T;

void setup(){
      Serial.begin(230400);
  pinMode(ledPin, OUTPUT);
  delay(1000);
  digitalWrite(ledPin, ledState);
}

void loop() {
  if (Serial.available() > 0) {
    String request = Serial.readStringUntil('\n');
    if (request.startsWith("setSR:")) {
      sr = request.substring(6).toFloat();
      deltaT = 1/sr*1000; 
    }
    if (request.startsWith("setF1:")) {
      f1 = request.substring(6).toFloat();
    }
    if (request.startsWith("setF2:")) {
      f2 = request.substring(6).toFloat();
    }
    if (request.startsWith("setP1:")) {
      p1 = request.substring(6).toFloat();
    }
    if (request.startsWith("setP2:")) {
      p2 = request.substring(6).toFloat();
    }
  }
  if (millis() - previousMillis >= deltaT && connect == 1) {
    ledState = !ledState;
    countUp++;
    T = countUp*deltaT /1000.0;
    ph1 = PI/180.0*p1;
    ph2 = PI/180.0*p2;
    result = String(countUp) + " " + String(sin(2*PI*f1*T +ph1)) + " " + String(sin(2*PI*f2*T+ph2))+ " " + String(millis());
    Serial.println(result);
    digitalWrite(ledPin, ledState);
    previousMillis = millis();
  }
  
}
