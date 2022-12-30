// Por convenção os 6 displays são numerados de 0 a 5
// do menos significativo (0) para o mais significativo (5)

#include <WiFi.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include "ESPAsyncWebServer.h"
#include "AsyncJson.h"

const char *ssid = "Display";
const char *password = "leonardo";

// Pinos do display de 7 segmentos
const int pin_a = 15;
const int pin_b = 2;
const int pin_c = 4;
const int pin_d = 16;
const int pin_e = 17;
const int pin_f = 5;
const int pin_g = 18;

// Pinos de ativação dos displays
const int pin_displays[6] = {14, 27, 26, 25, 33, 32};

// Variaveis de controle
const int tempo_debounce = 500;
const int pin_entrada_pistola = 35;
const int pin_entrada_sensor_inicial = 36;
const int pin_entrada_sensor_intermediario = 39;
const int pin_entrada_sensor_final = 34;
const int pin_buzzer = 19;
const int pin_bolinhas = 13;

int tempo_delay = 3000;
int estado_display = 0; // Ligado ou desligado
int funcao = 0;
int estado_multiplexacao = 0;
int pausar_cronometro = 1;
int tempo_inicial = 0;
int contador_decrescente = 0;
int acionar_buzzer = 0;
int acionar_buzzer_cronometro = 0;
int buzzer_cronometro = 0;
int numeroInicial = 0;
int buzzer_simples = 0;

// 0 -> Pistola | 1 -> Sensor Inicial
int tipo_acionamento_sensor = 0;

int sensores_finalizados = 0;

unsigned int segundos = 0;

hw_timer_t * timer = NULL;

unsigned long timestamp_ultimo_acionamento = 0;
char ent[8];

int vetorNumeros[6] = {1, 2, 3, 4, 5, 6};

const size_t CAPACITY = JSON_ARRAY_SIZE(20);
StaticJsonDocument<CAPACITY> doc;
JsonArray arraySensor = doc.to<JsonArray>();

AsyncWebServer server(80);

void IRAM_ATTR escreverNumero(int numero) {

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
        digitalWrite(pin_displays[i], LOW);
    }

}

