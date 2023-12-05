// root node backup:
// TODO:
//       1. Add a response queue
//          when i send a command i add to the queue and when i receive a success status from the node id in the queue,
//          remove it and update the react GUI.
//          After X time with no response try again, if still error, send error code to react GUI.
//          * Add parsing for the message from the node to get the nodeId and the nodeName.
//
//       2. improve styling for root node /dev GUI.
//
//       3. finish implementing the getName function

#include "IPAddress.h"
#include "painlessMesh.h"

#ifdef ESP8266
#include "Hash.h"
#include <ESPAsyncTCP.h>
#else
#include <AsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>

// MESH CREDENTIALS
#define MESH_PREFIX "whateverYouLike"
#define MESH_PASSWORD "somethingSneaky"
#define MESH_PORT 5555

// YOUR WI-FI credentials
#define STATION_SSID "Sharon_2.4"
#define STATION_PASSWORD "207503509"

#define HOSTNAME "HTTP_BRIDGE"
#define MINUTE 60 * 1000 // 60 times (one second in milliseconds)

bool isAdminLoggedIn = false;
unsigned long lastAdminActivityTime = 0;
const unsigned long adminTimeoutInterval = 5 * MINUTE;

painlessMesh mesh;
AsyncWebServer server(80);
IPAddress myIP(0, 0, 0, 0);
IPAddress myAPIP(0, 0, 0, 0);
String logString = "";
// Function Prototypes
void receivedCallback(const uint32_t &from, const String &msg);
void newConnectionCallback(uint32_t nodeId);
IPAddress getlocalIP();

