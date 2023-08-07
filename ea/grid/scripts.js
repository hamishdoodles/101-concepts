const wrapper = document.getElementById('wrapper');
const sections = [...document.querySelectorAll(".section")];
const closeButtons = [...document.querySelectorAll(".close-section")];

const openSection = (element) => {
  wrapper.style.gridTemplateColumns = '1fr';
  wrapper.style.height = '100vh';
  sections.forEach(section => {
    section.style.height = '100vh';
  });
  wrapper.classList.add('is-expanded');
  wrapper.classList.add('has-expanded-item');

  // Scroll to the clicked element
  element.scrollIntoView({ behavior: 'smooth' });
};

const closeSection = () => {
  wrapper.style.gridTemplateColumns = 'repeat(3, 1fr)';
  wrapper.style.height = '300px';
  sections.forEach(section => {
    section.style.height = '300px';
  });
  wrapper.classList.remove('is-expanded');
  wrapper.classList.remove('has-expanded-item');
};

sections.forEach((element) => {
  element.addEventListener("click", () => openSection(element));
});

closeButtons.forEach((element) => {
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    closeSection();
  });
});
