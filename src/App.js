import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client';

const commands = {
  volume: ({ value }) => `Hey Google, Set the volume to ${value} percent.`,
  sleep: ({ sound = 'ocean', time }) => {
    const timeString = (time && time.unit && time.time) ? `for ${time.time} ${time.unit}s` : ''
    return `Hey Google, play ${sound} sounds ${timeString}`
  },
  loadedClient: () => `Client loaded`,
  stop: () => `Ok Google, stop`,
  play: () => `Ok Google, play`,
  spotify: ({ user = '' }) => `Ok Google, play ${user} spotify`,
}

class App extends Component {
  componentDidMount() {
    const socket = openSocket('https://google-home-remote-server.herokuapp.com/');
    socket.on('command', data => {
      console.log({ data });
      if(commands[data.name]) {
        this.speak(commands[data.name](data));
      } else {
        this.speak('Command not found');
      }
    })
  }

  speak(string) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(string);
    utterThis.voice = synth.getVoices()[0];
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Remote Listener</h1>
        </header>
      </div>
    );
  }
}

export default App;
