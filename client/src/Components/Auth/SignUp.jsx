import "./Login.css";
import userIcon from "../Assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import recordingIcon from "../Assets/recording.png";
import stopRecordingIcon from "../Assets/stopRecording.png";
const SignUp = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(0);
  const [isRecording, setRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState({
    /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
    audioBlobs: [] /*of type Blob[]*/,
    /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
    mediaRecorder: null /*of type MediaRecorder*/,
    /** Stores the reference to the stream currently capturing the audio*/
    streamBeingCaptured: null /*of type MediaStream*/,
    /** Start recording the audio
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () {
      //Feature Detection
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        //Feature is not supported in browser
        //return a custom error
        return Promise.reject(
          new Error(
            "mediaDevices API or getUserMedia method is not supported in this browser."
          )
        );
      } else {
        //Feature is supported in browser

        //create an audio stream
        return (
          navigator.mediaDevices
            .getUserMedia({ audio: true } /*of type MediaStreamConstraints*/)
            //returns a promise that resolves to the audio stream
            .then((stream) /*of type MediaStream*/ => {
              //save the reference of the stream to be able to stop it when necessary
              let newAudioRecorder = audioRecorder
              newAudioRecorder.streamBeingCaptured = stream;

              //create a media recorder instance by passing that stream into the MediaRecorder constructor
              newAudioRecorder.mediaRecorder = new MediaRecorder(
                stream
              ); /*the MediaRecorder interface of the MediaStream Recording
                  API provides functionality to easily record media*/
                  //clear previously saved audio Blobs, if any
                  newAudioRecorder.audioBlobs = [];
                  
                  //add a dataavailable event listener in order to store the audio data Blobs when recording
                  newAudioRecorder.mediaRecorder.addEventListener(
                    "dataavailable",
                    (event) => {
                      //store audio Blob object
                      newAudioRecorder.audioBlobs.push(event.data);
                    }
                  );
                  setAudioRecorder(newAudioRecorder)
                  console.log(audioRecorder.mediaRecorder);

              //start the recording by calling the start method on the media recorder
              audioRecorder.mediaRecorder.start();
            })
        );

        /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
      }
    },
    /** Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
      //return a promise that would return the blob or URL of the recording
      return new Promise((resolve) => {
        //save audio type to pass to set the Blob type
        let mimeType = audioRecorder.mediaRecorder.mimeType;

        //listen to the stop event in order to create & return a single Blob object
        audioRecorder.mediaRecorder.addEventListener("stop", () => {
          //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
          let audioBlob = new Blob(audioRecorder.audioBlobs, {
            type: mimeType,
          });

          //resolve promise with the single audio blob representing the recorded audio
          resolve(audioBlob);
        });

        //stop the recording feature
        audioRecorder.mediaRecorder.stop();

        //stop all the tracks on the active stream in order to stop the stream
        audioRecorder.stopStream();

        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
      });
    },
    stopStream: function () {
      //stopping the capturing request by stopping all the tracks on the active stream
      audioRecorder.streamBeingCaptured
        .getTracks() //get all tracks from the stream
        .forEach((track) /*of type MediaStreamTrack*/ => track.stop()); //stop each one
    },
    /** Reset all the recording properties including the media recorder and stream being captured*/
    resetRecordingProperties: function () {
      let newAudioRecorder = audioRecorder
      newAudioRecorder.mediaRecorder = null;
      newAudioRecorder.streamBeingCaptured = null;
      setAudioRecorder(newAudioRecorder)

      /*No need to remove event listeners attached to mediaRecorder as
    If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
    up by the garbage collector as well as any event handlers/listeners associated with it.
    getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
    },
    /** Cancel audio recording*/
    cancel: function () {
      //stop the recording feature
      audioRecorder.mediaRecorder.stop();

      //stop all the tracks on the active stream in order to stop the stream
      audioRecorder.stopStream();

      //reset API properties for next recording
      audioRecorder.resetRecordingProperties();
    },
  })
  const [userAudio, setUserAudio] = useState(null)
  const [userAudioAsBlob, setUserAudioAsBlob] = useState(null)
  const [message, setMessage] = useState('')
  function sendVoice(data , username, gender) {
    let formData = new FormData();
    let file = new File([data.blob], 'audio.mp3');
    console.log(file)
    formData.append('file', file);
    formData.append('username', username);
    formData.append('gender', gender);
    fetch("http://localhost:3001/voice/register", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // headers: {
      //   "Content-Type": `multipart/form-data`,
      // },
      
      body: formData,
    });
  }
 
  function startAudioRecording() {
    //start recording using the audio recording API
    audioRecorder
      .start()
      .then(() => {
        //on success
        console.log("Recording Audio...");
      })
      .catch((error) => {
        //on error
        //No Browser Support Error
        if (
          error.message.includes(
            "mediaDevices API or getUserMedia method is not supported in this browser."
          )
        ) {
          console.log("To record audio, use browsers like Chrome and Firefox.");
          //Error handling structure
          switch (error.name) {
            case "AbortError": //error from navigator.mediaDevices.getUserMedia
              console.log("An AbortError has occured.");
              break;
            case "NotAllowedError": //error from navigator.mediaDevices.getUserMedia
              console.log(
                "A NotAllowedError has occured. User might have denied permission."
              );
              break;
            case "NotFoundError": //error from navigator.mediaDevices.getUserMedia
              console.log("A NotFoundError has occured.");
              break;
            case "NotReadableError": //error from navigator.mediaDevices.getUserMedia
              console.log("A NotReadableError has occured.");
              break;
            case "SecurityError": //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
              console.log("A SecurityError has occured.");
              break;
            case "TypeError": //error from navigator.mediaDevices.getUserMedia
              console.log("A TypeError has occured.");
              break;
            case "InvalidStateError": //error from the MediaRecorder.start
              console.log("An InvalidStateError has occured.");
              break;
            case "UnknownError": //error from the MediaRecorder.start
              console.log("An UnknownError has occured.");
              break;
            default:
              console.log("An error occured with the error name " + error.name);
          }
        }
      });
  }
  /** Stops the currently started audio recording
   */

  function StopAudioRecording() {
    //stop the recording using the audio recording API
    console.log("Stopping Audio Recording...");
    console.log(audioRecorder.mediaRecorder)
    audioRecorder
      .stop()
      .then((audioAsblob) => {
        //stopping makes promise resolves to the blob file of the recorded audio
        console.log("stopped with audio Blob:", audioAsblob);
        setUserAudioAsBlob(audioAsblob)
        setUserAudio(URL.createObjectURL(audioAsblob))
       
        //Do something with the recorded audio
        // sendVoice()
        //...
      })
      .catch((error) => {
        //Error handling structure
        console.log(error);
        switch (error.name) {
          case "InvalidStateError": //error from the MediaRecorder.stop
            console.log("An InvalidStateError has occured.");
            break;
          default:
            console.log("An error occured with the error name " + error.name);
        }
      });
    // ...
  }
  async function formSubmit (event) {
event.preventDefault();
const data = new FormData(event.target)
const username = data.get('username');
if(userAudioAsBlob === null){
  setMessage('No voice data sent');
  return;
}
    sendVoice(userAudioAsBlob, username, 'M');

  }
  return (
    <div className="wrapper fadeInDown">
      {steps === 0 && (
        <div id="formContent">
          {/* <!-- Tabs Titles --> */}
          <h2 className="inactive" onClick={() => navigate("/login")}>
            {" "}
            Sign In{" "}
          </h2>
          <h2 className="active underlineHover">Sign Up </h2>

          {/* <!-- Icon --> */}
          <div className="fadeIn first">
            <img
              src={userIcon}
              id="icon"
              alt="User Icon"
              className="userIcon"
            />
          </div>

          {/* <!-- Login Form --> */}
          <h2>Welcome!! Let's get you started </h2>
          <div>
            {" "}
            First we are gonna need some sample of your voice. Whenever you are
            ready, click on the recording button and read the short story below
            from top to bottom
          </div>
          <div className="short-story-wrapper">
            <div className="short-story-text">
              Title: The Forgotten Note In the quaint town of Willow Creek,
              there was a hidden treasure, the old Willow Inn. Its walls echoed
              with the laughter of bygone days. One stormy evening, young Lily
              stumbled upon the inn while seeking shelter. Inside, she
              discovered a dusty piano. Curious, she brushed off the keys and
              played a haunting melody. Suddenly, a hidden compartment revealed
              an old, yellowed note. It spoke of lost love and shattered dreams.
              As Lily read, she felt a pang of empathy for the writer's sorrow.
              Determined to bring closure, she set out to find the author.
              Through winding alleys and forgotten memories, Lily uncovered the
              writer's identity – an elderly man named Henry. Tears welled in
              his eyes as Lily handed him the note. It was a love letter he had
              written decades ago but never sent. With trembling hands, Henry
              read his own words, and in that moment, he found peace. As the
              storm cleared, Lily left the inn, leaving behind a legacy of
              healing and forgiveness.
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
             console.log(e)
             formSubmit(e)
            }}
          >
            <input
              type="text"
              id="login"
              className="fadeIn second"
              name="username"
              placeholder="username"
            />
            <div>
              {isRecording === false && (
                <img
                  className="recording"
                  src={recordingIcon}
                  alt="Recording Icon"
                  onClick={() => {
                    if (!isRecording) {
                      // startRecording();
                      startAudioRecording();
                    }
                    setRecording(!isRecording);
                  }}
                />
              )}
              {isRecording === true && (
                <img
                  className="recording"
                  src={stopRecordingIcon}
                  alt="Stop recording Icon"
                  onClick={() => {
                    StopAudioRecording();

                    setRecording(!isRecording);
                  }}
                />
              )}
              {/* <AudioRecorder
              onRecordingComplete={(data)=> console.log(data)}
              audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={true}
      downloadFileExtension="webm"/> */}
            </div>
            <audio src={userAudio} controls>
Your browser does not support the audio element.
</audio>
            <input type="submit" className="fadeIn fourth" value="Sign Up" />
            <div className="error">{message}</div>
          </form>
          <button onClick={()=> {
            console.log(audioRecorder.mediaRecorder)
          }}>DEBUGGING</button>

          {/* <!-- Remind Passowrd --> */}
          <div id="formFooter">
            <a className="underlineHover" href="#">
              Forgot Password?
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignUp;
