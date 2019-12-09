import * as React from 'react';
import { render } from '@testing-library/react';

export interface MIDIDeviceProps {
    connected: boolean;
    refreshConnection: Function;
}

export interface MIDIDeviceState {
    isConnected: boolean;
    connectionDetails?: WebMidi.MIDIInput;
}

export class MIDIDevice extends React.Component<MIDIDeviceProps, MIDIDeviceState>{
    constructor(props: any){
        super(props);
        this.state = {
            isConnected: false
        }
    }

    componentWillMount(){
        this.refreshHandler();
    }

    async refreshHandler(): Promise<any> {
        let connection = await this.props.refreshConnection() as WebMidi.MIDIInput;
        if(connection !== undefined){
            this.setState({isConnected: true, connectionDetails: connection});
        }
    }

    render() {
        return (
            <>
                <div className="connection-status">
                    { this.state.isConnected ? 
                        <>
                            <span>Connected to MIDI Device:</span><br />
                            <span><b>{this.state.connectionDetails === undefined ? '' : this.state.connectionDetails.name}</b></span>
                        </>
                        :
                        <span onClick={() => this.refreshHandler()}>Click to refresh the connection</span>
                    }
                </div>
            </>
        );
    }
} 