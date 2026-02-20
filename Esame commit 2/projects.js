// Projects page functionality

document.addEventListener('DOMContentLoaded', function() {
  const projectsBody = document.body;
  const projectTitles = document.querySelectorAll('.project-title-item');
  const projectDescriptions = document.querySelectorAll('.project-desc-item');
  const projectImages = document.querySelectorAll('.project-images');
  const bottomHeader = document.querySelector('.bottom-header');

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      projectsBody.classList.add('page-loaded');
    });
  });

  function toggleBottomHeaderOnScroll() {
    if (!bottomHeader) return;

    const currentScrollY = window.scrollY;
    const viewportBottom = currentScrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight;
    const isAtPageBottom = viewportBottom >= pageBottom - 1;

    if (currentScrollY <= 0 || isAtPageBottom) {
      bottomHeader.classList.remove('is-hidden');
    } else {
      bottomHeader.classList.add('is-hidden');
    }
  }

  window.addEventListener('scroll', toggleBottomHeaderOnScroll, { passive: true });
  toggleBottomHeaderOnScroll();

  projectTitles.forEach(title => {
    title.addEventListener('click', function() {
      const projectIndex = this.getAttribute('data-project');
      
      // Remove active class from all titles
      projectTitles.forEach(t => t.classList.remove('active'));
      // Add active class to clicked title
      this.classList.add('active');
      
      // Remove active class from all descriptions
      projectDescriptions.forEach(desc => {
        desc.classList.remove('active');
      });
      // Add active class to corresponding description
      const activeDesc = document.querySelector(`.project-desc-item[data-project="${projectIndex}"]`);
      if (activeDesc) {
        activeDesc.classList.add('active');
      }
      
      // Remove active class from all image grids
      projectImages.forEach(img => {
        img.classList.remove('active');
      });
      // Add active class to corresponding image grid
      const activeImages = document.querySelector(`.project-images[data-project="${projectIndex}"]`);
      if (activeImages) {
        activeImages.classList.add('active');
      }
    });
  });

  // Lightbox functionality
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<span class="lightbox-close">&times;</span><a class="lightbox-download" download>▼</a><img src="" alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxDownload = lightbox.querySelector('.lightbox-download');

  // Add click listeners to all grid images
  document.addEventListener('click', function(e) {
    if (e.target.matches('.images-grid img')) {
      lightboxImg.src = e.target.src;
      lightboxImg.alt = e.target.alt;
      lightboxDownload.href = e.target.src;
      lightbox.classList.add('active');
    }
  });

  // Close lightbox
  lightboxClose.addEventListener('click', function() {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
});

