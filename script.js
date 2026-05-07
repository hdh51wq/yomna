document.addEventListener('DOMContentLoaded', () => {
  const runawayBtn = document.getElementById('runaway-btn');
  const introScreen = document.getElementById('intro-screen');
  const mainSite = document.getElementById('main-site');
  const clickCounter = document.getElementById('attempts');
  const tauntText = document.getElementById('taunt-text');

  let clicks = 0;
  const taunts = [
    "Missed me!",
    "Too slow! 😜",
    "Is that all you got?",
    "Okay okay, you win..."
  ];

  // Random position generator
  function moveButton() {
    const btnWidth = runawayBtn.offsetWidth;
    const btnHeight = runawayBtn.offsetHeight;
    
    const maxX = window.innerWidth - btnWidth - 20;
    const maxY = window.innerHeight - btnHeight - 20;

    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    const randomY = Math.max(20, Math.floor(Math.random() * maxY));

    runawayBtn.style.position = 'absolute';
    runawayBtn.style.left = randomX + 'px';
    runawayBtn.style.top = randomY + 'px';
  }

  runawayBtn.addEventListener('click', () => {
    clicks++;
    clickCounter.textContent = clicks;

    if (clicks <= 3) {
      moveButton();
      tauntText.textContent = taunts[clicks - 1];
      tauntText.style.opacity = '1';
      setTimeout(() => { tauntText.style.opacity = '0'; }, 1000);
    } else {
      // 4th click - enter website
      runawayBtn.style.display = 'none';
      tauntText.textContent = taunts[3];
      tauntText.style.opacity = '1';
      
      setTimeout(() => {
        enterWebsite();
      }, 1000);
    }
  });

  function enterWebsite() {
    introScreen.classList.add('hidden');
    document.body.classList.add('site-active');
    
    // Add Justin Bieber - Baby playing at 43 seconds
    const musicIframe = document.createElement('iframe');
    musicIframe.style.display = 'none';
    musicIframe.allow = 'autoplay';
    musicIframe.src = 'https://www.youtube.com/embed/kffacxfA7G4?autoplay=1&start=43';
    document.body.appendChild(musicIframe);
    
    setTimeout(() => {
      introScreen.style.display = 'none';
      mainSite.style.display = 'block';
      initStars();
      startBookSlideshow();
    }, 1000);
  }

  function initStars() {
    const starsEl = document.getElementById('stars');
    const starChars = ['✦','✧','⋆','★','☆','✶'];
    for(let i=0; i<40; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      s.textContent = starChars[Math.floor(Math.random()*starChars.length)];
      s.style.left = Math.random()*100+'%';
      s.style.top = Math.random()*100+'%';
      s.style.animationDelay = Math.random()*3+'s';
      s.style.fontSize = (12+Math.random()*16)+'px';
      s.style.color = ['#f5c518','#ffe066','#ffb300','#ff9800'][Math.floor(Math.random()*4)];
      starsEl.appendChild(s);
    }
  }

  function startBookSlideshow() {
    const pages = Array.from(document.querySelectorAll('.book-page'));
    playPage(pages, 0);
  }

  function playPage(pages, index) {
    if (index >= pages.length) return;

    const currentPage = pages[index];
    
    // Slide/flip in the current page
    currentPage.classList.add('active');

    // Get all texts that need to be revealed on this page
    const revealTexts = Array.from(currentPage.querySelectorAll('.reveal-text'));
    
    let totalRevealTime = 0;

    // Sequentially reveal each text block
    revealTexts.forEach((el, i) => {
      const delay = 800 + (i * 600); // Wait 800ms for page to settle, then 600ms per text
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      totalRevealTime = delay;
    });

    // Animate meters if this page has them
    const hasMeters = currentPage.querySelector('.meter-bar');
    if (hasMeters) {
      setTimeout(animateMeters, totalRevealTime + 600);
      totalRevealTime += 1500; // Give meters time to animate
    }

    // If it's not the last page, wait reading time then flip to next
    if (index < pages.length - 1) {
      const readingTime = 3500; // Time to read after all items revealed
      const timeToNextPage = totalRevealTime + readingTime;

      setTimeout(() => {
        // Flip current page away to the left
        currentPage.classList.remove('active');
        currentPage.classList.add('past');
        
        // Start next page slightly before this one finishes sliding away
        setTimeout(() => {
          playPage(pages, index + 1);
        }, 600);
        
      }, timeToNextPage);
    }
  }

  function animateMeters() {
    if (document.getElementById('bar1').style.width !== '0px' && document.getElementById('bar1').style.width !== '') return;

    ['bar1','bar2','bar3','bar4'].forEach((id, i) => {
      const bar = document.getElementById(id);
      const pct = document.getElementById('pct'+(i+1));
      const val = Math.min(parseInt(bar.dataset.val), 100);
      
      setTimeout(() => {
        bar.style.width = val + '%';
        let count = 0;
        const ticker = setInterval(() => {
          count += 2; 
          pct.textContent = Math.min(count, val) + '%';
          if(count >= val) clearInterval(ticker);
        }, 15);
      }, i * 200);
    });
  }

  window.makeWish = function() {
    document.getElementById('wish').style.display = 'block';
    document.querySelector('.wish-btn').style.display = 'none';
  };
});
