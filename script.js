'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault(); // Link with a hyperlink, that will make jump to the top. To prevent this, we added this code here!!
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//13.181
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
// Nicer way instead of using for loop!
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//13.185

//Button Scrolling
buttonScrollTo.addEventListener('click', function (e) {
  //const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  //console.log(e.target.getBoundingClientRect());

  //console.log('Current Scroll X/Y', window.pageXOffset, window.pageYOffset); //0 0

  // console.log(
  //   'Current Height/Width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); //Current Height/Width viewport 937 1319

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

//Unnecessarily increasing the complexity
// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log(this);
//     // console.log(this.getAttribute('href'));
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

//Alternative - Event Delegation
//1.Add event listener to the common parent element
//2.Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching Strategy
  if (e.target.href?.includes('section')) {
    const id = e.target.getAttribute('href');
    const idCoords = document.querySelector(id).getBoundingClientRect();
    window.scrollTo({
      left: idCoords.left + window.pageXOffset,
      top: idCoords.top + window.pageYOffset,
      behavior: 'smooth',
    });
    //document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
//Use Event Delegation - common parent of all the elements that we're interested in
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard clause
  if (!clicked) return;
  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Activate Tab
  clicked.classList.add('operations__tab--active');
  //Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu Fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//Passing "arguments" to handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation using Scroll Event
// const initialCoord = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Sticky Navigation using Intersection Observer API
// const options = {
//   root: null, //The element that target is intersecting. (Target is section 1 here)
//   threshold: [0, 0.2], //Percentage of intersection at which the observer callback will be called.
//   //Percentage that we want to have visible in our root.
// };

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const observer = new IntersectionObserver(obsCallback, options);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Revealing Sections on Scroll
const allSections = document.querySelectorAll('.section');
const revealSec = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (sec) {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries; //We have only 1 threshold so only 1 entries.
  console.log(entry);
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

//Slider Component
// const slides = document.querySelectorAll('.slide');
// const btnLeft = document.querySelector('.slider__btn--left');
// const btnRight = document.querySelector('slider__.btn--right');
// let currentSlide = 0;
// const maxSlide = slides.length;
// //Next Slide
// btnRight.addEventListener('click', function () {
//   if (currentSlide === maxSlide - 1) {
//     currentSlide = 0;
//   } else {
//     currentSlide++;
//   }

//   slides.forEach(
//     (s, i) => (s.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
//   );
// });

/*
//Course
//13.183
console.log(document.documentElement);

console.log(document.head);
console.log(document.body);

const allSection = document.querySelectorAll('.section');

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved functionality!!';
message.innerHTML =
  'We use cookies for improved functionality!!<button class="btn btn--close-cookie">Got it!</button>';
console.log(message);
//header.prepend(message);
header.append(message);
//header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

//13.184
message.style.backgroundColor = ' #37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor); //rgb(55, 56, 61)

console.log(getComputedStyle(message).color); //rgb(187, 187, 187)
console.log(getComputedStyle(message).height); //50px

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

const logo = document.querySelector('.nav__logo');
console.log(logo.alt); //Bankist logo
console.log(logo.src); //http://127.0.0.1:5500/img/logo.png
console.log(logo.getAttribute('src')); //img/logo.png

console.log(logo.designer); //undefined
console.log(logo.className); //nav__logo

logo.alt = 'Beautiful minimalist logo';

console.log(logo.getAttribute('designer')); //jonas
logo.setAttribute('company', 'Bankist');

console.log(logo.dataset.versionNumber); //3.0

logo.classList.add('c', 'a');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

logo.className = 'jonas';

//13.186
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: You are reading the heading!');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: You are reading the heading!');
// };

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true
);

//13.190
const h1 = document.querySelector('h1');
//Going Downwards - Selecting Child Elements
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going Upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways - sibling
console.log(h1.previousElementSibling); //null
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML is parsed and DOM Tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded');
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
