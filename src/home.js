import restaurantImage from "./assets/restaurant.png";

export default function loadHome() {
  const content = document.getElementById("content");

  // Always clear the content before loading a new page view
  content.innerHTML = "";

  // Create elements
  const hero = document.createElement("div");
  hero.classList.add("hero");

  const headline = document.createElement("h2");
  headline.textContent = "Eat Like a God";

  const centerImage = document.createElement("img");
  centerImage.src = restaurantImage;
  centerImage.style.height = "50vh";
  centerImage.style.borderRadius = "10px";

  const description = document.createElement("p");
  description.textContent =
    "Welcome to Valhalla Feast. We serve the finest boar, mead, and roots worthy of Odin himself. Experience the taste of the nine realms in our grand hall, where the brave dine eternal.";

  const cta = document.createElement("p");
  cta.textContent =
    "Open from dusk 'til dawn. Raise your horn and join the immortal banquet!";
  cta.style.fontWeight = "bold";
  cta.style.color = "#EBCB8B";

  // Append elements to hero container
  hero.appendChild(headline);
  hero.appendChild(centerImage);
  hero.appendChild(description);
  hero.appendChild(cta);

  // Append hero to main content
  content.appendChild(hero);
}
