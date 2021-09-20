export function generateUniqueId(numberOfFourCharacterSequences: number = 3) {
    const fourRandomCharacters = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    const sequences = [];
    for (let i = 0; i < numberOfFourCharacterSequences; i++) {
        sequences.push(fourRandomCharacters());
    }
    return sequences.join("-");
}
