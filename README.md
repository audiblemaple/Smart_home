# Smart Home 3D Control System

Welcome to my Smart Home 3D Control System repository.\
This project is designed to provide an intuitive interface for managing and interacting with custom microcontrollers that are set up in my house.\
The interface includes a 3D model of a home where users can visually navigate to different areas and control smart devices such as lights and window blinds.\
It also features a live camera feed from the entrance door for security and monitoring.\
**Currently, for security measures everything is functional only when connected to my houses WI-FI network.**

## Features

- **3D Home Model**: A detailed 3D representation of my home using `<model-viewer>` for an immersive experience.
- **Interactive Controls**: Buttons placed within the 3D model allow users to control lights and window blinds in the corresponding real-world locations. | **No Physical control yet**
- **Focus and Zoom**: Upon clicking a control button, the view zooms in on the selected device, allowing for a closer look and easier control.
- **Entrance Camera**: A real-time camera feed from the entrance door is available to monitor who is entering or leaving the home.

## How to Use

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