void setup() {
    Serial.begin(115200);
    mesh.setDebugMsgTypes(ERROR | MESH_STATUS);
    mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_AP_STA, 1);
    mesh.onReceive(&receivedCallback);
    mesh.onNewConnection(&newConnectionCallback);
    mesh.stationManual(STATION_SSID, STATION_PASSWORD);
    mesh.setHostname(HOSTNAME);
    mesh.setRoot(true);
    mesh.setContainsRoot(true);

    myAPIP = IPAddress(mesh.getAPIP());
    Serial.println("My AP IP is " + myAPIP.toString());

    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
        String htmlResponse =
            "<!DOCTYPE html>"
        "<html>"
        "<head>"
        "    <style>"
        "        * { user-select: none; }"
        "        body { background: radial-gradient(circle at center, lightgrey, transparent); }"
        "        .footer, .centered-div, h1 {"
        "            position: absolute;"
        "            left: 50%;"
        "            transform: translate(-50%, -50%);"
        "        }"
        "        h1 { top: 3%; }"
        "        .footer { top: 95%; font-size: 20px; }"
        "        .centered-div {"
        "            top: 40%;"
        "            border: 2px solid black;"
        "            padding: 10px 20px 35px;"
        "            text-align: center;"
        "            border-radius: 15px;"
        "        }"
        "        input { width: auto; height: 20px; }"
        "        input:focus { outline: none; }"
        "        button { cursor: pointer; width: 60px; height: 35px; }"
        "    </style>"
        "    <title>Mesh Control panel login</title>"
        "</head>"
        "<body>"
        "    <h1>Welcome to the Mesh control panel</h1>"
        "    <form class=\"centered-div\">"
        "        <h3>Mesh login</h3>"
        "        <br>"
        "        username  <input type=\"text\" placeholder=\"username\" name=\"username\">"
        "        <br><br>"
        "        password  <input type=\"password\" placeholder=\"password\" name=\"password\">"
        "        <br><br><br><br>"
        "        <button type=\"submit\">"
        "            Login"
        "        </button>"
        "    </form>"
        "    <div class=\"footer\">"
        "        Developed by Lior Jigalo <a href='https://github.com/audiblemaple/Smart_home.git'>github.com/audiblemaple/Smart_home</a>"
        "    </div>"
        "</body>"
        "</html>";

        if (request->hasArg("username") && request->hasArg("password")) {
            String username = request->arg("username");
            String password = request->arg("password");
            if (username == "admin" && password == "admin") {
                isAdminLoggedIn = true;
                lastAdminActivityTime = millis();
                Serial.println("Admin logged in");
                logString += formatTimestamp(millis()) + "Admin logged in\n";
                request->redirect("/dev");
                return;
            } else {
                isAdminLoggedIn = false;
                Serial.println("Incorrect login attempt");
                logString += formatTimestamp(millis()) + "Incorrect login attempt\n";

            }
        } else{
            Serial.println("No login credentials provided");
            logString += formatTimestamp(millis()) + "No login credentials provided\n";
        }

        request->send(200, "text/html", htmlResponse);
    });

    server.on("/dev", HTTP_GET, [](AsyncWebServerRequest *request){
        if(!isAdminLoggedIn){
            request->redirect("/");
        }
        lastAdminActivityTime = millis();
        String htmlResponse =
            "<!DOCTYPE html>"
        "<html>"
        "<head>"
        "    <style>"
        "        body { background: radial-gradient(circle at center, lightgrey, transparent); }"
        "        .footer, .centered-div, h1, #logArea {"
        "            position: absolute;"
        "            left: 50%;"
        "            transform: translate(-50%, -50%);"
        "        }"
        "        h1 { top: 3%; }"
        "        .footer { top: 95%; font-size: 20px; }"
        "        .centered-div {"
        "            top: 30%;"
        "            border: 2px solid black;"
        "            padding: 10px 20px 35px;"
        "            text-align: center;"
        "            border-radius: 15px;"
        "        }"
        "        #logArea {"
        "            top: 64%;"
        "            width: 60%;"
        "            height: 35%;"
        "            resize: none;"
        "            outline: none;"
        "        }"
        "        input { width: auto; height: 20px; }"
        "        input:focus { outline: none; }"
        "        button { cursor: pointer; width: 60px; height: 35px; }"
        "    </style>"
        "    <title>Mesh Control Panel</title>"
        "</head>"
        "<body>"
        "    <h1>Mesh Control Panel</h1>"
        "    <form class='centered-div'>"
        "        Command UI"
        "        <br><br>"
        "        NodeId:<input type='text' name='id'><br><br>"
        "        Action:<input type='text' name='act'><br><br><br>"
        "        <input type='submit' value='Send'>"
        "    </form>"
        "    <textarea id='logArea' readonly></textarea>"
        "    <script>"
        "        function fetchLog() {"
        "            var xhr = new XMLHttpRequest();"
        "            xhr.onreadystatechange = function() {"
        "                if (this.readyState == 4 && this.status == 200) {"
        "                    document.getElementById('logArea').textContent = this.responseText;"
        "                }"
        "            };"
        "            xhr.open('GET', '/getLog', true);"
        "            xhr.send();"
        "        }"
        "        setInterval(fetchLog, 1000);"
        "    </script>"
        "    <div class='footer'>"
        "        Developed by Lior Jigalo <a href='https://github.com/audiblemaple/Smart_home.git'>github.com/audiblemaple/Smart_home</a>"
        "    </div>"
        "</body>"
        "</html>";

        // Obtain the subConnectionJson string
        String subConnectionJson = mesh.subConnectionJson();

        Serial.println(subConnectionJson);

        // Parse the JSON string
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, subConnectionJson);

        // Extracting root node information
        uint32_t rootNodeId = doc["nodeId"]; // Extracting root nodeId
        htmlResponse += "<h3>Root node:</h3><ul>";
        htmlResponse += "<li>" + String(rootNodeId) + "</li>";
        htmlResponse += "</ul>";

        // Extracting connected nodes information
        JsonArray subs = doc["subs"];
        if (!subs.isNull() && subs.size() > 0) {
            htmlResponse += "<h3>Mesh Nodes:</h3><ul>";
            for (JsonObject sub : subs) {
                uint32_t nodeId = sub["nodeId"]; // Extracting nodeId

                // Send a message to each node to get its name
                mesh.sendSingle(nodeId, "getName");
                htmlResponse += "<li>" + String(nodeId) + "</li>";
            }
            htmlResponse += "</ul>";
        } else {
            htmlResponse += "<p>No connected nodes in the mesh</p>";
        }

        String id, act;

        if (request->hasArg("id") && request->hasArg("act")) {
            id = request->arg("id");
            act = request->arg("act");

            Serial.println("Received id: " + id);
            logString += formatTimestamp(millis()) + "Received id: " + id + "\n";
            Serial.println("Received act: " + act);
            logString += formatTimestamp(millis()) + "Received act: " + act + "\n";

            String combinedMsg = id + ":" + act;

            if (mesh.sendSingle(id.toInt(), act))
                Serial.println("Send success");
            logString += formatTimestamp(millis()) + "Send success \n";

        } else
        Serial.println("ID and/or Action argument not received");
        request->send(200, "text/html", htmlResponse);
    });

    server.on("/getLog", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(200, "text/plain", logString);
    });

    // check if this route will work...
    server.on("/comm", HTTP_GET, [](AsyncWebServerRequest *request){
        String id, act;
        if (request->hasArg("id") && request->hasArg("act")) {
            id = request->arg("id");
            act = request->arg("act");

            Serial.println("Received id: " + id);
            logString += formatTimestamp(millis()) + "Received id: " + id + "\n";
            Serial.println("Received act: " + act);
            logString += formatTimestamp(millis()) + "Received act: " + act + "\n";

            String combinedMsg = id + ":" + act;

            if (mesh.sendSingle(id.toInt(), act)){
                Serial.println("Send success");
                logString += formatTimestamp(millis()) + "Send success \n";
            }
        } else
        Serial.println("ID and/or Action argument not received");
    });

    server.begin();
}

