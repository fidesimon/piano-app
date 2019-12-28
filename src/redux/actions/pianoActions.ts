export function onKeyPressed(key: number){
    return { type: "KEY_ON", key };
}

export function onKeyOff(key: number){
    return { type: "KEY_OFF", key };
}