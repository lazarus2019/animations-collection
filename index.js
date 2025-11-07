/* Variable declaration & event */
const mainElement = document.getElementsByTagName('main')[0];
const backToTopButton = document.getElementById('back-to-top');
const toggleTOCButton = document.getElementById('toggle-toc-button');
const tocElement = document.getElementById('table-of-contents');

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

toggleTOCButton.addEventListener('click', () => {
  tocElement.classList.toggle('show');
});

/* Generate HTML functions */
function getAnimationName(filePath) {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1];

  const nameWithoutExtension = fileName.replace('.html', '');

  const words = nameWithoutExtension.split(/[-_]/);
  const titleCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return titleCased;
}

function generateIframe(filePath, animationName) {
  const iframe = document.createElement('iframe');
  iframe.src = filePath;
  iframe.loading = 'lazy';
  iframe.title = animationName;
  iframe.allowFullscreen = true;

  return iframe;
}

function generateAnimationHeading(animationName) {
  const heading = document.createElement('h3');
  heading.textContent = animationName;
  return heading;
}

function generateHeadingLinkToAnimation(filePath, animationName) {
  const link = document.createElement('a');
  link.className = 'animation-link';
  link.href = filePath;
  link.target = '_self';

  link.innerHTML = externalLinkSvg;

  const heading = generateAnimationHeading(animationName);

  link.insertBefore(heading, link.firstChild);

  return link;
}

function generateAnimationCategory(folder, files) {
  if (!folder || !files || files.length === 0) return;

  const section = document.createElement('section');
  const heading = document.createElement('h2');
  heading.id = folder;
  heading.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
  section.appendChild(heading);

  const container = document.createElement('div');
  container.className = 'animation-container';
  files.forEach((filePath) => {
    const animationName = getAnimationName(filePath);

    const iframe = generateIframe(filePath, animationName);

    const heading = generateHeadingLinkToAnimation(filePath, animationName);

    container.appendChild(heading);
    container.appendChild(iframe);
  });

  section.appendChild(container);
  mainElement.appendChild(section);
}

function generateTableOfContents(folders) {
  folders.forEach((folder) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${folder}`;
    link.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
    listItem.appendChild(link);
    tocElement.appendChild(listItem);
  });
}

/* Loading & process data functions */
async function loadJsonHTMLPaths() {
  try {
    const response = await fetch('./html-paths.json');
    const data = await response.json();

    return {
      folders: Object.keys(data),
      allFiles: data,
    };
  } catch (error) {
    console.error('Error loading html-paths.json:', error);
  }
}

async function init() {
  const { folders, allFiles } = await loadJsonHTMLPaths();

  for (const folder of folders) {
    generateAnimationCategory(folder, allFiles[folder]);
  }

  generateTableOfContents(folders);
}

init();

/* Other variables */
const externalLinkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
