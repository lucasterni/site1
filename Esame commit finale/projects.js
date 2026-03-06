

document.addEventListener('DOMContentLoaded', function() {
  const projectsBody = document.body;
  const projectTitles = document.querySelectorAll('.project-title-item');
  const projectDescriptions = document.querySelectorAll('.project-desc-item');
  const projectImages = document.querySelectorAll('.project-images');
  const bottomHeader = document.querySelector('.bottom-header');
  const manualCaptions = {
    '1-1': {
      title: 'Bharat Lakshmi',
      location: '[unknown], India',
      cinema: '[unknown]',
      year: '1930'
    },
    '1-2': {
      title: "Grauman's Chinese Theatre",
      location: 'Hollywood, CA',
      cinema: 'The Wizard of Oz',
      year: '1939'
    },
    '1-3': {
      title: 'Palác Fénix',
      location: 'Prague, Czech Republic',
      cinema: '[unknown]',
      year: '1930'
    },
    '1-4': {
      title: 'Empire Talkies',
      location: 'Jodhpur, India',
      cinema: 'Stept Mother',
      year: '1937'
    },
    '1-5': {
      title: 'Phönix Lichtspiele',
      location: 'Berlin, Germany',
      cinema: '[unknown]',
      year: '1936'
    },
    '1-6': {
      title: 'Cinema Palacio',
      location: 'Lisbon, Portugal',
      cinema: '[unknown]',
      year: '1930'
    },
    '1-7': {
      title: 'Whittier Theatre',
      location: 'Whittier, CA',
      cinema: 'Snow White and the Seven Dwarfs',
      year: '1938'
    },
    '1-8': {
      title: 'Capitol',
      location: 'Finland',
      cinema: '[unknown]',
      year: '1933'
    },
    '2-1': {
      title: 'Cinema Royal',
      location: 'Egypt',
      cinema: '[unknown]',
      year: '1940'
    },
    '2-2': {
      title: 'Metropole',
      location: 'Egypt',
      cinema: '[unknown]',
      year: '1940'
    },
    '2-3': {
      title: 'Cine Colón',
      location: 'Valencia, Spain',
      cinema: '[unknown]',
      year: '1944'
    },
    '2-4': {
      title: 'Diana Palace',
      location: 'Egypt',
      cinema: 'The Great Dictator',
      year: '1940'
    },
    '2-5': {
      title: 'Metro Cinema',
      location: 'Egypt',
      cinema: '[unknown]',
      year: '1940'
    },
    '2-6': {
      title: 'Roxy Theatre',
      location: 'New York, NY',
      cinema: "Twelve O'Clock High",
      year: '1949'
    },
    '2-7': {
      title: 'Fox Theatre',
      location: 'Centralia, WA',
      cinema: 'Gone With The Wind',
      year: '1940'
    },
    '2-8': {
      title: 'Le Paris',
      location: 'Bizerte, Tunisia',
      cinema: '[unknown]',
      year: '[unknown]'
    },
    '3-1': {
      title: 'Roxy Theatre',
      location: 'Forsyth, MT',
      cinema: '[unknown]',
      year: '1950s'
    },
    '3-2': {
      title: 'Kursaal',
      location: 'Spain (?)',
      cinema: '[unknown]',
      year: '1952'
    },
    '3-3': {
      title: 'Roxy Theatre',
      location: 'Forsyth, MT',
      cinema: '[unknown]',
      year: '1958'
    },
    '3-4': {
      title: 'Cine Coliseo',
      location: 'Spain',
      cinema: '[unknown]',
      year: '1950s'
    },
    '3-5': {
      title: '[unknown]',
      location: 'Soviet Union (?)',
      cinema: '[unknown]',
      year: '1950s'
    },
    '3-6': {
      title: 'Cinéma Florida',
      location: 'France',
      cinema: '[unknown]',
      year: '1950s'
    },
    '3-7': {
      title: 'Fort Hatry',
      location: 'Belfort, France',
      cinema: '[unknown]',
      year: '1950s'
    },
    '3-8': {
      title: 'Pathe-Journal',
      location: 'Paris, France',
      cinema: '[unknown]',
      year: '1950s'
    },
    '4-1': {
      title: 'Florida Cinerama',
      location: 'Barcelona, Spain',
      cinema: '[unknown]',
      year: "1960's"
    },
    '4-2': {
      title: 'Michigan Theatre',
      location: 'Detroit, MI',
      cinema: 'Get Yourself a College Girl',
      year: '1965'
    },
    '4-3': {
      title: 'Cine San Roque',
      location: 'Las Palmas, Spain',
      cinema: '[unknown]',
      year: '1960s'
    },
    '4-4': {
      title: 'Cinema X',
      location: 'San Bernardo, Chile',
      cinema: '[unknown]',
      year: '1960s'
    },
    '4-5': {
      title: 'Cinema Capitol',
      location: 'Albacete, Spain',
      cinema: '[unknown]',
      year: '1960s'
    },
    '4-6': {
      title: 'Salón Cataluña',
      location: 'Spain (?)',
      cinema: '[unknown]',
      year: '1960s'
    },
    '4-7': {
      title: 'Cine Urquinaona',
      location: 'Barcelona, Spain',
      cinema: '[unknown]',
      year: '1960s'
    },
    '4-8': {
      title: 'Cine Galapagar',
      location: 'Galapagar, Spain',
      cinema: '[unknown]',
      year: '1960s'
    },
    '5-1': {
      title: 'Proyecciones',
      location: 'Madrid, Spain',
      cinema: '[unknown]',
      year: '1976'
    },
    '5-2': {
      title: 'Bosque',
      location: 'Barcelona, Spain',
      cinema: '[unknown]',
      year: '1970s'
    },
    '5-3': {
      title: 'Cine Carlos III',
      location: 'Madrid, Spain',
      cinema: '[unknown]',
      year: '1975'
    },
    '5-4': {
      title: 'Cinerama',
      location: 'Toronto, Canada',
      cinema: '2001: A Space Odyssey',
      year: '1970'
    },
    '5-5': {
      title: 'Cinema Chamber',
      location: 'Madrid, Spain',
      cinema: '[unknown]',
      year: '1970s'
    },
    '5-6': {
      title: "Queen's Theatre",
      location: 'Hong Kong',
      cinema: '[unknown]',
      year: '1971'
    },
    '5-7': {
      title: 'Glenelg Cinema Centre',
      location: 'Glenelg, Australia',
      cinema: 'Weekend of Shadows',
      year: '1978'
    },
    '5-8': {
      title: 'Shan Cinema',
      location: 'Nairobi, Kenya',
      cinema: '[unknown]',
      year: '1970'
    },
    '6-1': {
      title: 'Cartago Cinema',
      location: 'Ibiza, Spain',
      cinema: '[unknown]',
      year: '1980'
    },
    '6-2': {
      title: 'Lumière',
      location: 'Portugal',
      cinema: '[unknown]',
      year: '1985'
    },
    '6-3': {
      title: 'Pedro Cem',
      location: 'Porto, Portugal',
      cinema: '[unknown]',
      year: '1984'
    },
    '6-4': {
      title: 'МИP',
      location: 'Moscow, Russia',
      cinema: '[unknown]',
      year: '1981'
    },
    '6-5': {
      title: 'Estúdio Gemini 1',
      location: 'Lisbon, Portugal',
      cinema: '[unknown]',
      year: '1984'
    },
    '6-6': {
      title: 'Cinema Trindade',
      location: 'Porto, Portugal',
      cinema: '[unknown]',
      year: '1984'
    },
    '6-7': {
      title: 'Scala Theatre',
      location: 'Punpin, Thailand',
      cinema: '[unknown]',
      year: '1988'
    },
    '6-8': {
      title: 'Plaza',
      location: 'London, UK',
      cinema: 'The Last Temptation of Christ',
      year: '1988'
    },
    '7-1': {
      title: 'The Scala',
      location: 'London, UK',
      cinema: 'Full Contact / A Killer',
      year: '1990s'
    },
    '7-2': {
      title: 'Le Celtic',
      location: 'Brest, France',
      cinema: '[unknown]',
      year: '1997'
    },
    '7-3': {
      title: 'Cannon',
      location: 'Leeds, UK',
      cinema: 'Star Trek VI',
      year: '1992'
    },
    '7-4': {
      title: '[unknown]',
      location: 'Malta',
      cinema: '[unknown]',
      year: '1990'
    },
    '7-5': {
      title: 'UCI Bracknell',
      location: 'Bracknell, UK',
      cinema: 'Toy Story',
      year: '1996'
    },
    '7-6': {
      title: 'Metro Cinema',
      location: 'Manchester, UK',
      cinema: 'Black Sunday Five',
      year: '1991'
    },
    '7-7': {
      title: 'Kinepolis',
      location: 'Lille, France',
      cinema: 'Jingle All the Way',
      year: '1996'
    },
    '7-8': {
      title: 'Scala Cinema',
      location: 'London, UK',
      cinema: 'Film Extremes Festival',
      year: '1993'
    },
    '8-1': {
      title: 'Odeon',
      location: 'Guildford, UK',
      cinema: 'Crouching Tiger, Hidden Dragon',
      year: '2001'
    },
    '8-2': {
      title: 'Cinema Oz',
      location: 'Brescia, Italy',
      cinema: '  Star Wars: Episode II',
      year: '2002'
    },
    '8-3': {
      title: 'Rialto',
      location: 'Westfield, NJ',
      cinema: 'Mean Girls',
      year: '2004'
    },
    '8-4': {
      title: 'UGC',
      location: 'Dublin, Ireland',
      cinema: 'Anchorman',
      year: '2004'
    },
    '8-5': {
      title: 'Cineworld',
      location: 'Dublin, Ireland',
      cinema: 'Harry Potter and the Goblet of Fire',
      year: '2005'
    },
    '8-6': {
      title: 'Ster Century',
      location: 'Dublin, Ireland',
      cinema: 'Kill Bill Vol. 2',
      year: '2004'
    },
    '8-7': {
      title: 'AMC',
      location: 'Grapevine, TX',
      cinema: 'Equilibrium',
      year: '2002'
    },
    '8-8': {
      title: 'Irish Film Centre',
      location: 'Dublin, Ireland',
      cinema: 'Seven Samurai',
      year: '2002'
    },
    '9-1': {
      title: 'Avon Cinema',
      location: 'Providence, RI',
      cinema: 'The Music of Strangers',
      year: '2016'
    },
    '9-2': {
      title: 'Glasgow Film Theatre',
      location: 'Glasgow, UK',
      cinema: 'Neruda',
      year: '2017'
    },
    '9-3': {
      title: 'Crafty Cinema',
      location: 'Godalming, UK',
      cinema: 'The Red Turtle',
      year: '2017'
    },
    '9-4': {
      title: 'Odeon',
      location: 'Guildford, UK',
      cinema: 'Blade Runner 2049',
      year: '2017'
    },
    '9-5': {
      title: "Regent's Park Open Air Theatre",
      location: 'London, UK',
      cinema: 'Close Encounters of the Third Kind',
      year: '2017'
    },
    '9-6': {
      title: '35mm',
      location: 'Moscow, Russia',
      cinema: 'Melancholia',
      year: '2011'
    },
    '9-7': {
      title: 'Cineworld',
      location: 'Glasgow, UK',
      cinema: 'Hidden Figures',
      year: '2017'
    },
    '9-8': {
      title: 'Kinopolis',
      location: 'Koblenz, Germany',
      cinema: 'Exodus: Gods and Kings',
      year: '2014'
    }
  };

  document.querySelectorAll('.project-images').forEach(projectBlock => {
    const projectId = projectBlock.dataset.project || '';
    const projectImgs = projectBlock.querySelectorAll('.images-grid img');

    projectImgs.forEach((img, imageIndex) => {
    if (img.closest('.ticket-card')) return;

    const key = `${projectId}-${imageIndex + 1}`;
    const manualCaption = manualCaptions[key] || {};
    const title = manualCaption.title || img.dataset.title || img.alt || 'Untitled';
    const location = manualCaption.location || img.dataset.location || '[unknown], India';
    const cinema = manualCaption.cinema || img.dataset.cinema || '[unknown]';
    const year = manualCaption.year || img.dataset.year || '1925';

    const imageCaptionHtml = `
      <span class="ticket-caption-col">
        <span>🎟 ${title}</span>
        <span>📍 ${location}</span>
      </span>
      <span class="ticket-caption-col">
        <span>🎥 ${cinema}</span>
        <span>🗓 ${year}</span>
      </span>
    `;

    const card = document.createElement('figure');
    card.className = 'ticket-card';

    const caption = document.createElement('figcaption');
    caption.className = 'ticket-caption';
    caption.innerHTML = imageCaptionHtml;

    img.parentNode.insertBefore(card, img);
    card.appendChild(img);
    card.appendChild(caption);
    });
  });

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

