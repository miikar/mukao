import 'web-midi-api';

const initMidiHandler = (callback) => {
    console.log(callback);
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    
        function onMIDISuccess(midiAccess) {
            console.log('midiaccess')
            for (var input of midiAccess.inputs.values()) {
                input.onmidimessage = getMIDIMessage;
            }
        }
        
        function onMIDIFailure() {
            console.log('Could not access your MIDI devices.');
        }
    } else {
        console.log('WebMIDI is not supported in this browser.');
    }
    
    const getMIDIMessage = (message) => {
        var command = message.data[0];
        var note = message.data[1];
        var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
    
        switch (command) {
            case 144: // note on
                if (velocity > 0) {
                    callback(note - 36)();
                    console.log({note})
                } else {
                    // noteOff(note);
                }
                break;
            case 128: // note off
                // noteOffCallback(note);
                break;
            // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
        }
    }
}


export default initMidiHandler;