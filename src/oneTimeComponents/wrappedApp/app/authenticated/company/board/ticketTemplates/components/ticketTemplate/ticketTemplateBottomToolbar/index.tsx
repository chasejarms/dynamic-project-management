import { BottomPageToolbar } from "../../../../../components/bottomPageToolbar";
import {
    ITicketTemplateBottomToolbarLogicProps,
    useTicketTemplateBottomToolbarLogic,
} from "./hooks/useTicketTemplateBottomToolbarLogic";

export function TicketTemplateBottomToolbar(
    props: ITicketTemplateBottomToolbarLogicProps
) {
    const {
        leftWrappedButtonProps,
        rightWrappedButtonProps,
    } = useTicketTemplateBottomToolbarLogic(props);

    return (
        <BottomPageToolbar
            leftWrappedButtonProps={leftWrappedButtonProps}
            rightWrappedButtonProps={rightWrappedButtonProps}
        />
    );
}
