const contactForm = document.getElementById("contact-form");
const contactList = document.getElementById("contact-list");
const searchInput = document.getElementById("search");

let contacts = [];
let currentPage = 1;
const contactsPerPage = 20;


contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !phone) {
        alert("Please enter a name and phone number.");
        return;
    }

    const contact = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email
    };

    contacts.push(contact);

// Show the page containing the newly added contact
currentPage = Math.ceil(contacts.length / contactsPerPage);

displayContacts();
    contactForm.reset();
});
function displayContacts() {
    const searchText = searchInput.value.trim().toLowerCase();

    // Filter contacts by name or phone number
    const filteredContacts = contacts.filter(function (contact) {
        return (
            contact.name.toLowerCase().includes(searchText) ||
            contact.phone.toLowerCase().includes(searchText)
        );
    });

    // Calculate total pages
    const totalPages = Math.ceil(
        filteredContacts.length / contactsPerPage
    );

    // Keep the current page valid after searching
    if (totalPages === 0) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    // Find which contacts belong on this page
    const startIndex = (currentPage - 1) * contactsPerPage;
    const pageContacts = filteredContacts.slice(
        startIndex,
        startIndex + contactsPerPage
    );

    // Clear the old list
    contactList.innerHTML = "";

    if (pageContacts.length === 0) {
        contactList.innerHTML = contacts.length === 0
            ? "<p>No contacts added yet.</p>"
            : "<p>No matching contacts found.</p>";
    }

    // Display only this page's contacts
    pageContacts.forEach(function (contact) {
        const card = document.createElement("div");

        card.style.padding = "15px";
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "8px";
        card.style.backgroundColor = "#ffffff";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <h3>${escapeHTML(contact.name)}</h3>
            <p>Phone: ${escapeHTML(contact.phone)}</p>
        `;

        card.addEventListener("click", function () {
            openContactModal(contact);
        });

        contactList.appendChild(card);
    });

    // Update pagination information
    const pageInfo = document.getElementById("page-info");
    const prevButton = document.getElementById("prev-btn");
    const nextButton = document.getElementById("next-btn");

    pageInfo.textContent = `Page ${currentPage} of ${Math.max(1, totalPages)}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = totalPages === 0 || currentPage >= totalPages;
}

// Previous page
document.getElementById("prev-btn").addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        displayContacts();
    }
});

// Next page
document.getElementById("next-btn").addEventListener("click", function () {
    currentPage++;
    displayContacts();
});

// Reset to page 1 when searching
searchInput.addEventListener("input", function () {
    currentPage = 1;
    displayContacts();
});


function openContactModal(contact) {
    document.getElementById("modal-name").textContent = contact.name;
    document.getElementById("modal-phone").textContent =
        "Phone: " + contact.phone;

    document.getElementById("modal-email").textContent =
        contact.email ? "Email: " + contact.email : "No email provided";

    document.getElementById("contact-modal").showModal();
}

document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("contact-modal").close();
});

searchInput.addEventListener("input", displayContacts);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}