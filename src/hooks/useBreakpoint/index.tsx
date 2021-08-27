import React, {
    useState,
    useLayoutEffect,
    createContext,
    useContext,
} from "react";

const defaultValue = {};

const BreakpointContext = createContext(defaultValue);

interface IQueryNameGeneric<T> {
    max768: T;
    between768And993: T;
    min993: T;
    min1200: T;
}

type QueryGenericKeyOf = keyof IQueryNameGeneric<any>;
type IQueriesProp = IQueryNameGeneric<string>;
type IUseQueryReturnValue = IQueryNameGeneric<boolean>;

interface IBreakpointProviderProps {
    children: React.ReactNode;
    queries: IQueriesProp;
}

const BreakpointProvider = ({
    children,
    queries,
}: IBreakpointProviderProps) => {
    const [queryMatch, setQueryMatch] = useState({});

    useLayoutEffect(() => {
        const mediaQueryLists: {
            [queryName: string]: MediaQueryList;
        } = {};
        const keys = Object.keys(queries);
        let isAttached = false;

        const handleQueryListener = () => {
            const updatedMatches = keys.reduce<{
                [queryName: string]: boolean;
            }>((acc, media) => {
                acc[media] = !!(
                    mediaQueryLists[media] && mediaQueryLists[media].matches
                );
                return acc;
            }, {});
            setQueryMatch(updatedMatches);
        };

        if (window && window.matchMedia) {
            const matches: {
                [queryName: string]: boolean;
            } = {};
            keys.forEach((media) => {
                const castMedia = media as QueryGenericKeyOf;
                if (typeof queries[castMedia] === "string") {
                    mediaQueryLists[media] = window.matchMedia(
                        queries[castMedia]
                    );
                    matches[media] = mediaQueryLists[media].matches;
                } else {
                    matches[media] = false;
                }
            });
            setQueryMatch(matches);
            isAttached = true;
            keys.forEach((media) => {
                const castMedia = media as QueryGenericKeyOf;
                if (typeof queries[castMedia] === "string") {
                    mediaQueryLists[media].addListener(handleQueryListener);
                }
            });
        }

        return () => {
            if (isAttached) {
                keys.forEach((media) => {
                    const castMedia = media as QueryGenericKeyOf;

                    if (typeof queries[castMedia] === "string") {
                        mediaQueryLists[media].removeListener(
                            handleQueryListener
                        );
                    }
                });
            }
        };
    }, [queries]);

    return (
        <BreakpointContext.Provider value={queryMatch}>
            {children}
        </BreakpointContext.Provider>
    );
};

function useBreakpoint() {
    const context = useContext(BreakpointContext) as IUseQueryReturnValue;
    if (context === defaultValue) {
        throw new Error("useBreakpoint must be used within BreakpointProvider");
    }
    return context;
}
export { useBreakpoint, BreakpointProvider };
