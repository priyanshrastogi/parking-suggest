#include <RFID.h>
#include <SPI.h>

#define SDA_DIO 10
#define RESET_DIO 9

RFID RC522(SDA_DIO, RESET_DIO); 

void setup() { 
  Serial.begin(9600);
  /* Enable the SPI interface */
  SPI.begin(); 
  /* Initialise the RFID reader */
  RC522.init();
}

void loop() {
  /* Has a card been detected? */
  if (RC522.isCard()) {
    /* If so then get its serial number */
    RC522.readCardSerial();
    for(int i=0;i<5;i++) {
    Serial.print(RC522.serNum[i],DEC);
    //Serial.print(RC522.serNum[i],HEX); //to print card detail in Hexa Decimal format
    }
    Serial.println();
  }
  delay(1000);
}
