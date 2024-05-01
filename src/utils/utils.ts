export function calcDateDifferenceMinutes(date1: Date, date2: Date): number {
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime())

    // Convert milliseconds to minutes
    return Math.floor(differenceInMilliseconds / (1000 * 60))

}

export function sleep(duration:number): Promise<null> {
    return new Promise((res) => setTimeout(() => res(null), duration))
}