void loop() {
    mesh.update();
    if (myIP != getlocalIP()) {
        myIP = getlocalIP();
        Serial.println("My IP is " + myIP.toString());
        logString += formatTimestamp(millis()) + "My IP is: " + myIP.toString() + "\n";
    }
    if (isAdminLoggedIn && millis() - lastAdminActivityTime > adminTimeoutInterval) {
        isAdminLoggedIn = false;
        Serial.println("Admin session timed out");
        logString += formatTimestamp(millis()) + "Admin session timed out";
    }
}

void receivedCallback(const uint32_t &from, const String &msg) {
    Serial.printf("Root node: Received from %u msg=%s\n", from, msg.c_str());
    logString += formatTimestamp(millis()) + "Root node: Received from: " + String(from) + ", " + String(msg.c_str()) + "\n";
}

IPAddress getlocalIP() {
    return IPAddress(mesh.getStationIP());
}

void newConnectionCallback(uint32_t nodeId) {
    Serial.printf("New node Connection, nodeId: %u\n", nodeId);
    logString += formatTimestamp(millis()) + "New node Connection, nodeId: %u\n", nodeId;
}

String formatTimestamp(unsigned long millisecs) {
    unsigned long seconds = millisecs / 1000;
    unsigned long minutes = seconds / 60;
    unsigned long hours = minutes / 60;

    seconds %= 60;
    minutes %= 60;

    char timestamp[10];
    sprintf(timestamp, "%02lu:%02lu:%02lu ", hours, minutes, seconds);
    return String(timestamp);
}


// light node backup:
#include "painlessMesh.h"

#define MESH_PREFIX         "whateverYouLike"
#define MESH_PASSWORD       "somethingSneaky"
#define MESH_PORT           5555
#define LED_PIN             2 //                    | this is the Built in LED on NodeMCU
#define RELAY_PIN           4 // D2 on NodeMCU      | this is connected to the relay trigger
#define OUTPUT_TOGGLE_PIN   5 // D1 on NodeMCU  <═╗ | this is connected to D4
                              // light switchm <══\ | the light switch breaks the connection between the two pins
#define INPUT_TOGGLE_PIN    2 // D4 on NodeMCU  <═╝ | this is connected to D1
#define ROOT_NODE_ID        3042073076 //           | this is the root nodes ID (chip id)

// TODO:
//      1. Find a way to send the name along with the nodeId

enum State {
    A, B, C, D
};

