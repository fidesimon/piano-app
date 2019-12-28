import * as React from 'react';
import '../App.css';

class PianoKeyboard extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        let props = this.props.keysPressed;
        return (
            <>
                <ul className="set piano-ul">
                    <li className={(props.indexOf("f") !== -1 ? "pressed " : "") + "piano white f"}></li>
                    <li className={(props.indexOf("fs") !== -1 ? "pressed " : "") + "piano black fs"}></li>
                    <li className={(props.indexOf("g") !== -1 ? "pressed " : "") + "piano white g"}></li>
                    <li className={(props.indexOf("gs") !== -1 ? "pressed " : "") + "piano black gs"}></li>
                    <li className={(props.indexOf("a") !== -1 ? "pressed " : "") + "piano white a"}></li>
                    <li className={(props.indexOf("as") !== -1 ? "pressed " : "") + "piano black as"}></li>
                    <li className={(props.indexOf("b") !== -1 ? "pressed " : "") + "piano white b"}></li>
                    <li className={(props.indexOf("c") !== -1 ? "pressed " : "") + "piano white c"}></li>
                    <li className={(props.indexOf("cs") !== -1 ? "pressed " : "") + "piano black cs"}></li>
                    <li className={(props.indexOf("d") !== -1 ? "pressed " : "") + "piano white d"}></li>
                    <li className={(props.indexOf("ds") !== -1 ? "pressed " : "") + "piano black ds"}></li>
                    <li className={(props.indexOf("e") !== -1 ? "pressed " : "") + "piano white e"}></li>
                </ul>
            </>
        );
    }
}

export default (PianoKeyboard)