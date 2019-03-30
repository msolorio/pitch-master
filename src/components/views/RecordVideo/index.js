import React from 'react';
import VimeoUpload from './vimeo-upload';

class RecordVideoView extends React.Component {
  constructor(props) {
    super(props);

    this.handleRecordClick = this.handleRecordClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.getVideoRecordControls = this.getVideoRecordControls.bind(this);
    this.handleSendToChange = this.handleSendToChange.bind(this);

    this.videoRef = React.createRef();
    this.recordedVideoRef = React.createRef();
    
    // using React state to handle ui interactions limited to only this component
    // Redux should be used for higher level data storage
    this.state = {
      videoRecorded: false,
      videoRecording: false,
      sendToValue: ''
    };
  }

  componentDidMount() {
    this.initializeMediaRecorder();
  }

  browserHasGetUserMedia() {
    return !!(
      navigator.mediaDevices
      && navigator.mediaDevices.getUserMedia
    );
  }

  initializeMediaRecorder() {
    if (this.browserHasGetUserMedia()) {
      navigator.mediaDevices.getUserMedia ({
        video: true,
        audio: true
      }).then((stream) => {
        const options = {mimeType: 'video/webm; codecs=vp9'};
        this.stream = stream;

        this.mediaRecorder = new MediaRecorder(stream, options);
        let chunks = [];

        this.videoRef.current.srcObject = this.stream;

        this.mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        }

        this.mediaRecorder.onstop = (e) => {
          this.setState({
            videoRecorded: true,
            videoRecording: false
          });

          this.blob = new Blob(chunks, {type: 'video/webm'});
          chunks = [];
          this.recordedVideoRef.current.src = window.URL.createObjectURL(this.blob);
          this.recordedVideoRef.current.srcObject = null;
        }
      }).catch((err) => {
        console.error(`error creating a media object: ${err}`);
      });
    } else {
      console.log('Video recording is not supported on your browser. Please use Chrome.');
    }
  }

  handleRecordClick() {
    this.setState({videoRecording: true});
    this.mediaRecorder.start();
  }

  handleStopClick() {
    this.mediaRecorder.stop();
  }

  handleSaveClick() {
    this.setState({videoRecorded: false});

    var uploader = new VimeoUpload({
      file: this.blob,
      token: "0000" // put the actual vimeo API key here
    });
    uploader.upload();

    this.initializeMediaRecorder(); // without this the video will not reset to the record video view
  }

  handleSendToChange(e) {
    this.setState({sendToValue: e.target.value});
  }

  handleDeleteClick() {
    this.setState({videoRecorded: false});
    this.initializeMediaRecorder(); // without this the video will not reset to the record video view
  }

  getVideoRecordControls() {
    const stopRecordingGroup = (
      <div>
        <label htmlFor="stop-record">Stop</label>
        <button name="stop-record"
          onClick={this.handleStopClick} />
      </div>
    );

    const startRecordingGroup = (
      <div>
        <label htmlFor="record">Record</label>
        <button name="record"
          onClick={this.handleRecordClick} />
      </div>
    );

    if (this.state.videoRecording) return stopRecordingGroup;
    return startRecordingGroup;
  }

  render() {
    const PlaybackView = (
      <div>
        <video ref={this.recordedVideoRef} controls width={320} />
        <div>
          <div>
            <label htmlFor="save">Save</label>
            <button name="save"
              onClick={this.handleSaveClick}/>
              <label htmlFor="sendto">Send To: </label>
            <input name="sendto" onChange={this.handleSendToChange} value={this.state.sendToValue} />
          </div>
          <div>
            <label htmlFor="delete">Delete</label>
            <button name="delete"
              onClick={this.handleDeleteClick}/>
          </div>
        </div>
      </div>
    );

    const RecordView = (
      <div>
        <video ref={this.videoRef} autoPlay muted />
        {this.getVideoRecordControls()}
      </div>
    );

    if (this.state.videoRecorded) return PlaybackView;
    return RecordView;
  }
}

export default RecordVideoView;