import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardEditInnerContent } from ".";
import * as useIndividualBoardColumnEditStateModule from "./hooks/useIndividualBoardColumnEditState";
import * as useBoardColumnEditStateModule from "./hooks/useBoardColumnEditState";
import { editableColumnCardTestIds } from "./components/editableColumnCard/editableColumnCard.testIds";
import { uncategorizedColumnReservedId } from "../../../../../../../constants/reservedColumnIds";
import { IColumn } from "../../../../../../../models/column";
import { RouteCreator } from "../../../../utils/routeCreator";
import { MemoryRouter } from "react-router-dom";
import { boardEditTestIds } from "./boardEdit.testIds";

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
                editableColumnCardTestIds.nameTextField.input
            )[0];
            userEvent.type(input, "a");
            expect(onUpdateWasCalled).toBe(true);
        });
    });

    describe("the canBeModified field is false", () => {
        it("should disable the input", () => {
            useIndividualBoardColumnEditStateReturnType.canBeModified = false;
            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            const input = screen.getAllByTestId(
                editableColumnCardTestIds.nameTextField.input
            )[0];
            expect(input).toHaveClass("Mui-disabled");
        });
    });

    describe("the canBeModified field is true", () => {
        it("should enable the input", () => {
            useIndividualBoardColumnEditStateReturnType.canBeModified = true;
            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            const input = screen.getAllByTestId(
                editableColumnCardTestIds.nameTextField.input
            )[0];
            expect(input).not.toHaveClass("Mui-disabled");
        });
    });

    it("should display the name in the header and in the input", () => {
        render(
            <MemoryRouter
                initialEntries={[RouteCreator.editBoard("123", "456")]}
            >
                <BoardEditInnerContent />
            </MemoryRouter>
        );

        const toDoTextOccurences = screen.getAllByText("To Do");
        /*
        two because our mock returns the same column twice and this method gets
        both of those headers
        */
        expect(toDoTextOccurences.length).toBe(2);
        const input = screen.getAllByTestId(
            editableColumnCardTestIds.nameTextField.input
        )[0] as HTMLInputElement;
        expect(input.value).toBe("To Do");
    });

    it("should hide the delete button for the uncategorized column", () => {
        useIndividualBoardColumnEditStateReturnType.id = uncategorizedColumnReservedId;
        render(
            <MemoryRouter
                initialEntries={[RouteCreator.editBoard("123", "456")]}
            >
                <BoardEditInnerContent />
            </MemoryRouter>
        );

        const deleteButtons = screen.queryByTestId(
            editableColumnCardTestIds.deleteButton
        );
        expect(deleteButtons).toBeNull();
    });

    it("should hide the delete button for all columns except for the uncategorized column", () => {
        useIndividualBoardColumnEditStateReturnType.id = "1";
        render(
            <MemoryRouter
                initialEntries={[RouteCreator.editBoard("123", "456")]}
            >
                <BoardEditInnerContent />
            </MemoryRouter>
        );

        screen.getAllByTestId(editableColumnCardTestIds.deleteButton);
    });

    describe("there is an error on the name", () => {
        it("should show the error", () => {
            useIndividualBoardColumnEditStateReturnType.nameError =
                "Name Error";
            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            screen.getAllByText("Name Error");
        });
    });

    describe("the user clicks the delete button", () => {
        it("should invoke the onDeleteColumn method", () => {
            let onDeleteWasCalled = false;
            useIndividualBoardColumnEditStateReturnType.onDeleteColumn = () => () => {
                onDeleteWasCalled = true;
            };

            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            const deleteButton = screen.getAllByTestId(
                editableColumnCardTestIds.deleteButton
            )[0];
            userEvent.click(deleteButton);
            expect(onDeleteWasCalled).toBe(true);
        });
    });

    describe("the user clicks the on add after button", () => {
        it("should invoke the onClickAddAfter method", () => {
            let onClickAddAfterWasCalled = false;
            useIndividualBoardColumnEditStateReturnType.onClickAddAfter = () => () => {
                onClickAddAfterWasCalled = true;
            };

            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            const addButton = screen.getAllByTestId(
                editableColumnCardTestIds.addButton
            )[0];
            userEvent.click(addButton);
            expect(onClickAddAfterWasCalled).toBe(true);
        });
    });

    describe("Save Button", () => {
        describe("isInErrorState is true, isSavingColumns is false, and column data changed", () => {
            it("should disable the save changes button", () => {
                useBoardColumnEditStateReturnType.isInErrorState = true;
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const saveButton = screen.getByTestId(
                    boardEditTestIds.saveButton.button
                );
                expect(saveButton).toHaveClass("Mui-disabled");
            });
        });

        describe("isInErrorState is false, isSavingColumns is true, and column data changed", () => {
            beforeEach(() => {
                useBoardColumnEditStateReturnType.isInErrorState = false;
                useBoardColumnEditStateReturnType.isSavingColumns = true;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;
            });

            it("should disable the save changes button", () => {
                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const saveButton = screen.getByTestId(
                    boardEditTestIds.saveButton.button
                );
                expect(saveButton).toHaveClass("Mui-disabled");
            });

            it("should show the spinner on the button", () => {
                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                screen.getByTestId(boardEditTestIds.saveButton.spinner);
            });
        });

        describe("isInErrorState is false, isSavingColumns is false, and column data HAS NOT changed", () => {
            it("should disable the save changes button", () => {
                useBoardColumnEditStateReturnType.isInErrorState = false;
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = false;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const saveButton = screen.getByTestId(
                    boardEditTestIds.saveButton.button
                );
                expect(saveButton).toHaveClass("Mui-disabled");
            });
        });

        describe("isInErrorState is false, isSavingColumns is false, and column data has changed", () => {
            beforeEach(() => {
                useBoardColumnEditStateReturnType.isInErrorState = false;
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;
            });

            it("should enable the save changes button", () => {
                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const saveButton = screen.getByTestId(
                    boardEditTestIds.saveButton.button
                );
                expect(saveButton).not.toHaveClass("Mui-disabled");
            });

            describe("the user clicks the save button", () => {
                it("should invoke the saveChanges function", () => {
                    let saveWasClicked = false;
                    useBoardColumnEditStateReturnType.saveColumns = () => {
                        saveWasClicked = true;
                    };
                    render(
                        <MemoryRouter
                            initialEntries={[
                                RouteCreator.editBoard("123", "456"),
                            ]}
                        >
                            <BoardEditInnerContent />
                        </MemoryRouter>
                    );

                    const saveButton = screen.getByTestId(
                        boardEditTestIds.saveButton.button
                    );
                    userEvent.click(saveButton);
                    expect(saveWasClicked).toBe(true);
                });
            });
        });
    });

    describe("Reset Changes Button", () => {
        describe("columnDataHasChanged is false and isSavingColumns is false", () => {
            it("should disable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = false;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const resetChangesButton = screen.getByTestId(
                    boardEditTestIds.resetChangesButton.button
                );
                expect(resetChangesButton).toHaveClass("Mui-disabled");
            });
        });

        describe("columnDataHasChanged is true and isSavingColumns is false", () => {
            it("should enable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const resetChangesButton = screen.getByTestId(
                    boardEditTestIds.resetChangesButton.button
                );
                expect(resetChangesButton).not.toHaveClass("Mui-disabled");
            });
        });

        describe("columnDataHasChanged is false and isSavingColumns is true", () => {
            it("should disable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = true;
                useBoardColumnEditStateReturnType.columnDataHasChanged = false;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const resetChangesButton = screen.getByTestId(
                    boardEditTestIds.resetChangesButton.button
                );
                expect(resetChangesButton).toHaveClass("Mui-disabled");
            });
        });

        describe("columnDataHasChanged is true and isSavingColumns is true", () => {
            it("should disable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = true;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const resetChangesButton = screen.getByTestId(
                    boardEditTestIds.resetChangesButton.button
                );
                expect(resetChangesButton).toHaveClass("Mui-disabled");
            });
        });
    });

    describe("Back To Board Button", () => {
        describe("columnDataHasChanged is false and isSavingColumns is false", () => {
            it("should enable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = false;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const backToBoardButton = screen.getByTestId(
                    boardEditTestIds.backToBoardButton.button
                );
                expect(backToBoardButton).not.toHaveClass("Mui-disabled");
            });
        });

        describe("columnDataHasChanged is true and isSavingColumns is false", () => {
            it("should disable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = false;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const backToBoardButton = screen.getByTestId(
                    boardEditTestIds.backToBoardButton.button
                );
                expect(backToBoardButton).toHaveClass("Mui-disabled");
            });
        });

        describe("columnDataHasChanged is false and isSavingColumns is true", () => {
            it("should disable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = true;
                useBoardColumnEditStateReturnType.columnDataHasChanged = false;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const backToBoardButton = screen.getByTestId(
                    boardEditTestIds.backToBoardButton.button
                );
                expect(backToBoardButton).toHaveClass("Mui-disabled");
            });
        });

        describe("columnDataHasChanged is true and isSavingColumns is true", () => {
            it("should disable the button", () => {
                useBoardColumnEditStateReturnType.isSavingColumns = true;
                useBoardColumnEditStateReturnType.columnDataHasChanged = true;

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.editBoard("123", "456")]}
                    >
                        <BoardEditInnerContent />
                    </MemoryRouter>
                );

                const backToBoardButton = screen.getByTestId(
                    boardEditTestIds.backToBoardButton.button
                );
                expect(backToBoardButton).toHaveClass("Mui-disabled");
            });
        });
    });

    describe("failedToLoadColumnData is true", () => {
        it("should show the error message", () => {
            useBoardColumnEditStateReturnType.failedToLoadColumnData = true;

            render(
                <MemoryRouter
                    initialEntries={[RouteCreator.editBoard("123", "456")]}
                >
                    <BoardEditInnerContent />
                </MemoryRouter>
            );

            screen.getByText("Error loading column data");
        });
    });
});
