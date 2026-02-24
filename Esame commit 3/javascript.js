function playAnimation(shape) {
 // the timeline
  let tl = gsap.timeline();
  tl.to(
    shape,
    {
      opacity: 0,
      scale: 0.2,
      ease: "power2.inOut",
      duration: 1.2,
    },
    "0"
  );
  
}

/* --------------------------------

The other stuff...

------------------------------------*/
let flair = gsap.utils.toArray(".flair");
let gap = 40; // tighter spacing for a smoother trail
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);
gsap.defaults({ duration: 0.8 })

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;
let cachedMousePos = mousePos;

window.addEventListener("mousemove", (e) => {
  mousePos = {
    x: e.x,
    y: e.y
  };
});

gsap.ticker.add(ImageTrail);

function ImageTrail() {
  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  // keep the previous mouse position for animation
  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.2
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.2
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos = mousePos;
  }
}

function animateImage() {
  let wrappedIndex = wrapper(index);

  let img = flair[wrappedIndex];
  gsap.killTweensOf(img);
  
  gsap.set(img, {
    clearProps: "all",
  });
  

  gsap.set(img, {
    opacity: 1,
    left: cachedMousePos.x,
    top: cachedMousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  playAnimation(img);

  index++;
}

document.addEventListener("DOMContentLoaded", () => {
  const rails = document.querySelectorAll(".scrolling-text .rail");
  if (!rails.length || typeof gsap === "undefined") return;

  rails.forEach((rail) => {
    const originalContent = rail.innerHTML;
    rail.innerHTML = originalContent + originalContent + originalContent;

    const totalWidth = rail.scrollWidth;
    const singleWidth = totalWidth / 3;
    const isReverse = rail.closest(".scrolling-text")?.classList.contains("reverse");
    const minX = -singleWidth;
    const maxX = 0;
    const fromX = isReverse ? minX : maxX;
    const toX = isReverse ? maxX : minX;

    gsap.fromTo(
      rail,
      { x: fromX },
      {
        x: toX,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (value) => `${gsap.utils.wrap(minX, maxX, parseFloat(value))}px`
        }
      }
    );
  });
});
