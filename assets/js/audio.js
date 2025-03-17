'use strict';


const ol = document.querySelector('ol[data-type="playlist"]');
const items = ol.querySelectorAll("li");
const info = document.getElementById("audio-info")

// ol.style.opacity = "0";
// window.onload = () => {
//   ol.style.opacity = "1";
// }

let activeItem;

/*
function setActiveItem(item) {
  // if (activeItem) {
  //   // const activeItemAudio = activeItem.querySelector("audio");
  //   // activeItemAudio.pause();
  //   //activeItemAudio.currentTime = 0;
  //   activeItem.classList.remove("active");
  // }
  if (item) {
    activeItem = item;
    item.classList.add("active")
    info.textContent = item.querySelector(".title").textContent;
  } else {
    //item.classList.remove("active")
    if (activeItem) {
      //activeItem.classList.remove("active")
    }
    activeItem = null;
    //info.textContent = "";
  }
}
*/

items.forEach(item => {
  const audio = item.querySelector("audio");
  audio.onpause = e => {
    //console.log("pause")
    item.classList.remove("active")
    //info.textContent = "";
    // activeItem = null;
  }
  // audio.onended = e => {
  //   console.log("end")
  //   // setActiveItem(null);
  // }
  audio.onplay = e => {
    //console.log("play")
    //setActiveItem(item);
    if (activeItem && activeItem !== item) {
      const activeItemAudio = activeItem.querySelector("audio");
      activeItemAudio.pause();
      //activeItemAudio.currentTime = 0;
      activeItem.classList.remove("active");
    }
    activeItem = item;
    item.classList.toggle("active")
    //info.textContent = item.querySelector(".title").textContent;
  }
  /*
  //console.log(item.getAttribute("href"));
  item.onclick = e=>{
    console.log("click "+item.getAttribute("href"));
    e.preventDefault();
  }
  */
})
