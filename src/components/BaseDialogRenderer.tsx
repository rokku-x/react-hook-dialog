import storeDialog from "@/store/dialog";
import { UseHookDialogConfig } from "@/types";
import { BaseModalRenderer, ModalWindowProps } from "@rokku-x/react-hook-modal";
import { useEffect } from "react";


// Wrapper around the base modal renderer to set default config
// BaseModalRenderer can still be used directly, but this wrapper allows setting defaultConfig via props
/**
 * Wrapper component around the BaseModalRenderer to set default dialog configuration.
 * @param props - Component props
 * @param props.defaultConfig - Default configuration applied to all dialogs rendered by this component
 * @param rest - Other props passed to BaseModalRenderer
 * 
 * @internal
 */
export default function BaseDialogRenderer({ defaultConfig, ...rest }: ModalWindowProps & { defaultConfig?: UseHookDialogConfig }) {
    const { setDefaultConfig } = storeDialog();

    useEffect(() => {
        setDefaultConfig(defaultConfig || {});
    }, [defaultConfig]);

    return <BaseModalRenderer {...rest} />
}