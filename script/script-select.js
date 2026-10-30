// Авторське право (c) жовтень 2026 рік Сікан Іван Валерійович
function select(elements) {
    const { checkboxMain, contentSelect, textSelect } = elements;
    
    if (!checkboxMain || !contentSelect || checkboxMain.checked) return;

    let userData = getUserData();
    const classes = userData.data.classes;

    let classElement = "li";
    let totalClassCount = 0;

    classes.forEach(item => {
        if (item.Class) {
            const classList = item.Class.split(',').map(c => c.trim());
            totalClassCount += classList.length;
        }
    });

    if (totalClassCount > 2) {
        classElement = "li-subject"
    }

    classes.forEach(item => {
        const subject = item.Subject;

        if (classes.length > 1) {
            const liElementHTML = `<li class=${classElement}>${subject}</li>`;
            contentSelect.insertAdjacentHTML('beforeend', liElementHTML);
        }
        
        if (item.Class) {
            let totalClassCount = 0;
            const classList = item.Class.split(',').map(c => c.trim());
            totalClassCount += classList.length;

            if (totalClassCount > 1) {
                classList.forEach(className => {
                    const liHTML = `<li class="li">${className}</li>`;
                    contentSelect.insertAdjacentHTML('beforeend', liHTML);
                });
            }
        }
    });
}