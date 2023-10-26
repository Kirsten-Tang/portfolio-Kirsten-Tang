console.log("hello, world!");

const Project = class {
    constructor(
        id,
        header,
        description,
        imageSrc,
        imageAlt
    ){
        this.id = id;
        this.header = header;
        this.description = description;
        this.imageSrc = imageSrc;
        this.imageAlt = imageAlt
    }
};

const projectGridElement = document.querySelector('.project-grid');
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

function buildElements(item){
    var articleElement = document.createElement("article");
    articleElement.setAttribute('id', item.id);

    var imgElement = document.createElement("img");
    imgElement.setAttribute('src', `assets/${item.imageSrc}`);
    imgElement.setAttribute('alt', item.imageAlt);
    articleElement.appendChild(imgElement);

    var h3Element = document.createElement("h3");
    h3Element.textContent = item.header;
    articleElement.appendChild(h3Element);

    var pElement = document.createElement("p");
    pElement.textContent = item.description;
    pElement.classList.add('project-description');
    articleElement.appendChild(pElement);

    projectGridElement.append(articleElement);

    articleElement.addEventListener('click', function () {
      projectGridElement.style.gridTemplateColumns = '1fr';

      document.querySelectorAll('.project-grid article').forEach(function (art) {
          if (art !== articleElement) {
              art.style.display = 'none'; 
          } else {
              art.classList.add('clicked'); 

              if (!art.querySelector('.back-button')) {
                  addBackButton(art);
              }
          }
      });
  });
};

function addBackButton(articleElement) {
  var backButton = document.createElement("button");
  backButton.textContent = "Back to All Projects";
  backButton.classList.add('back-button');

  backButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
  
    projectGridElement.style.gridTemplateColumns = '1fr 1fr';
  
    document.querySelectorAll('.project-grid article').forEach(function (art) {
      art.style.display = 'block';
      art.classList.remove('clicked');
    });
  
    backButton.remove();
  });

  articleElement.appendChild(backButton);
}

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