/**
 * Calculates the difference in minutes between two dates.
 * 
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 * @returns {number} The difference in minutes between the two dates.
 */
export function calcDateDifferenceMinutes(date1: Date, date2: Date): number {
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime())

    // Convert milliseconds to minutes
    return Math.floor(differenceInMilliseconds / (1000 * 60))

}

/**
 * Pauses the execution for a specified duration.
 * 
 * @param {number} duration - The duration to sleep in milliseconds.
 * @returns {Promise<null>} A promise that resolves after the specified duration.
 */
export function sleep(duration:number): Promise<null> {
    return new Promise((res) => setTimeout(() => res(null), duration))
}