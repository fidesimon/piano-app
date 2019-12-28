import * as React from 'react';
import { WebMidi } from 'webmidi';
import { MIDIDevice } from './MIDIDevice';
import { connect, useDispatch } from 'react-redux';
import * as pianoActions from '../redux/actions/pianoActions';
import { bindActionCreators, Dispatch } from 'redux';

export interface PianoAppProps {
    onKeyPressed: (key: number) => void;
    key?: number;
}

export interface PianoAppState {
    keysPressed: number[];
}

export interface MIDINavigator extends Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}

class PianoApp extends React.Component<any, PianoAppState> {
    constructor(props: any) {
        super(props);
        this.state = { keysPressed: [] };
    }

    async connectMIDI(): Promise<any> {
        if ((navigator as MIDINavigator).requestMIDIAccess) {
            let midiAccess = await (navigator as MIDINavigator).requestMIDIAccess();
            let inputs = midiAccess.inputs.values();
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                if (input.value !== undefined) {
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
                    this.props.onKeyPressed(keyOn);
                    return;
                }
            // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                let keyOff = event.data[1];
                this.props.onKeyOff(keyOff);
                return;
        }
    }


    render() {
        let keys: number[] = this.props.piano.piano;
        return (
            <>
                Welcome
                <br />
                <MIDIDevice connected={false} refreshConnection={this.connectMIDI.bind(this)} />
                <br />
                <div>
                    Key pressed: <ul>
                        {keys.map((key) => {
                            return <div key={key}>{key}</div>
                        })}
                    </ul>
                </div>
            </>
        );
    }
}

function mapStateToProps(state: PianoAppState) {
    return { piano: state }
}

function incrementCounter() {

}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    onKeyPressed: pianoActions.onKeyPressed,
    onKeyOff: pianoActions.onKeyOff
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PianoApp)