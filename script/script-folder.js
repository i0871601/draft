// Авторське право (c) жовтень 2026 рік Сікан Іван Валерійович
function folder(elements) {
    const { checkboxFolder, contentFolderBlok } = elements;
    
    if (!checkboxFolder || !contentFolderBlok || checkboxFolder.checked) return;

    let userData = getUserData();
    const classes = userData.data.classes;

    classes.forEach(item => {
        const subject = item.Subject;
        
        if (item.Class) {
            const classList = item.Class.split(',').map(c => c.trim());

            classList.forEach(className => {
                const articleHTML = `
                    <article class="folder-item" data-class="${className}" data-subject="${subject}">
                        <span>${className}</span>
                        <span>${subject}</span>
                        <div class="file-folder"></div>
                        <div class="folder"></div>
                    </article>
                `;

                contentFolderBlok.insertAdjacentHTML('beforeend', articleHTML);
            });
        }
    });
}