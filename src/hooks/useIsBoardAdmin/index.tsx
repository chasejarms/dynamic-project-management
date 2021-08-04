import { useAppRouterParams } from "../useAppRouterParams";
import { useCompanyUser } from "../useCompanyUser";

export function useIsBoardAdmin() {
    const { boardId } = useAppRouterParams();

    const user = useCompanyUser();
    const isBoardAdmin = !!user?.boardRights[boardId]?.isAdmin;

    return isBoardAdmin;
}
