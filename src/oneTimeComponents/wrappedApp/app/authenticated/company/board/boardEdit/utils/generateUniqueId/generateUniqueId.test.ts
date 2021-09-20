import { generateUniqueId } from ".";

describe("generateUniqueId", () => {
    it("should generate characters in sets of four", () => {
        const fourCharacters = generateUniqueId(1);
        expect(fourCharacters.length).toBe(4);

        const nineCharactersWithSlash = generateUniqueId(2);
        expect(nineCharactersWithSlash.length).toBe(9);
    });

    it("should generate twelve characters by defalt", () => {
        const fourteenCharactersWithSlashes = generateUniqueId();
        expect(fourteenCharactersWithSlashes.length).toBe(14);
    });

    it("should combine each four character set with a slash", () => {
        const uniqueId = generateUniqueId(4);
        const slashIndexes = [4, 9, 14];
        slashIndexes.forEach((index) => {
            expect(uniqueId[index]).toBe("-");
        });
    });
});
