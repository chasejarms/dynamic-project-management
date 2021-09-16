import { useAppRouterParams } from "../../../../../../../../hooks/useAppRouterParams";
import { useCompanyUser } from "../../../hooks/useCompanyUser";

export function useIsBoardAdmin() {
    const { boardId } = useAppRouterParams();

    const user = useCompanyUser();
    const isBoardAdmin = !!user?.boardRights[boardId]?.isAdmin;

    return isBoardAdmin;
}
