import React from 'react';

class RecordVideoView extends React.Component {
  constructor(props) {
    super(props);

    this.handleRecordClick = this.handleRecordClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.getVideoRecordControls = this.getVideoRecordControls.bind(this);

    this.videoRef = React.createRef();
    this.recordedVideoRef = React.createRef();
    
    this.state = {
      videoRecorded: false,
      videoRecording: false
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
      console.log('getUserMedia not supported on your browser!');
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
    this.initializeMediaRecorder();
    this.setState({videoRecorded: false});
  }

  handleDeleteClick() {
    this.initializeMediaRecorder();
    this.setState({videoRecorded: false});
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