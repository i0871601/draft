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
                    <li>${className}  ${subject}</li>
                `;

                contentSelect.insertAdjacentHTML('beforeend', liHTML);
            });
        }
    });
}