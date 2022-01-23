/**
 * Once this script is loaded, you'll have access to a global variable
 * called Restaurants. Remember to load your scripts in the correct order
 * though. If loaded in the improper order, scripts loaded before this one
 * may not have access to the Restaurants object.
 */
const Restaurants = {
  arbys: {
    path: "./assets/images/arbys.jpg",
    tier: "UNKNOWN",
  },
  bk: {
    path: "./assets/images/bk.jpg",
    tier: "UNKNOWN",
  },
  canes: {
    path: "./assets/images/canes.jpg",
    tier: "UNKNOWN",
  },
  carlsjr: {
    path: "./assets/images/carlsjr.jpg",
    tier: "UNKNOWN",
  },
  chickfila: {
    path: "./assets/images/chickfila.jpg",
    tier: "UNKNOWN",
  },
  chipotle: {
    path: "./assets/images/chipotle.jpg",
    tier: "UNKNOWN",
  },
  dennys: {
    path: "./assets/images/dennys.jpg",
    tier: "UNKNOWN",
  },
  dominos: {
    path: "./assets/images/dominos.jpg",
    tier: "UNKNOWN",
  },
  elpolloloco: {
    path: "./assets/images/elpolloloco.jpg",
    tier: "UNKNOWN",
  },
  fiveguys: {
    path: "./assets/images/fiveguys.jpg",
    tier: "UNKNOWN",
  },
  ihop: {
    path: "./assets/images/ihop.jpg",
    tier: "UNKNOWN",
  },
  innout: {
    path: "./assets/images/innout.jpg",
    tier: "UNKNOWN",
  },
  jackinthebox: {
    path: "./assets/images/jackinthebox.jpg",
    tier: "UNKNOWN",
  },
  kfc: {
    path: "./assets/images/kfc.jpg",
    tier: "UNKNOWN",
  },
  mcdonalds: {
    path: "./assets/images/mcdonalds.jpg",
    tier: "UNKNOWN",
  },
  panda: {
    path: "./assets/images/panda.jpg",
    tier: "UNKNOWN",
  },
  panera: {
    path: "./assets/images/panera.jpg",
    tier: "UNKNOWN",
  },
  popeyes: {
    path: "./assets/images/popeyes.jpg",
    tier: "UNKNOWN",
  },
  shackeshack: {
    path: "./assets/images/shakeshack.jpg",
    tier: "UNKNOWN",
  },
  sonic: {
    path: "./assets/images/sonic.jpg",
    tier: "UNKNOWN",
  },
  tacobell: {
    path: "./assets/images/tacobell.jpg",
    tier: "UNKNOWN",
  },
  whataburger: {
    path: "./assets/images/whataburger.jpg",
    tier: "UNKNOWN",
  },
  wingstop: {
    tier: "UNKNOWN",
    path: "./assets/images/wingstop.jpg",
  },
};

/**
 * @function loadTierData
 * @description checks localStorage for a "restaurants" key
 *              -> if it exists and has parseable JSON data, sets the tiers
 *                  for each restaurant whose tier has been saved.
 *                -> if JSON data isn't parseable, deletes that key
 *              -> else it does nothing
 */
const loadTierData = function () {};

/**
 * @function loadRestaurantImagesIntoTiers
 * @description For each restaurant of Restaurants, creates a restaurant <img>
 *              you can drag into any tier container
 */
const loadRestaurantImagesIntoTiers = function () {
  for (const[restaurantName, restaurantInfo] of Object.entries(Restaurants)) {
    let img = document.createElement('img')
    img.src = restaurantInfo.path
    img.id = restaurantName
    document.querySelector("[data-tier = '?'] .tier-container").appendChild(img)
  }

  // draggable code
  let dragged;

  /* events fired on the draggable target */
  document.addEventListener("dragstart", function(event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = .5;
  });

  document.addEventListener("dragend", function(event) {
    // reset the transparency
    event.target.style.opacity = "";
  });

  document.addEventListener("drop", function(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    if (event.target.className === "tier-container") {
      event.target.style.background = "";
      dragged.parentNode.removeChild(dragged);
      event.target.appendChild(dragged);
    }
  });
};

/**
 * @task add an event listener for the DOMContentLoaded event
 * that loads all the restaurant images into different tiers
 */
document.addEventListener("DOMContentLoaded", loadRestaurantImagesIntoTiers())
