import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { usePortal } from "./usePortal";

export const DialogPortal = observer(({ id, children }: PropsWithChildren<{ id: string }>) => {
    const { dialogs, setDialogView, dialogClose } = useStore();
    const [PortalWrapper, portalRef] = usePortal({ onLeave: () => dialogClose(id) });

    const portal = useMemo(() => <div ref={portalRef} />, [portalRef]);

    useEffect(() => {
        setDialogView(id, portal);
    }, [id, portal, setDialogView]);

    if (dialogs[id] instanceof Dialog) {
        return <PortalWrapper key={id}>{children}</PortalWrapper>;
    }

    return <>{children}</>;
});
