export default function loadReservations() {
  const content = document.getElementById("content");

  const contactContainer = document.createElement("div");
  contactContainer.classList.add("contact-container");

  const heading = document.createElement("h2");
  heading.textContent = "Reserve Your Seat";

  const info = document.createElement("p");
  info.textContent =
    "The Valkyries are busy. Send a raven or leave a message below.";

  const details = document.createElement("div");
  details.innerHTML = `
        <p><strong>Location:</strong> Asgard, Hall 4</p>
        <p><strong>Raven Post:</strong> feast@valhalla.gods</p>
    `;
  details.style.marginTop = "20px";
  details.style.color = "#88C0D0";

  contactContainer.appendChild(heading);
  contactContainer.appendChild(info);
  contactContainer.appendChild(details);
  content.appendChild(contactContainer);
}
