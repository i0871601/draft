// Авторське право (c) жовтень 2026 рік Сікан Іван Валерійович
function folder(elements) {
    const { checkboxFolder, contentFolderBlok } = elements;
    
    if (!checkboxFolder || !contentFolderBlok || checkboxFolder.checked) return;

    let userData = getUserData();
    const routine = userData.data.classes;

    const allClasses = [];

    classes.forEach(item => {
        if (item.Class) {
            const splitClasses = item.Class.split(',').map(c => c.trim());
            allClasses.push(...splitClasses);
        }
    });

    const uniqueClasses = [...new Set(allClasses)];

    uniqueClasses.forEach(className => {
        const articleHTML = `
            <article class="folder-item" data-class="${className}">
                <span>${className}</span>
            </article>
        `;

        contentFolderBlok.insertAdjacentHTML('beforeend', articleHTML);
    });
}