// Авторське право (c) жовтень 2026 рік Сікан Іван Валерійович
function select(elements) {
    const { checkboxMain, contentSelect, textSelect } = elements;
    
    if (!checkboxMain || !contentSelect || checkboxMain.checked) return;

    let userData = getUserData();
    const classes = userData.data.classes;

    let isMultipleSubjects = false;

    if (classes.length > 1) isMultipleSubjects = true;


    let totalSubjectCount = 0;
    let totalClassCount = 0;

    let classList = "";

    classes.forEach(item => {
        if (item.Class) {
            const classList = item.Class.split(',').map(c => c.trim());
            totalSubjectCount += classList.length;
        }
    });

    if (totalSubjectCount > 1) {
        isMultipleClasses = true;
    }

    classes.forEach(item => {
        const subject = item.Subject;

        if (isMultipleSubjects) {
            const liElementHTML = `<li>${subject}</li>`;
            contentSelect.insertAdjacentHTML('beforeend', liElementHTML);
        }
        
        if (item.Class) {
            classList = item.Class.split(',').map(c => c.trim());
            totalClassCount += classList.length;
        }

        if (totalClassCount > 1) {
            classList.forEach(className => {
                const liHTML = `<li>${className}</li>`;
                contentSelect.insertAdjacentHTML('beforeend', liHTML);
            });
        }
    });
}