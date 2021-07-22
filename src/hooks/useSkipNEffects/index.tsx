import { useRef, useEffect, useState } from "react";

export function useSkipNEffects(
    n: number,
    callback: () => void,
    dependencies: any[]
) {
    const [numberOfEffectInvocations, setNumberOfEffectInvocations] = useState(
        0
    );

    useEffect(() => {
        if (numberOfEffectInvocations < n) {
            setNumberOfEffectInvocations(
                (previousInvocations) => previousInvocations + 1
            );
        } else {
            callback();
        }
    }, [...dependencies]);
}
