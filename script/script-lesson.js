function listLesson(role, elements) {
    if(role === 'teacher') {
        elements.contentLesson
    }
}

function lesson(role, elements, mapLesson, subject, teacher, classInfo) {
    console.log(mapLesson, subject, teacher, classInfo);

    if(mapLesson.length >= 0) listLesson(role, elements);
}