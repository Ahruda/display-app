// Como convenção os 6 displays são numerados de 0 a 5
// do menos significativo (0) para o mais significativo (5)

#include <WiFi.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include "ESPAsyncWebServer.h"
#include "AsyncJson.h"

// ---------------------------------------- Variaveis globais

// Configurações de rede
/*
const char *ssid = "IFPCS_Container";
const char *password = "containerIfPocos2018";

const char *ssid = "AP 22 2.4G";
const char *password = "galbiere";
*/

const char *ssid = "GALBIERE";
const char *password = "26106201";

// Pinos do display de 7 segmentos
const int pin_a = 33;
const int pin_b = 32;
const int pin_c = 4;
const int pin_d = 2;
const int pin_e = 15;
const int pin_f = 25;
const int pin_g = 26;

// Pinos de ativação dos displays
const int pin_displays[6] = {23, 22, 3, 21, 17, 16};

// Variaveis de controle
const int tempo_debounce = 100;
const int pin_entrada_sensor = 13;
const int pin_led_estado_sensor = 18;
int tempo_delay = 100;
int estado_display = 0; // Ligado ou desligado
int funcao = 0;
int estado_multiplexacao = 0;

unsigned long timestamp_ultimo_acionamento = 0;
int tempo_inicial = 0;


int vetorNumeros[6] = {1, 2, 3, 4, 5, 6};

AsyncWebServer server(80);

void escreverNumero(int numero)
{

    switch (numero)
    {

    case 0:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, HIGH);
        digitalWrite(pin_f, HIGH);
        digitalWrite(pin_g, LOW);
        break;

    case 1:
        digitalWrite(pin_a, LOW);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, LOW);
        digitalWrite(pin_e, LOW);
        digitalWrite(pin_f, LOW);
        digitalWrite(pin_g, LOW);
        break;
    case 2:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, LOW);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, HIGH);
        digitalWrite(pin_f, LOW);
        digitalWrite(pin_g, HIGH);
        break;
    case 3:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, LOW);
        digitalWrite(pin_f, LOW);
        digitalWrite(pin_g, HIGH);
        break;
    case 4:
        digitalWrite(pin_a, LOW);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, LOW);
        digitalWrite(pin_e, LOW);
        digitalWrite(pin_f, HIGH);
        digitalWrite(pin_g, HIGH);
        break;
    case 5:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, LOW);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, LOW);
        digitalWrite(pin_f, HIGH);
        digitalWrite(pin_g, HIGH);
        break;
    case 6:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, LOW);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, HIGH);
        digitalWrite(pin_f, HIGH);
        digitalWrite(pin_g, HIGH);
        break;
    case 7:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, LOW);
        digitalWrite(pin_e, LOW);
        digitalWrite(pin_f, LOW);
        digitalWrite(pin_g, LOW);
        break;
    case 8:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, HIGH);
        digitalWrite(pin_f, HIGH);
        digitalWrite(pin_g, HIGH);
        break;
    case 9:
        digitalWrite(pin_a, HIGH);
        digitalWrite(pin_b, HIGH);
        digitalWrite(pin_c, HIGH);
        digitalWrite(pin_d, HIGH);
        digitalWrite(pin_e, LOW);
        digitalWrite(pin_f, HIGH);
        digitalWrite(pin_g, HIGH);
        break;

    default:
        break;
    }
}

void apagarDisplay() {
    
    for (int i = 0; i < 6; i++) {
        digitalWrite(pin_displays[i], HIGH);
    }
}

void separarNumeroComposto(int numero)
{
    for (int i = 0; i < 6; i++)
    {
        vetorNumeros[i] = numero % 10;
        numero /= 10;
    }
}

void multiplexarDisplay() {
/**
 * Essa função controla a multiplexação do display
 *
 * Enquanto a variavel estado_multiplexacao é 1, o while ficará ativo 
 */

    apagarDisplay();
 
    for (int i = 0; i < 6; i++) {
        digitalWrite(pin_displays[i], LOW);
        escreverNumero(vetorNumeros[i]);
        delayMicroseconds(tempo_delay);
        digitalWrite(pin_displays[i], HIGH);
    }

}

void standbyDisplay() {

    int tempo = 0;

    for (int i = 0; i < 6; i++) {
        vetorNumeros[i] = 8;
    }

    while(estado_display == 0) {
        tempo = millis() + 1000;

        while(tempo > millis()) {
            multiplexarDisplay();
        }
        
        apagarDisplay();
        tempo = millis() + 1000;

        while(tempo > millis()) {
        }
        
    }

}

void IRAM_ATTR contador()
{
    Serial.println(timestamp_ultimo_acionamento - tempo_inicial);
    if (tempo_inicial == 0)
    {
        tempo_inicial = millis();
        digitalWrite(pin_led_estado_sensor, HIGH);
    }
    else
    {
        if ((millis() - timestamp_ultimo_acionamento) >= tempo_debounce)
        {
            // contador_acionamentos++;
            timestamp_ultimo_acionamento = millis();
            // sprintf(ent, "%s%d", "sensor_", contador_acionamentos); // sprintf em vez de itoa
            // valores_sensor[ent] = timestamp_ultimo_acionamento - tempo_inicial;
            // Serial.println(timestamp_ultimo_acionamento - tempo_inicial);
        }
    }
}

void setup()
{

    Serial.begin(9600);

    pinMode(pin_a, OUTPUT);
    pinMode(pin_b, OUTPUT);
    pinMode(pin_c, OUTPUT);
    pinMode(pin_d, OUTPUT);
    pinMode(pin_e, OUTPUT);
    pinMode(pin_f, OUTPUT);
    pinMode(pin_g, OUTPUT);

    for (int i = 0; i < 6; i++)
    {
        pinMode(pin_displays[i], OUTPUT);
    }

    pinMode(pin_entrada_sensor, INPUT);
    pinMode(pin_led_estado_sensor, OUTPUT);

    attachInterrupt(pin_entrada_sensor, contador, RISING);

    // We start by connecting to a WiFi network
    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    /*
        IPAddress local_IP(10, 14, 160, 184);
        IPAddress gateway(10, 14, 161, 250);
        IPAddress local_IP(192, 168, 100, 184);
        IPAddress gateway(192, 168, 100, 1);
    */

    IPAddress local_IP(192, 168, 200, 184);
    IPAddress gateway(192, 168, 200, 1);
    IPAddress subnet(255, 255, 0, 0);

    if (!WiFi.config(local_IP, gateway, subnet))
    {
        Serial.println("STA Failed to configure");
    }

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    server.begin();

    AsyncCallbackJsonWebHandler *alterarFuncao =
    new AsyncCallbackJsonWebHandler("/alterarfuncao", [](AsyncWebServerRequest *request, String json) {
                              
        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        // Seta os numeros no display
        estado_display = data["estado_display"];
        funcao = data["funcao"];

        request->send(200, "text/plain"); 

    });
    server.addHandler(alterarFuncao);

    AsyncCallbackJsonWebHandler *changeDelay =
    new AsyncCallbackJsonWebHandler("/delay", [](AsyncWebServerRequest *request, String json) {                             
        
        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        Serial.println(json);

        // Seta os numeros no display
        tempo_delay = data["delay"];

        request->send(200, "text/plain"); 
    });
    server.addHandler(changeDelay);




}

void loop()
{
    if(estado_display == 0){
        standbyDisplay();
    } else{
        
    }
    
}
