interface PianoState {
    keysPressed: number[];
    signatures: string[];
}

export default function pianoReducer(state = {keysPressed: [], signatures: []}, action: any) {
    switch (action.type) {
        case "KEY_ON":
            let newState: number[] = [...state.keysPressed];
            newState.push(action.key as number);
            let newSignatures: string[] = newState.map((key) => getKeySignature(key));
            return {
                ...state,
                keysPressed: newState,
                signatures: newSignatures
            }
        case "KEY_OFF":
            let newState2: number[] = [...state.keysPressed];
            let index = newState2.indexOf(action.key as number);
            newState2.splice(index, 1);
            let newSignatures2: string[] = newState2.map((key) => getKeySignature(key));
            return {
                ...state,
                keysPressed: newState2,
                signatures: newSignatures2
            }
        default:
            return state;
    }
}

const keys = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'];

function getKeySignature(keyId: number){
    return keys[keyId%12];
}