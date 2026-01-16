import { useCallback, useState } from "react";
import { useEventListener } from "./useEventListener";

export function useKeyPress(targetKey: string) {
    const [pressed, setPressed] = useState(false);

    const downHandler = useCallback((e: KeyboardEvent) => {
        if (e.key === targetKey) setPressed(true);
    }, [targetKey]);

    const upHandler = useCallback((e: KeyboardEvent) => {
        if (e.key === targetKey) setPressed(false);
    }, [targetKey]);

    useEventListener('keydown', downHandler);
    useEventListener('keyup', upHandler);
    
    return pressed;
}