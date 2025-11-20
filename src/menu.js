// Images for the dishes
import roastBoar from "./assets/roast-boar.png";
import steak from "./assets/steak.png";
import salad from "./assets/salad.png";
import honeyMead from "./assets/honey-mead.png";

export default function loadMenu() {
  const content = document.getElementById("content");

  // Always clear the content before loading a new page view
  content.innerHTML = "";

  const menuContainer = document.createElement("div");
  menuContainer.classList.add("menu-container");

  const heading = document.createElement("h2");
  heading.textContent = "The Feast";

  const menuGrid = document.createElement("div");
  menuGrid.classList.add("menu-grid");

  // Helper function is updated to accept a fourth argument: imagePath
  const createMenuItem = (name, desc, price, image) => {
    const item = document.createElement("div");
    item.classList.add("menu-item");

    // Create the image element
    const itemImage = document.createElement("img");
    itemImage.src = image;
    itemImage.alt = name;
    itemImage.classList.add("menu-item-icon");

    const itemName = document.createElement("h3");
    itemName.textContent = name;

    const itemDesc = document.createElement("p");
    itemDesc.textContent = desc;

    const itemPrice = document.createElement("div");
    itemPrice.classList.add("price");
    itemPrice.textContent = price;

    // Append the image first, then the text elements
    item.appendChild(itemImage);
    item.appendChild(itemName);
    item.appendChild(itemDesc);
    item.appendChild(itemPrice);
    return item;
  };

  // Add items - now passing the URL constants
  menuGrid.appendChild(
    createMenuItem(
      "Sæhrímnir's Roast",
      "Slow-roasted wild boar with root vegetables—a meal worthy of resurrection.",
      "25 Gold",
      roastBoar
    )
  );

  menuGrid.appendChild(
    createMenuItem(
      "Thor's Hammer",
      "A massive, bone-in ribeye steak that delivers a mighty blow of flavor.",
      "35 Gold",
      steak
    )
  );

  menuGrid.appendChild(
    createMenuItem(
      "Freyja's Salad",
      "Foraged greens, wild berries, and soft goat cheese, light enough to fly.",
      "18 Gold",
      salad
    )
  );

  menuGrid.appendChild(
    createMenuItem(
      "Odin's Mead",
      "Honey wine brewed in the high halls—drink deeply and gain wisdom.",
      "10 Gold",
      honeyMead
    )
  );

  menuContainer.appendChild(heading);
  menuContainer.appendChild(menuGrid);
  content.appendChild(menuContainer);
}
