console.log("hello, world!");

const Project = class {
    constructor(
        id,
        header,
        description,
        imageSrc,
        imageAlt,
        detail
    ){
        this.id = id;
        this.header = header;
        this.description = description;
        this.imageSrc = imageSrc;
        this.imageAlt = imageAlt;
        this.detail = detail;
    }
};

const projectGridElement = document.querySelector('.project-grid');
const modalContainer = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
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

function buildElements(item){
    var articleElement = document.createElement("article");
    articleElement.setAttribute('id', item.id);

    if (item.images && item.images.length > 0) {
        var imgElement = document.createElement("img");
        imgElement.setAttribute('src', `assets/${item.images[0].src}`);
        imgElement.setAttribute('alt', item.images[0].alt);
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

    articleElement.addEventListener('click', function (event) {
        body.classList.add('modal-active');
        modalContainer.classList.add('active');
        modalItems.classList.add('active');
        
        getSelectedArticleContent(event);
    });
};

function getSelectedArticleContent(event) {
    globalData.find(function(item) {
        if (item.id === event.currentTarget.id) {
            let contentHTML = `<div class="observable"><h3>${item.header}</h3></div>`;

            let firstParagraph = item.paragraphs[0].replace(/\n/g, "<br><br>");
            contentHTML += `
                <div class="observable flex-container">
                    <img class="modal-img-left" src="assets/${item.images[0].src}" alt="${item.images[0].alt}">
                    <p class="modal-text-right">${firstParagraph}</p>
                </div>`;

            item.paragraphs.slice(1).forEach(paragraph => {
                let formattedParagraph = paragraph.replace(/\n/g, "<br><br>");
                contentHTML += `
                    <div class="observable">
                        <p class="modal-text">${formattedParagraph}</p>
                    </div>`;
            });

            item.images.slice(1).forEach(image => {
                if (image.link) {
                    contentHTML += `
                        <div class="observable">
                            <a href="${image.link}" target="_blank">
                                <img class="modal-img" src="assets/${image.src}" alt="${image.alt}">
                            </a>
                        </div>`;
                } else {
                    contentHTML += `
                        <div class="observable">
                            <img class="modal-img" src="assets/${image.src}" alt="${image.alt}">
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
        showSection('landing');
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