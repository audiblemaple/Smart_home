# Smart Home Control System with 3D view

Welcome to my Smart Home 3D Control System.\
This project is designed to provide an intuitive interface for managing and interacting with custom microcontrollers that are set up in my house.\
The interface includes a 3D model of a home where users can visually navigate to different areas and control smart devices such as lights and window blinds.\
It also features a live camera feed from the entrance door for security and monitoring.\
The controllers used in this project were esp8266 and esp32 and code is based on the PainlessMesh library.
**Currently, for security measures everything is functional only when connected to my houses WI-FI network.**

## Features
- **3D Home Model**: A detailed 3D representation of my home using `<model-viewer>` for an immersive experience.
- **Interactive Controls**: Buttons placed within the 3D model allow users to control lights, window blinds and AC in the corresponding real-world locations.
- **Focus and Zoom**: Easy and intuitive control of the zoom, view and rotation of the whole model.
- **Entrance Camera**: A real-time camera feed from the entrance door is available to monitor who is entering or leaving the home.
- **Management and development interface**: A control panel for managing the esp8266 / esp32 devices within the houses mesh.

## How to Use

### Flashing esp firmware \#todo: elaborate more on the steps
- Download the Arduino IDE and add the board you are using the board manager.
- Flash the Root node code to the root node firmware.
  - Set the mesh ssid & password.
  - Set your WI-FI ssid & password.
  - **make sure the channel is the same as your WI-FI network!**
- Flash all other nodes with the child_node firmware.
    - Set the mesh ssid & password.
    - Set your WI-FI ssid & password.
    - **make sure the channel is the same as your WI-FI network!**
- Connect or solder the cables to the correct places:
    - \#TODO: add the connection diagram with pictures.

### Root node web UI
- Open serial monitor to get the IP address of the root node for development and debugging interface.
    - routes:
        - **"/"** login screen: (on login, should log out after 2 minutes of inactivity)
            - default credentials:
                - username: admin
                - password: admin
        - **"/dev"** the development interface, allows you to view all connected nodes ids (no names yet) and send them individual commands.
            - Available commands: \#TODO: add and fix the commands
                - toggle_light
                - turn_on
                - turn_off
                - get_name
                - set_name
                - blink \#TODO: implement this and update.
        - **"/comm"** The default communication endpoint, this should have the id, act and token arguments, token for security. #\TODO: update after token is implemented.
        - **"/nodes"** Returns the connected nodes as json for your possible needs should also require a token. #\TODO: update after token is implemented.
        - **"/topology"** Displays a graphical representation of the mesh topology. \#TODO: implement this and update.

### Navigating the 3D Model
- Use your mouse or touchscreen to rotate and explore the 3D home model.
- Zoom in and out to get a better view of different areas of the home.

### Controlling Smart Devices
- Click on any button associated with a light, window blind or air conditioning to control that device.
- The camera will automatically focus and zoom in on the device for precise control.

### Entrance Camera
- The camera feed is live on the main interface.
- I can view the entrance in real-time to ensure my home's safety.

## Installation

To set up the Smart Home 3D Control System on your local machine, follow these steps:

Clone the repository:
```bash
git clone https://github.com/audiblemaple/Smart_home.git
cd Smart_home
npm start
```
This will run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## Build
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
