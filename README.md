# ESP32 Lissajous Serial 

This app plots and prints data sent by an ESP32 microcontroller. The ESP32 is programmed with the Arduino IDE software to communicate with client browsers in a bidirectional way using the serial port.

Specifically, the ESP32, version Dev Kit V1 shown below, is programmed with the ESP32_Lissajous_Serial.ino code to send two sinusoidal signals, with adjustable frequencies and phases, in columns separated by one space. In turn, the Web App plots these signals and their resulting Lissajous curve. The client browser also controls various parameters that can be changed on the ESP32 microcontroller.

This Web App can be easily modified to serve as the basis of a data acquisition system in projects where an ESP32, or any other microcontroller, feeds data into a computer by using the serial port.

## Usage

- This app requires the ESP32 microcontroller
- Clone the repository
- Program the ESP32 module with the ESP32_Lissajous_Serial.ino code using the Arduino IDE software.
- Connect a serial port cable between the computer and a source device.
- Open the file index.html with any web browser that supports the Web Serial API.
- Select 230400 baud and click the Connect button.

## Live Demo

https://ciiec.buap.mx/ESP32-Lissajous-Serial/

## Credits

- We use the Serial Web API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API).

## License

[MIT](LICENSE)
