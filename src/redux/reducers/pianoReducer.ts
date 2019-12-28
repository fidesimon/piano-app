export default function pianoReducer(state = [], action: any) {
    switch (action.type) {
        case "KEY_ON":
            let newState: number[] = [...state];
            newState.push(action.key as number);
            return newState;
        case "KEY_OFF":
            let newState2: number[] = [...state];
            let index = newState2.indexOf(action.key as number);
            newState2.splice(index, 1);
            return newState2;
        default:
            return state;
    }
}