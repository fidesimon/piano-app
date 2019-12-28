import * as React from 'react';
import { WebMidi } from 'webmidi';
import { MIDIDevice } from './MIDIDevice';
import { connect } from 'react-redux';
import * as pianoActions from '../redux/actions/pianoActions';
import { bindActionCreators, Dispatch } from 'redux';
import PianoKeyboard from './PianoKeyboard';

export interface PianoAppProps {
    onKeyPressed: (key: number) => void;
    key?: number;
}

export interface MIDINavigator extends Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}

class PianoApp extends React.Component<any, {}> {
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
        let keys: number[] = this.props.piano.piano.keysPressed;
        let sigs: string[] = this.props.piano.piano.signatures;
        return (
            <>
                Welcome
                <br />
                <MIDIDevice connected={false} refreshConnection={this.connectMIDI.bind(this)} />
                <br />
                <div>
                    Key pressed: <ul>
                        {sigs.map((key) => {
                            return <div style={{display: 'none'}} key={key}>{key}</div>
                        })}
                    </ul>
                </div>
                {sigs.length > 0 ? <PianoKeyboard keysPressed={this.props.piano.piano.signatures} /> : <PianoKeyboard keysPressed={[]} />}
                
            </>
        );
    }
}

function mapStateToProps(state: any) {
    return { piano: state }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    onKeyPressed: pianoActions.onKeyPressed,
    onKeyOff: pianoActions.onKeyOff
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PianoApp)