void IRAM_ATTR separarNumeroComposto(int numero) {
    numero = numero / 10;
    for (int i = 0; i < 6; i++) {
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

void IRAM_ATTR multiplexarDisplay() {

    apagarDisplay();
 
    for (int i = 0; i < 6; i++) {
        digitalWrite(pin_displays[i], HIGH);
        escreverNumero(vetorNumeros[i]);
        delayMicroseconds(tempo_delay);
        digitalWrite(pin_displays[i], LOW);
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
        if (contador_decrescente == 1) {
            if(segundos != 0) {
                segundos--;
            } else if (buzzer_cronometro == 0){
                acionar_buzzer_cronometro = 1;
            }
        } else {
            segundos++;
        }
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

            digitalWrite(pin_displays[i], HIGH);
            escreverNumero(vetorNumeros[i]);
            delayMicroseconds(tempo_delay);
            digitalWrite(pin_displays[i], LOW);

        }

        if(segundos == 0 && acionar_buzzer_cronometro == 1 && buzzer_cronometro == 0 && contador_decrescente == 1){
            buzzerCronometro();
        }
        
    }
    
    timerEnd(timer);
    
}

void funcao_placar() {

    digitalWrite(pin_bolinhas, LOW);
    digitalWrite(pin_displays[2], LOW);
    digitalWrite(pin_displays[3], LOW);

    while(funcao == 3 && estado_display != 0) {

        for (int i = 0; i < 6; i++) {

            if(i == 2) {
                i = 4;
            }

            digitalWrite(pin_displays[i], HIGH);
            escreverNumero(vetorNumeros[i]);
            delayMicroseconds(tempo_delay);
            digitalWrite(pin_displays[i], LOW);

        }
        
    }
    
}

void IRAM_ATTR pistolaSensor() {
    Serial.println("pistolaSensor");

/*    if(funcao == 2 && estado_display != 0 && tempo_inicial == 0 && tipo_acionamento_sensor == 0) {
        tempo_inicial = millis();
        timestamp_ultimo_acionamento = millis();
        buzzer_simples = 1;
        acionar_buzzer = 1;
    }*/

}

void IRAM_ATTR sensorInicialContador() {
    Serial.println("sensorInicialContador");

   /* if(funcao == 2 && estado_display != 0) {
        if (tipo_acionamento_sensor == 1) {
            if(tempo_inicial == 0){
                tempo_inicial = millis();
                buzzer_simples = 1;
                acionar_buzzer = 1;
            }
        } else if(arraySensor.size() == 0) {
            timestamp_ultimo_acionamento = millis();
            arraySensor.add((timestamp_ultimo_acionamento - tempo_inicial));
        }
    }*/

}

void IRAM_ATTR sensorIntermediarioContador() {
    Serial.println("sensorIntermediarioContador");
    /*if(funcao == 2 && estado_display != 0 && tempo_inicial != 0 && sensores_finalizados == 0) {

        if ((millis() - timestamp_ultimo_acionamento) >= tempo_debounce) {
            timestamp_ultimo_acionamento = millis();
            arraySensor.add((timestamp_ultimo_acionamento - tempo_inicial));
        }
    }*/

}

void IRAM_ATTR sensorFinalContador() {
Serial.println("sensorFinalContador");
   /* if(funcao == 2 && estado_display != 0 && tempo_inicial != 0 && sensores_finalizados == 0) {

        if ((millis() - timestamp_ultimo_acionamento) >= tempo_debounce) {
            timestamp_ultimo_acionamento = millis();
            arraySensor.add((timestamp_ultimo_acionamento - tempo_inicial));
            sensores_finalizados = 1;
            acionar_buzzer = 1;
        }
    }*/
}

void buzzer() {

    int tempo = 0;
    acionar_buzzer = 0;
    
    if(buzzer_simples == 1) {
            
        tempo = millis() + 500;

        digitalWrite(pin_buzzer, HIGH);

        while(tempo > millis()) {
            multiplexarDisplay();
        }

        digitalWrite(pin_buzzer, LOW);

    } else {

        for(int i = 0; i < 3; i++) {
            
            tempo = millis() + 500;

            digitalWrite(pin_buzzer, HIGH);

            while(tempo > millis()) {
                multiplexarDisplay();
            }

            digitalWrite(pin_buzzer, LOW);

            apagarDisplay();
            tempo = millis() + 500;

            while(tempo > millis()) { }

        }

    }
    buzzer_simples = 0;

}

void buzzerCronometro() {

    int tempo = 0;
    buzzer_cronometro = 1;
    acionar_buzzer_cronometro = 0;

    for(int i = 0; i < 3; i++) {
        
        tempo = millis() + 500;

        digitalWrite(pin_buzzer, HIGH);

        while(tempo > millis()) {
            multiplexarDisplay();
        }

        digitalWrite(pin_buzzer, LOW);

        apagarDisplay();
        tempo = millis() + 500;

        while(tempo > millis()) { }

    }

}

void setup() {

    Serial.begin(9600);
   
    pinMode(pin_a, OUTPUT);
    pinMode(pin_b, OUTPUT);
    pinMode(pin_c, OUTPUT);
    pinMode(pin_d, OUTPUT);
    pinMode(pin_e, OUTPUT);
    pinMode(pin_f, OUTPUT);
    pinMode(pin_g, OUTPUT);

    pinMode(pin_bolinhas, OUTPUT);

    for (int i = 0; i < 6; i++) {
        pinMode(pin_displays[i], OUTPUT);
    }

    pinMode(pin_entrada_pistola, INPUT);
    pinMode(pin_entrada_sensor_inicial, INPUT);
    pinMode(pin_entrada_sensor_intermediario, INPUT);
    pinMode(pin_entrada_sensor_final, INPUT);

    pinMode(pin_buzzer, OUTPUT);

    attachInterrupt(pin_entrada_pistola, pistolaSensor, RISING);
    attachInterrupt(pin_entrada_sensor_inicial, sensorInicialContador, RISING);
    attachInterrupt(pin_entrada_sensor_intermediario, sensorIntermediarioContador, RISING);
    attachInterrupt(pin_entrada_sensor_final, sensorFinalContador, RISING);

    WiFi.softAP(ssid, password);

    IPAddress IP = WiFi.softAPIP();
    //Serial.print("AP IP address: ");
    //Serial.println(IP);

    server.begin();

    AsyncCallbackJsonWebHandler *alterarFuncao =
    new AsyncCallbackJsonWebHandler("/alterarfuncao", [](AsyncWebServerRequest *request, String json) {
                              
        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        estado_display = data["estado_display"];
        funcao = data["funcao"];
        tempo_inicial = 0;
        arraySensor.clear();
        sensores_finalizados = 1;
        buzzer_cronometro = 0;
        pausar_cronometro = 1;
        contador_decrescente = 0;
        
        request->send(200, "text/plain"); 

    });
    server.addHandler(alterarFuncao);

    AsyncCallbackJsonWebHandler *alterarNumeros =
    new AsyncCallbackJsonWebHandler("/alterarNumeros", [](AsyncWebServerRequest *request, String json) {
                              
        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        segundos = data["segundos"];
        buzzer_cronometro = 0;

        request->send(200, "text/plain"); 

    });
    server.addHandler(alterarNumeros);

    AsyncCallbackJsonWebHandler *alterarNumerosPlacar =
    new AsyncCallbackJsonWebHandler("/alterarNumerosPlacar", [](AsyncWebServerRequest *request, String json) {
                              
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
    server.addHandler(alterarNumerosPlacar);

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
        buzzer_cronometro = 0;

        request->send(200, "text/plain"); 

    });
    server.addHandler(reiniciarCronometro);

    AsyncCallbackJsonWebHandler *modoCronometro =
    new AsyncCallbackJsonWebHandler("/modoCronometro", [](AsyncWebServerRequest *request, String json) {

        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        // Seta os numeros no display
        contador_decrescente = data["decrescente"];
        buzzer_cronometro = 0;

        request->send(200, "text/plain"); 

    });
    server.addHandler(modoCronometro);

/*
    AsyncCallbackJsonWebHandler *contadorDecrescente =
    new AsyncCallbackJsonWebHandler("/modoCronometro", [](AsyncWebServerRequest *request, String json) {

        segundos = 0;

        request->send(200, "text/plain"); 

    });
    server.addHandler(contadorDecrescente);
*/

    AsyncCallbackJsonWebHandler *iniciarSensores =
    new AsyncCallbackJsonWebHandler("/iniciarSensores", [](AsyncWebServerRequest *request, String json) {                             

        tempo_inicial = 0;
        arraySensor.clear();
        sensores_finalizados = 0;
        
        request->send(200, "text/plain"); 
    });
    server.addHandler(iniciarSensores);

    AsyncCallbackJsonWebHandler *interromperSensores =
    new AsyncCallbackJsonWebHandler("/interromperSensores", [](AsyncWebServerRequest *request, String json) {                             
        
        sensores_finalizados = 1;

        request->send(200, "text/plain"); 
    });
    server.addHandler(interromperSensores);

    AsyncCallbackJsonWebHandler *tipoAcionamentoSensor =
    new AsyncCallbackJsonWebHandler("/tipoAcionamentoSensor", [](AsyncWebServerRequest *request, String json) {                             
        
        DynamicJsonDocument data(1024);
        deserializeJson(data, json);

        tipo_acionamento_sensor = data["tipo_acionamento_sensor"];

        request->send(200, "text/plain"); 
    });
    server.addHandler(tipoAcionamentoSensor);

    server.on("/dadosSensores", HTTP_GET, [](AsyncWebServerRequest *request) {

        String json = "";

        serializeJson(arraySensor, json);
        request->send(200, "application/json", json);

    });

    server.on("/statusSensores", HTTP_GET, [](AsyncWebServerRequest *request) {

        DynamicJsonDocument doc(1024);
        String json = "";

        doc["sensores_finalizados"] = sensores_finalizados;

        serializeJson(doc, json);
        request->send(200, "application/json", json);

    });

}

void loop() {

    Serial.println("loop");

    if(acionar_buzzer) {
        buzzer();
    }
    
    if(estado_display == 0){
        standbyDisplay();
    } else {
        
        switch (funcao) {
            case 1:
                funcao_cronometro();
                break;
            case 2:
                if (tempo_inicial != 0 && sensores_finalizados == 0) {
                    separarNumeroComposto(millis() - tempo_inicial);
                    multiplexarDisplay();
                } else if (sensores_finalizados == 1) {
                    separarNumeroComposto(arraySensor[arraySensor.size()-1]);
                    multiplexarDisplay();
                }
                break;
            case 3:
                funcao_placar();
                break;
            case 4:
                multiplexarDisplay();
                break;
            default:
                for (int i = 0; i < 6; i++) {
                    vetorNumeros[i] = numeroInicial;
                }
                segundos = 0;
                standbyDisplay();
                break;
        }
    }
    
}
