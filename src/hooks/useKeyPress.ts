import { useState } from "react";
import { useEventListener } from "./useEventListener";

export function useKeyPress(targetKey: string) {
    const [pressed, setPressed] = useState(false);

    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === targetKey) setPressed(true);
    });
    useEventListener("keyup", (e: KeyboardEvent) => {
        if (e.key === targetKey) setPressed(false);
    });
    return pressed;
}