Scheduler userScheduler; // Custom scheduler for your tasks
painlessMesh  mesh;

State currentState = A;
bool lightStateFromApp = false;
bool previousLedState = false;
int previousInputState = LOW;
bool lightFlag = false;
String NodeName = "Room 1 light"

void receivedCallback(uint32_t from, String &msg);

void nodeTimeAdjustedCallback(int32_t offset) {
    Serial.printf("Adjusted time %u. Offset = %d\n", mesh.getNodeTime(),offset);
}

void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN,           OUTPUT);
    pinMode(RELAY_PIN,         OUTPUT);
    pinMode(OUTPUT_TOGGLE_PIN, OUTPUT);
    pinMode(INPUT_TOGGLE_PIN,  INPUT );

    mesh.setDebugMsgTypes( STARTUP | MESH_STATUS | ERROR );
    // SET NODE CREDENTIALS, OPERATING MODE AND CHANNEL  v------v SUPER IMPORTANT!!
    mesh.init( MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_STA, 1 );
    mesh.onReceive(&receivedCallback);
    // Not sure i want them in..
    // mesh.onNewConnection(&newConnectionCallback);
    // mesh.onChangedConnections(&changedConnectionCallback);
    mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
}

void printState(State state, bool ledState, int inputState) {
    switch (state) {
        case A: Serial.println("State A"); break;
        case B: Serial.println("State B"); break;
        case C: Serial.println("State C"); break;
        case D: Serial.println("State D"); break;
    }
    Serial.print("ledState: ");
    Serial.println(ledState ? "HIGH" : "LOW");
    Serial.print("INPUT_TOGGLE_PIN: ");
    Serial.println(inputState == HIGH ? "HIGH" : "LOW");
}

void toggleLightFlag(bool* flag) {
*flag = !(*flag);
}

void loop() {
    int inputState = digitalRead(INPUT_TOGGLE_PIN);

    switch (currentState) {
        case A:
            if (lightStateFromApp != previousLedState && lightStateFromApp == true) {
                currentState = B;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            } else if (inputState != previousInputState && inputState == HIGH) {
                currentState = C;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            }
            break;
        case B:
            if (lightStateFromApp != previousLedState && lightStateFromApp == false) {
                currentState = A;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            } else if (inputState != previousInputState && inputState == HIGH) {
                currentState = D;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            }
            break;
        case C:
            if (inputState != previousInputState && inputState == LOW) {
                currentState = A;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            } else if (lightStateFromApp != previousLedState && lightStateFromApp == true) {
                currentState = D;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            }
            break;
        case D:
            if (lightStateFromApp != previousLedState && lightStateFromApp == false) {
                currentState = C;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            } else if (inputState != previousInputState && inputState == LOW) {
                currentState = B;
                toggleLightFlag(&lightFlag);
                printState(currentState, lightStateFromApp, inputState);
            }
            break;
    }

    previousLedState = lightStateFromApp;
    previousInputState = inputState;

    digitalWrite(LED_PIN, lightFlag ? LOW : HIGH);
    digitalWrite(RELAY_PIN, lightFlag ? HIGH : LOW);

    mesh.update();
}

void receivedCallback(uint32_t from, String &msg) {
    String response = "fail";

    if (msg.equals("turn_on")) {
        Serial.printf("Received 'turn on' command.\n");
        response = "success";
        lightStateFromApp = true;
    } else if (msg.equals("turn_off")) {
        Serial.printf("Received 'turn off' command.\n");
        response = "success";
        lightStateFromApp = false;
    } else if (msg.equals("getName")) {
        Serial.printf("Received 'getName' command.\n");
        // Add functionality for sending the node name
        response = "success";
    } else {
        Serial.printf("Unknown message: %s\n", msg.c_str());
    }

    if (mesh.sendSingle(from, response)){
        Serial.println("Response success");
    }
}


// void newConnectionCallback(uint32_t nodeId) {
//     Serial.printf("New node Connection, nodeId: %u\n", nodeId);
// }

// void changedConnectionCallback() {
//     Serial.printf("Changed connections\n");
// }
