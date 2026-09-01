// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович
import { getUserData } from './config.js';

const userData = getUserData();

export const routine = userData?.data?.routine || [];

if (routine.length > 0) {
    console.log("Ось ваш масив routine:", routine);
}

export const listLessonDay = (dayText) => {

    if (!Array.isArray(routine) || routine.length === 0) {
        return [];
    }

    const filteredLessons = routine.filter(item => item.Day === dayText);
    filteredLessons.sort((a, b) => Number(a.LessonNumber) - Number(b.LessonNumber));

    console.log(filteredLessons);

};