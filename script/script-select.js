// Авторське право (c) жовтень 2026 рік Сікан Іван Валерійович
function select(elements) {
    const { checkboxMain, contentSelect, textSelect } = elements;
    
    if (!checkboxMain || !contentSelect || checkboxMain.checked) return;

    let userData = getUserData();
    const classes = userData.data.classes;

    classes.forEach(item => {
        const subject = item.Subject;
        
        if (item.Class) {
            const classList = item.Class.split(',').map(c => c.trim());

            classList.forEach(className => {
                const liHTML = `
                    <article class="folder-item" data-class="${className}" data-subject="${subject}">
                        <span>${className}</span>
                        <span>${subject}</span>
                        <div class="folder-file">
                            <div class="file"></div>
                            <div class="folder"></div>
                        </div>
                    </article>
                `;

                contentSelect.insertAdjacentHTML('beforeend', liHTML);
            });
        }
    });
}