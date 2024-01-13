import React, {useEffect, useState} from 'react';
import "./MeshStyle.css"
import TextField from "../../elements/TextField/TextField";
function MeshLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    document.title = 'Mesh Control panel login';

    // TODO: implement websocket sending message
    const logIn = () =>{
        // TODO: add input validation
        const message = {
            type: "credentials",
            username,
            password
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                console.log('Enter key pressed');
                logIn();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });
    return (
        <>
            <div className="centered-div">
                <h2 id="label">Mesh login</h2>
                    <TextField placeholder="username" setText={setUsername}></TextField>
                    <TextField placeholder="password" setText={setPassword}></TextField>
                    <button onClick={logIn} > Login </button>

                <a className="forgot" href="http://notimplemented.com">
                    Forgot password
                </a>
            </div>
        </>
    );
}

export default MeshLogin;