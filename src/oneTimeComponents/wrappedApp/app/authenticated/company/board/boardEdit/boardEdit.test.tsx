import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardEditInnerContent } from ".";
import * as useIndividualBoardColumnEditStateModule from "./hooks/useIndividualBoardColumnEditState";
import * as useBoardColumnEditStateModule from "./hooks/useBoardColumnEditState";
import { editableColumnCardTestsIds } from "./components/editableColumnCard/editableColumnCard.testIds";
import { uncategorizedColumnReservedId } from "../../../../../../../constants/reservedColumnIds";
import { IColumn } from "../../../../../../../models/column";
import { RouteCreator } from "../../../../utils/routeCreator";
import { MemoryRouter } from "react-router-dom";

describe("Board Edit", () => {
    let useIndividualBoardColumnEditStateReturnType: useIndividualBoardColumnEditStateModule.IUseIndividualBoardColumnEditStateReturnType;
    let useBoardColumnEditStateReturnType: useBoardColumnEditStateModule.IUseBoardColumnEditStateReturnType;
    let columns: IColumn[] = [];

    beforeEach(() => {
        columns = [
            {
                id: uncategorizedColumnReservedId,
                canBeModified: false,
                name: "Uncategorized",
            },
            {
                id: "1",
                canBeModified: true,
                name: "To Do",
            },
        ];

        useIndividualBoardColumnEditStateReturnType = {
            nameError: "",
            id: "1",
            name: "To Do",
            canBeModified: true,
            onDeleteColumn: () => () => null,
            onUpdateColumn: () => () => null,
            onClickAddAfter: () => () => null,
        };

        useBoardColumnEditStateReturnType = {
            isInErrorState: false,
            columnDataHasChanged: false,
            localColumnControls: columns.map((column) => {
                return {
                    ...column,
                    nameError: "",
                };
            }),
            navigateBackToBoard: () => null,
            disableDeleteButton: false,
            onDragEnd: () => null,
            isLoadingColumns: false,
            resetChanges: () => null,
            saveColumns: () => null,
            isSavingColumns: false,
            failedToLoadColumnData: false,
        };

        jest.spyOn(
            useIndividualBoardColumnEditStateModule,
            "useIndividualBoardColumnEditState"
        ).mockImplementation(() => {
            return useIndividualBoardColumnEditStateReturnType;
        });

        jest.spyOn(
            useBoardColumnEditStateModule,
            "useBoardColumnEditState"
        ).mockImplementation(() => {
            return useBoardColumnEditStateReturnType;
        });
    });

    describe("the user types in the column name input box", () => {
        it("should invoke the onUpdateColumn method", () => {
            let onUpdateWasCalled = false;
            useIndividualBoardColumnEditStateReturnType.onUpdateColumn = () => () => {
                onUpdateWasCalled = true;
            };

            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            const input = screen.getAllByTestId(
                editableColumnCardTestsIds.nameTextField.input
            )[0];
            userEvent.type(input, "a");
            expect(onUpdateWasCalled).toBe(true);
        });
    });
});
