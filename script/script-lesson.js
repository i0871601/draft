function formAddLesson(role, elements) {

}

function lesson(role, elements, mapLesson, subject, teacher, classInfo) {
    console.log(mapLesson, subject, teacher, classInfo);

    if(mapLesson.length === 0) formAddLesson(role, elements);
}