function convertFromDate(date: Date): string {
    return `${date.getFullYear()}-${getMonthLeadingZero(date.getMonth())}-${date.getDate()}`;
}

function getMonthLeadingZero(month: number): string {
    return month < 10 ? `0${month}` : `${month}`;
}
export {convertFromDate}