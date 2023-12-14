console.log("hello, world!");

const projectGridElement = document.querySelector('.project-grid');
const modalContainer = document.querySelector('#modal');
const modalItems = document.querySelector('#modal-items');
const body = document.querySelector('body');
let globalData;

fetch("projects.json")
    .then((response) => response.json())
    .then((data) => {
        globalData = data;
        createContent(globalData);
    });

function createContent(globalData){
    globalData.forEach(function(item){
        buildElements(item);
    });
};

function closeModal() {
    body.classList.remove('modal-active');
    modalContainer.classList.remove('active');
    modalItems.classList.remove('active');
}

function buildElements(item) {
    var articleElement = document.createElement("article");
    articleElement.setAttribute('id', item.id);

    if (item.content && item.content.length > 0 && item.content[0].image) {
        var imgElement = document.createElement("img");
        imgElement.setAttribute('src', `assets/${item.content[0].image.src}`);
        imgElement.setAttribute('alt', item.content[0].image.alt);
        articleElement.appendChild(imgElement);
    }

    var h3Element = document.createElement("h3");
    h3Element.textContent = item.header;
    articleElement.appendChild(h3Element);

    var pElement = document.createElement("p");
    pElement.textContent = item.description;
    pElement.classList.add('project-description');
    articleElement.appendChild(pElement);

    projectGridElement.append(articleElement);

    articleElement.addEventListener('click', function(event) {
        body.classList.add('modal-active');
        modalContainer.classList.add('active');
        modalItems.classList.add('active');
        
        getSelectedArticleContent(event);
    });
}

function getSelectedArticleContent(event) {
    globalData.find(function(item) {
        if (item.id === event.currentTarget.id) {
            let contentHTML = `<div class="observable"><h3>${item.header}</h3></div>`;

            // Start loop from the first item
            item.content.forEach(contentItem => {
                if (contentItem.image) {
                    contentHTML += `
                        <div class="observable flex-container">
                            <img class="modal-img-left" src="assets/${contentItem.image.src}" alt="${contentItem.image.alt}">
                        </div>`;
                }

                if (contentItem.paragraph) {
                    contentHTML += `
                        <div class="observable">
                            <p class="modal-text-right">${contentItem.paragraph}</p>
                        </div>`;
                }
            });

            modalItems.innerHTML = contentHTML;
            observeModalContent();
        }
    });
}

function observeModalContent() {
    const elements = document.querySelectorAll('.observable');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-opacity");
            } else {
                entry.target.classList.remove("animate-opacity");
            }
        });
    }, { threshold: 0.5 });

    elements.forEach((element) => {
        observer.observe(element);
    });
}

modalContainer.addEventListener('click', function(event) {
    if (event.target === modalContainer) {
        closeModal();
    }
});

document.addEventListener('click', function (event) {
    if (event.target.id === 'closeModalButton') {
        closeModal();
    }
});

function hideAllSections() {
    document.querySelectorAll('main > section').forEach(function (section) {
        section.style.display = 'none';
    });
}

function showSection(sectionClass) {
    hideAllSections();
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
        section.style.display = 'grid';
    }
}

document.querySelector('.menu-bar').addEventListener('click', function (event) {
    const text = event.target.textContent;
    if (text === 'About') {
        showSection('about');
    } else if (text === 'Projects') {
        showSection('project-grid');
    } else if (text === 'Skills') {
        showSection('skills');
    } else if (text === 'Contact') {
        showSection('contact');
    }
    document.querySelectorAll('.menu-bar li').forEach(function (li) {
        li.classList.remove('clicked');
    });
    event.target.classList.add('clicked');
});

showSection('landing');