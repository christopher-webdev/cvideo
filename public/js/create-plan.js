document.addEventListener('DOMContentLoaded', () => {
    // Function  user
    let AvailablePackages = {};

    document
        .getElementById('AddPackageBtn')
        .addEventListener('click', () => addNewPackageField(undefined, false));

    getPackages();
});

async function updatePackage(data) {
    try {
        const response = await fetch('/api/packages', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log('🚀 ~ updatePackage ~ error:', error);
    }
}

async function createPackage(data) {
    try {
        const response = await fetch('/api/packages', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log('🚀 ~ updatePackage ~ error:', error);
    }
}

function getPackages() {
    fetch('/api/packages')
        .then((e) => e.json())
        .then(async ({ data }) => {
            const resq = await fetch('/api/packages/list');
            AvailablePackages = (await resq.json()).data;

            let options = ``;
            for (const pkg of AvailablePackages.allowedPackages) {
                options += `<option value='${pkg.name}'>${pkg.name}</option>`;
            }

            const package = document.getElementById('subscriptionPlan');
            package.innerHTML = options;

            for (const pkg of data.pkgs) {
                addNewPackageField(pkg);
            }

            // package.addEventListener("change", (e)=>getPackagePoints(e.target.value), false)
        });
}

function buildFormData(form) {
    // Convert form data to a JSON object, handling multiple fields with the same name
    const formData = new FormData(form);
    const formObject = {};
    const benefits = [];

    for (const [key, value] of formData) {
        if (key === 'benefits') {
            // If key is benefit_name, push a new object into benefits array
            benefits.push({ name: value, isAvailable: false });
        } else if (key === 'isAvailable' && benefits.length > 0) {
            // Update the isAvailable field of the last benefit in the array
            benefits[benefits.length - 1].isAvailable = value == 'on';
        } else {
            // For other fields, add them directly to the formObject
            if (formObject[key]) {
                // If the key already exists, convert it to an array and push the new value
                if (Array.isArray(formObject[key])) {
                    formObject[key].push(value);
                } else {
                    formObject[key] = [formObject[key], value];
                }
            } else {
                formObject[key] = value;
            }
        }
    }

    // Add the benefits array to the formObject
    formObject.benefits = benefits;
    return formObject;
}

function addNewPackageField(pkg, isNew = true) {
    const container = document.createElement('form');
    const benefitInfoField = document.createElement('p');
    const benefitcontainer = document.createElement('div');
    const packagePrice = document.createElement('input');

    const packageHiddenId = document.createElement('input');

    const addBenefitBtn = document.createElement('button');
    const removePackageBtn = document.createElement('button');
    const submitButton = document.createElement('button');
    const indicator = document.createElement('p');

    // const packageInterval = document.createElement('select')
    benefitInfoField.innerText =
        'Please check the box if the corresponding benefit is available for this package';
    const packageName = document.createElement('select');
    packageName.name = 'name';
    packageName.disabled = isNew;

    const packageInterval = document.createElement('select');
    packageInterval.name = 'interval';
    packageInterval.disabled = isNew;

    AvailablePackages?.allowedIntervals?.forEach((el) => {
        const option = document.createElement('option');
        option.value = el;
        option.innerText = pkg?.interval || el;
        packageInterval.append(option);
    });

    AvailablePackages?.allowedPackages?.forEach((el) => {
        const option = document.createElement('option');
        option.value = el.name;
        option.innerText = pkg?.name || el.name;
        packageName.append(option);
    });

    // packageName.value = pkg?.name || ""
    // packageName.disabled = isNew

    packageHiddenId.name = 'packageId';
    packageHiddenId.value = pkg?._id || '';
    packageHiddenId.hidden = true;

    packagePrice.name = 'amount';
    packagePrice.value = pkg?.amount || '';
    packagePrice.disabled = pkg?.name === 'Free';

    // packageInterval.name = "interval"
    // packageInterval.value = pkg?.interval || ""
    // packageInterval.disabled = true

    packageName.placeholder = 'Write Package name';
    packagePrice.placeholder = 'Add Price';
    packageInterval.placeholder = 'month, year';

    container.className =
        'p-4 border border-blue-500 my-4 bg-gray-300 rounded-md';
    benefitInfoField.className =
        'p-4 border my-4 bg-yellow-100 text-yellow-600';
    benefitcontainer.className = 'p-2';
    packageName.className = 'p-2 mr-2';
    indicator.className = 'p-2 mr-2 !text-red-500 error-message';

    packagePrice.className = 'p-2 mr-2';
    packageInterval.className = 'p-2 mr-2';
    packageInterval.disabled = isNew;

    addBenefitBtn.className =
        'p-2 border bg-gray-500 rounded-md text-white mr-2';
    removePackageBtn.className =
        'p-2 border bg-gray-500 rounded-md text-white mr-2';
    submitButton.className =
        'p-2 border bg-gray-500 rounded-md text-white mr-2 text-white';

    removePackageBtn.type = 'button';
    // removePackageBtn.hidden = isNew

    addBenefitBtn.type = 'button';
    submitButton.type = 'submit';

    addBenefitBtn.innerText = 'Add benefit';
    removePackageBtn.innerText = 'Dismiss Section';
    submitButton.innerText = 'Create Package';

    pkg?.benefits.map((b) => {
        addBenefitField(benefitcontainer, b);
    });

    addBenefitBtn.addEventListener('click', () =>
        addBenefitField(benefitcontainer, undefined)
    );
    addBenefitField(benefitcontainer, undefined);
    removePackageBtn.addEventListener('click', () => {
        const canContinue =
            packageName.value.length < 2 ||
            packagePrice.value.length < 2 ||
            packageInterval.value.length < 2;
        if (!canContinue) {
            if (confirm('Your inputs will be cleared')) {
                container.remove();
            }
        } else {
            container.remove();
        }
    });

    container.append(
        packageName,
        packagePrice,
        packageInterval,
        addBenefitBtn,
        removePackageBtn,
        packageHiddenId
    );
    container.append(benefitInfoField, benefitcontainer);
    container.append(indicator, submitButton);

    container.addEventListener('submit', (even) =>
        handleSubmitNewPackage(even, indicator)
    );

    document.getElementById('packagesContainer').append(container);
}

async function handleSubmitNewPackage(event, indicator) {
    event.preventDefault();

    const formData = buildFormData(event.target);
    const formElements = event.target.elements;
    try {
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].disabled = true;
        }
        indicator.textContent = 'Please wait. Submitting Plan....';
        const response = await fetch(
            `/api/packages${
                formData?.packageId ? `/${formData?.packageId}` : ''
            }`,
            {
                method: `${formData?.packageId ? `PUT` : 'POST'}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ packages: formData }),
            }
        );

        const data = await response.json();
        if (!data.success) {
            indicator.textContent = data.errors;
            return;
        }

        indicator.textContent = 'Plan Created successully';
        // alert("Plan added successfully")
    } catch (error) {
        console.log('🚀 ~ handleSubmitNewPackage ~ error:', error);
        indicator.textContent = error.response.data.errors;
        // alert(error.response.data.errors)
    } finally {
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].disabled = false;
        }

        setTimeout(() => {
            indicator.textContent = '';
        }, 2500);
    }
}

function addBenefitField(container, benefit) {
    const benefitContainer = document.createElement('div');
    const input = document.createElement('input');
    const isAvailable = document.createElement('input');
    const addMoreBtn = document.createElement('button');
    const removeBtn = document.createElement('button');

    input.name = 'benefits';
    input.value = benefit?.name || '';

    isAvailable.name = 'isAvailable';
    isAvailable.checked = !!benefit?.isAvailable || false;
    isAvailable.className = 'p-2 mx-3';
    isAvailable.type = 'checkbox';

    benefitContainer.className = 'p-2';
    input.placeholder = 'Add a benefit for this plan';
    input.className = 'p-2 mr-2';
    addMoreBtn.className = 'p-2 border bg-gray-500 rounded-md text-white';
    removeBtn.className = 'p-2 border bg-gray-500 rounded-md text-white mr-2';

    addMoreBtn.innerText = 'Add';
    removeBtn.innerText = 'Remove';

    addMoreBtn.type = 'button';
    addMoreBtn.hidden = true;
    removeBtn.type = 'button';

    addMoreBtn.addEventListener('click', () =>
        addBenefitField(benefitContainer)
    );
    removeBtn.addEventListener('click', () => {
        if (input.value.length > 2) {
            if (confirm('Your input will be cleared')) {
                benefitContainer.remove();
            }
        } else {
            benefitContainer.remove();
        }
    });

    benefitContainer.append(isAvailable, input, addMoreBtn, removeBtn);

    container.append(benefitContainer);
}
