import * as React from 'react';
import {WebMidi} from 'webmidi';
import { MIDIDevice } from './MIDIDevice';

export interface PianoAppProps{
    
}

export interface PianoAppState{
    keysPressed: number[];
}

export interface MIDINavigator extends Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}

export default class PianoApp extends React.Component<PianoAppProps, PianoAppState> {
    constructor(props: PianoAppProps){
        super(props);
        this.state = {keysPressed: []};
    }

    async connectMIDI() : Promise<any>{
        if((navigator as MIDINavigator).requestMIDIAccess) {
            let midiAccess = await (navigator as MIDINavigator).requestMIDIAccess();
            let inputs = midiAccess.inputs.values();
            let midiDeviceName = null;
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                if(input.value !== undefined){
                    input.value.onmidimessage = this.MIDIMessageEventHandler.bind(this);
                    return input.value;
                }
            }
        }
    }

    MIDIMessageEventHandler(event: any) {
        // Mask off the lower nibble (MIDI channel, which we don't care about)
        switch (event.data[0] & 0xf0) {
            case 0x90:
                if (event.data[2] != 0) {  // if velocity != 0, this is a note-on message
                    let keyOn = event.data[1];
                    console.log(`Note played: ${keyOn}`);
                    let keys = this.state.keysPressed;
                    keys.push(keyOn)
                    this.setState({ keysPressed: keys});
                    return;
                }
            // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                let keyOff = event.data[1];
                console.log(`Note off: ${keyOff}`);
                let keys = this.state.keysPressed;
                let index = keys.indexOf(keyOff);
                keys.splice(index, 1);
                this.setState({ keysPressed: keys});
                return;
        }
    }


    render(){
        return (
            <>
                Welcome
                <br />
                <MIDIDevice connected={false} refreshConnection={this.connectMIDI.bind(this)} />
                <br />
                <div>
                    Keys pressed: <ul>
                        {this.state.keysPressed.map((key) => {
                            return <div key={key}>{key}</div>
                        })}
                    </ul>
                </div>
            </>
        );
    }
}