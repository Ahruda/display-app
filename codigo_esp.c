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
const int tempo_debounce = 1000;
const int pin_entrada_sensor_inicial = 34;
const int pin_entrada_sensor_intermediario = 35;
const int pin_entrada_sensor_final = 27;
const int pin_led_estado_sensor = 13;

int tempo_delay = 100;
int estado_display = 0; // Ligado ou desligado
int funcao = 0;
int estado_multiplexacao = 0;
int pausar_cronometro = 0;
int tempo_inicial = 0;

int contador_acionamentos = 0;
int sensores_finalizados = 0;

unsigned int segundos = 0;

hw_timer_t * timer = NULL;

unsigned long timestamp_ultimo_acionamento = 0;
char ent[8];

int vetorNumeros[6] = {1, 2, 3, 4, 5, 6};

DynamicJsonDocument valores_sensor(1024);

AsyncWebServer server(80);

void escreverNumero(int numero) {

    switch (numero) {

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

void separarNumeroComposto(int numero) {
    for (int i = 0; i < 6; i++)
    {
        vetorNumeros[i] = numero % 10;
        numero /= 10;
    }
}

void escreverTempoEmSegundos(int segundos) {

    int h, m, s, resto;
    
    h = segundos / 3600;
    resto = segundos % 3600;
    m = resto / 60;
    s = resto % 60;

    vetorNumeros[0] = s % 10;
    vetorNumeros[1] = s / 10;
    
    vetorNumeros[2] = m % 10;
    vetorNumeros[3] = m / 10;

    vetorNumeros[4] = h % 10;
    vetorNumeros[5] = h / 10;

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

void incrementarSegundos() {
    if(!pausar_cronometro){
        segundos++;
    }
}

void funcao_cronometro() {

    timer = timerBegin(0, 80, true);

    timerAttachInterrupt(timer, &incrementarSegundos, true); 
    timerAlarmWrite(timer, 1000000, true); 

    timerAlarmEnable(timer);

    while(funcao == 1 && estado_display != 0) {
       
        escreverTempoEmSegundos(segundos);

        for (int i = 0; i < 6; i++) {

            digitalWrite(pin_displays[i], LOW);
            escreverNumero(vetorNumeros[i]);
            delayMicroseconds(tempo_delay);
            digitalWrite(pin_displays[i], HIGH);

        }
        
    }
    
    timerEnd(timer);
}

void funcao_sensor() {

}

void funcao_placar() {

    digitalWrite(pin_displays[2], HIGH);
    digitalWrite(pin_displays[3], HIGH);

    while(funcao == 3 && estado_display != 0) {

        for (int i = 0; i < 6; i++) {

            if(i == 2) {
                i = 4;
            }

            digitalWrite(pin_displays[i], LOW);
            escreverNumero(vetorNumeros[i]);
            delayMicroseconds(tempo_delay);
            digitalWrite(pin_displays[i], HIGH);

        }
        
    }
    
}

void IRAM_ATTR sensorInicialContador() {

    if(funcao == 2 && estado_display != 0 && tempo_inicial == 0) {

        Serial.println("iniciar contagem");

        tempo_inicial = millis();
        timestamp_ultimo_acionamento = millis();

        digitalWrite(pin_led_estado_sensor, HIGH);

    }

}

void IRAM_ATTR sensorIntermediarioContador() {

    if(funcao == 2 && estado_display != 0 && tempo_inicial != 0 && sensores_finalizados == 0) {

        if ((millis() - timestamp_ultimo_acionamento) >= tempo_debounce) {

            Serial.println("sensor intermediario");

            timestamp_ultimo_acionamento = millis();
            sprintf(ent, "%s%d", "sensor_", contador_acionamentos); 
            valores_sensor[ent] = timestamp_ultimo_acionamento - tempo_inicial;

            contador_acionamentos++;
            
        }
    }

}

void IRAM_ATTR sensorFinalContador() {

    if(funcao == 2 && estado_display != 0 && tempo_inicial != 0 && sensores_finalizados == 0) {

        Serial.println("sensor final");

        timestamp_ultimo_acionamento = millis();
        sprintf(ent, "%s%d", "sensor_", contador_acionamentos); 
        valores_sensor[ent] = timestamp_ultimo_acionamento - tempo_inicial;
        contador_acionamentos++;

        digitalWrite(pin_led_estado_sensor, LOW);

        sensores_finalizados = 1;
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

    pinMode(pin_entrada_sensor_inicial, INPUT);
    pinMode(pin_entrada_sensor_intermediario, INPUT);
    pinMode(pin_entrada_sensor_final, INPUT);

    pinMode(pin_led_estado_sensor, OUTPUT);

    attachInterrupt(pin_entrada_sensor_inicial, sensorInicialContador, RISING);
    attachInterrupt(pin_entrada_sensor_intermediario, sensorIntermediarioContador, RISING);
    attachInterrupt(pin_entrada_sensor_final, sensorFinalContador, RISING);

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

        Serial.println(estado_display);
        Serial.println(funcao);

        request->send(200, "text/plain"); 

    });
    server.addHandler(alterarFuncao);

    AsyncCallbackJsonWebHandler *alterarNumeros =
    new AsyncCallbackJsonWebHandler("/alterarNumeros", [](AsyncWebServerRequest *request, String json) {
                              
        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        vetorNumeros[0] = data["numero_1"];
        vetorNumeros[1] = data["numero_2"];
        vetorNumeros[2] = data["numero_3"];
        vetorNumeros[3] = data["numero_4"];
        vetorNumeros[4] = data["numero_5"];
        vetorNumeros[5] = data["numero_6"];

        request->send(200, "text/plain"); 

    });
    server.addHandler(alterarNumeros);

    AsyncCallbackJsonWebHandler *pausarCronometro =
    new AsyncCallbackJsonWebHandler("/pausarCronometro", [](AsyncWebServerRequest *request, String json) {

        if(pausar_cronometro == 0) {
            pausar_cronometro = 1;
        } else {
            pausar_cronometro = 0;
        }

        request->send(200, "text/plain"); 

    });
    server.addHandler(pausarCronometro);

    AsyncCallbackJsonWebHandler *reiniciarCronometro =
    new AsyncCallbackJsonWebHandler("/reiniciarCronometro", [](AsyncWebServerRequest *request, String json) {

        segundos = 0;

        request->send(200, "text/plain"); 

    });
    server.addHandler(reiniciarCronometro);

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

    server.on("/dadosSensores", HTTP_GET, [](AsyncWebServerRequest *request) {

        DynamicJsonDocument doc(1024);
        String json = "";
        valores_sensor["sensor_final"] = sensores_finalizados;
        serializeJson(valores_sensor, json);
        request->send(200, "application/json", json);

    });

}

void loop()
{

    if(estado_display == 0){
        standbyDisplay();
    } else{
        for (int i = 0; i < 6; i++) {
            vetorNumeros[i] = 0;
        }
        segundos = 0;
        switch (funcao) {
            case 1:
                funcao_cronometro();
                break;
            case 2:
                
                break;
            case 3:
                funcao_placar();
                break;
        }
    }
    
}
