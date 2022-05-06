const dateLocale = "en-US";

export const convertDateGeneral = (date: Date) =>
    new Date(date).toLocaleString(dateLocale, {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
