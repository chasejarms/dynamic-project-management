export function prioritiesToPointValueMapping(priorities: string[]) {
    return priorities.reverse().reduce<{
        [priorityName: string]: number;
    }>((mapping, priority, index) => {
        mapping[priority] = Math.pow(2, index + 2);
        return mapping;
    }, {});
}
