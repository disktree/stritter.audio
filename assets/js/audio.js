'use strict';

let activeItem;

const ol = document.querySelector('ol[data-type="playlist"]');
const items = ol.querySelectorAll("li");

ol.style.opacity = "0";
window.onload = e => {
  ol.style.opacity = "1";
}


items.forEach(item => {
  const audio = item.querySelector("audio");
  audio.onplay = e => {
    if (activeItem) {
      const activeItemAudio = activeItem.querySelector("audio");
      activeItemAudio.pause();
      //activeItemAudio.currentTime = 0;
      activeItem.classList.remove("active");
    }
    activeItem = item;
    item.classList.toggle("active")
  }
  /*
  console.log(item.getAttribute("href"));
  item.onclick = e=>{
    console.log("click "+item.getAttribute("href"));
    e.preventDefault();
  }
  */
})
