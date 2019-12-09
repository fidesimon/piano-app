import * as React from 'react';
import {WebMidi} from 'webmidi';

export interface PianoAppProps{
    
}

export interface PianoAppState{

}

export interface MIDINavigator extends Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}

export default class PianoApp extends React.Component<PianoAppProps, PianoAppState> {
    private audioContext: AudioContext = new AudioContext();
    private midiAccess: any;

    constructor(props: PianoAppProps){
        super(props);
    }

    componentWillMount(){
        if((navigator as MIDINavigator).requestMIDIAccess) {
            (navigator as MIDINavigator).requestMIDIAccess().then(this.onMIDIInit.bind(this), this.onMIDIReject.bind(this));
        }
    }

    onMIDIInit(midi: any) {
        console.log('midi init.');
        this.midiAccess = midi;
        let name = "";

        var haveAtLeastOneDevice = false;
        var inputs = this.midiAccess.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = this.MIDIMessageEventHandler.bind(this);
            name = input.value.name;
            haveAtLeastOneDevice = true;
        }
        if (!haveAtLeastOneDevice) {
            console.log("No devices plugged.");
        } else {
            var input = inputs[0];
            console.log("Device connected. " + name);
        }
    }

    onMIDIReject(err: any) {
        console.log("The MIDI system failed to start.");
    }

    MIDIMessageEventHandler(event: any) {
        // Mask off the lower nibble (MIDI channel, which we don't care about)
        switch (event.data[0] & 0xf0) {
            case 0x90:
                if (event.data[2] != 0) {  // if velocity != 0, this is a note-on message
                    console.log("Note played: " + event.data[1]);
                    return;
                }
            // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                console.log("Note off: " + event.data[1]);
                return;
        }
    }


    render(){
        return (
            <>
                Welcome
            </>
        );
    }
}