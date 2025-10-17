import type React from "react";
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type UsePortalOptions = Partial<{
    onEnter: () => void;
    onLeave: () => void;
}>;

export function usePortal({ onEnter, onLeave }: UsePortalOptions = {}): [
    React.ComponentType<PropsWithChildren>,
    React.RefCallback<HTMLDivElement>,
] {
    const [el, setEl] = useState<HTMLDivElement>();

    const enter = useRef(onEnter);
    enter.current = onEnter;

    const leave = useRef(onLeave);
    leave.current = onLeave;

    const PortalWrapper = useCallback(
        ({ children }: PropsWithChildren) => {
            if (!el) return null;
            return createPortal(children, el);
        },
        [el],
    );

    useEffect(() => {
        if (!el) return;
        enter.current?.();
        return () => leave.current?.();
    }, [el]);

    return [PortalWrapper, setEl];
}
