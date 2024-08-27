let avatarCreatedCount = 0;
const expandHeight = 'h-40';
const availableLocations = ['Home', 'Office', 'Forest', 'Street'];
const buttonClassName = 'p-2 border bg-gray-500 rounded-md text-white mr-2';

document.addEventListener('DOMContentLoaded', function () {
    // const render = createAvatar()
    createAvatar(document.getElementById('UploaderContainer'));

    document.getElementById('createAvatarBtn').addEventListener('click', () => {
        document
            .querySelectorAll('.form-form')
            .forEach((el) => el.classList.add(expandHeight));

        const container = createAvatar(
            document.getElementById('UploaderContainer')
        );

        container.classList.remove(expandHeight);
        // newForm.classList.add('short-form');
    });
    document.getElementById('updateAvatarBtn').addEventListener('click', () => {
        const container = document.getElementById('UploaderContainer');
        avatarCreatedCount = 1;
        container.innerHTML = '';
        updateAvatar(container);
    });
});

async function updateAvatar(container) {
    try {
        const response = await fetch('/api/avatars');

        const avatars = await response.json();

        for (const avatar of avatars) {
            createAvatar(container, avatar);
        }

        document
            .querySelectorAll('.form-form')
            .forEach((el) => el.classList.add(expandHeight));
    } catch (error) {
        console.log('🚀 ~ updateAvatar ~ error:', error);
    }
}
function createAvatar(section, avatar = null) {
    avatarCreatedCount++;

    const container = createEl('div');
    const form = createEl('form');
    const propertySelectorSection = createEl('div');
    const addLocationSection = createEl('div');
    const submitButton = createEl('button');
    const dismissButton = createEl('button');
    const expandButton = createEl('button');
    const addLocationButton = createEl('button');

    form.enctype = 'multipart/form-data';

    expandButton.type = 'button';
    addLocationButton.type = 'button';
    dismissButton.type = 'button';
    dismissButton.textContent = 'Dismiss';
    expandButton.textContent = 'Expand';
    addLocationButton.textContent = 'Add Location';

    submitButton.type = 'submit';
    submitButton.textContent = 'Upload';
    submitButton.className = buttonClassName;
    dismissButton.className = `${buttonClassName} absolute top-10 right-10`;
    expandButton.className = `${buttonClassName} absolute top-10 right-40`;
    addLocationButton.className = `${buttonClassName} absolute top-10 right-60`;

    // dismissButton.addEventListener('click', () => {
    //     avatarCreatedCount--;
    //     container.remove();
    // });

    dismissButton.addEventListener('click', async () => {
        if (avatar && avatar._id) {
            try {
                const response = await fetch(`/api/avatars/${avatar._id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();

                if (!response.ok) {
                    alert(data.errors || 'Failed to delete avatar');
                    return;
                }

                alert('Avatar successfully deleted!');
            } catch (error) {
                alert(
                    error.message ||
                        'An error occurred while deleting the avatar'
                );
            }
        }

        avatarCreatedCount--;
        container.remove();
    });

    addLocationButton.addEventListener('click', () => {
        addNewLocationField(addLocationSection);
    });

    expandButton.addEventListener('click', () => {
        document
            .querySelectorAll('.form-form')
            .forEach((el) => el.classList.add(expandHeight));
        container.classList.toggle(expandHeight);
    });

    propertySelectorSection.className = 'p-2 bg-gray-300';

    container.className =
        'form-form p-4 border border-blue-500 my-4 bg-gray-300 rounded-md relative overflow-hidden';

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(this);

        if (avatar) {
            formData.append('avatarId', avatar._id);
        }

        try {
            const response = await fetch('/api/avatars', {
                method: avatar ? 'PUT' : 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.errors);
                return;
            }

            alert('Avatar successfully uploaded!');
        } catch (error) {
            alert(error.message || 'An error occurred');
        }
    });

    const avatarName = createSelectorSection('Avatar name', 'name', 'text', {
        placeholder: avatar?.name || `Avatar ${avatarCreatedCount}`,
        value: avatar?.name || `Avatar ${avatarCreatedCount}`,
        disabled: !!avatar?.name,
    });

    if (avatar && avatar.locations > 0) {
        for (const location of avatar.locations) {
            addNewLocationField(addLocationSection, location);
        }
    } else {
        addNewLocationField(addLocationSection);
    }

    propertySelectorSection.append(
        dismissButton,
        expandButton,
        addLocationButton,
        createSelectorSection('Upload Avatar', 'avatarImage'),
        avatarName,
        addLocationSection,
        submitButton
    );

    form.append(propertySelectorSection);
    container.append(form);
    section.append(container);
    return container;
}

function addNewLocationField(container, location = null) {
    const locContainer = createEl('div');
    const dismissButton = createEl('button');

    locContainer.className = 'flex items-center space-x-2';

    dismissButton.type = 'button';
    dismissButton.className = buttonClassName;
    dismissButton.textContent = 'Dismiss';

    const locaField = createSelectorSection(
        location ? [location] : availableLocations,
        'locationImages[home]'
    );

    dismissButton.addEventListener('click', () => locContainer.remove());

    locContainer.append(dismissButton, locaField);
    container.append(locContainer);
    return container;
}

async function retrieveAvatars() {
    try {
    } catch (error) {
        console.log('🚀 ~ retrieveAvatars ~ error:', error);
    }
}

function createFileSelector(name, type, options) {
    const selector = createEl('input');

    selector.type = type || 'file';
    selector.name = name;
    if (type == 'text') {
        selector.value = options?.value || '';
        selector.placeholder = options?.placeholder || '';
    }

    selector.hidden = !!options?.hidden;
    selector.disabled = !!options?.disabled;

    // if(options?.required){
    selector.required = true;
    // }

    return selector;
}

function createSelectorSection(labelText, inputName, inputType, options) {
    const container = createEl('div');

    let label = createEl('p');
    label.textContent = labelText;
    let selector = createFileSelector(inputName, inputType, options);

    if (Array.isArray(labelText)) {
        label = createEl('select');
        label.name = inputName;

        label.className = 'p-2';

        for (const option of labelText) {
            const optionEl = createEl('option');
            optionEl.value = option?.toLowerCase();
            optionEl.textContent = option;

            label.append(optionEl);
        }

        label.addEventListener('change', (e) => {
            label.name = `locationImages[${e.target.value}]`;
            selector.name = `locationImages[${e.target.value}]`;
        });
    }

    container.className =
        'flex items-center gap-4 bg-gray-300 p-2 m-2 rounded-sm';
    selector.className = 'p-2 rounded-sm';
    // selector.placeholder =placeholder;

    container.append(label, selector);
    // section.append(container)
    return container;
}

function createEl(el) {
    return document.createElement(el);
}
