const TierColors = {
  S: "#44bd32",
  A: "#0097e6",
  B: "#8c7ae6",
  C: "#e1b12c",
  D: "#c23616",
  "?": "#7f8fa6",
};

/**
 * @function loadTierColors
 * @description For each .tier element, set the first child element's background
 *              color to the color specified in the TierColors variable.
 *
 */
const loadTierColors = function () {
  let tiers = document.querySelectorAll(".tier");
  tiers = Array.from(tiers)
  for (let i = 0; i < tiers.length; i++) {
    tiers[i].firstElementChild.style.backgroundColor = TierColors[tiers[i].dataset.tier]
  }
};

/**
 * @task Create drop listeners, make sure to the current state of the application
 * into localStorage once an item has been dropped into a tier.
 * Resource: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

/**
 * @function  createTierDropzones
 * @description turn each .tier-container into a droppable zone
 */
const createTierDropzones = function () {
  /* events fired on the drop targets */
  document.addEventListener("dragover", function(event) {
    // prevent default to allow drop if in tier-container
    if (event.target.className === "tier-container") {
      event.preventDefault();
    }
  });

  document.addEventListener("dragenter", function(event) {
    // highlight potential drop target when the draggable element enters it
    if (event.target.className === "tier-container") {
      event.target.style.background = "blue";
    }
  });

  document.addEventListener("dragleave", function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className === "tier-container") {
      event.target.style.background = "";
    }
  });
};

/**
 * @task Add an event listener for the DOMContentLoaded (just like in restaurant.js)
 * to loadTierColors and createTierDropzones
 */
document.addEventListener("DOMContentLoaded", loadTierColors())
document.addEventListener("DOMContentLoaded", createTierDropzones())

/**
 * @task Add an event listener for the dblClick function for the UNKNOWN data tier's h1
 * element to reset all the tiers and to store the new result
 */
document.addEventListener("dblclick", function(event) {
  if (event.target === document.querySelector("[data-tier = '?'] h1")) {
    let images = document.querySelectorAll("img");
    for (let i = 0; i < images.length; i++) {
      document.querySelector("[data-tier = '?'] .tier-container").appendChild(images[i])
    }
  }
});