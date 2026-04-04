const books = [
  { title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic Fiction", status: "Available" },
  { title: "The Odyssey", author: "Homer", genre: "Epic Poetry", status: "Checked Out" },
  { title: "Beloved", author: "Toni Morrison", genre: "Historical Fiction", status: "Available" },
  { title: "Invisible Cities", author: "Italo Calvino", genre: "Literary Fiction", status: "Available" },
  { title: "The History of the Ancient World", author: "Susan Wise Bauer", genre: "History", status: "Checked Out" },
  { title: "Leaves of Grass", author: "Walt Whitman", genre: "Poetry", status: "Available" }
];

const members = [
  { name: "Elena Brooks", membership: "Gold", activity: "Borrowed 2 books this week", standing: "Excellent" },
  { name: "Marcus Hale", membership: "Standard", activity: "Due date reminder sent", standing: "Good" },
  { name: "Rina Patel", membership: "Student", activity: "Reserved a study table", standing: "Excellent" }
];

const loans = [
  { title: "The Odyssey", borrower: "Marcus Hale", due: "April 8, 2026", status: "Due Soon" },
  { title: "The History of the Ancient World", borrower: "Elena Brooks", due: "April 2, 2026", status: "Overdue" },
  { title: "Jane Eyre", borrower: "Rina Patel", due: "April 11, 2026", status: "On Loan" }
];

const overdueItems = [
  { title: "The History of the Ancient World", borrower: "Elena Brooks", overdueBy: "3 days", action: "Send courtesy email" },
  { title: "Collected Poems", borrower: "Marcus Hale", overdueBy: "7 days", action: "Call member" },
  { title: "A Room of One's Own", borrower: "Naomi Chen", overdueBy: "12 days", action: "Hold future loans" }
];

const storageKey = "libryconnect-auth";

if (!localStorage.getItem(storageKey)) {
  window.location.href = "login.html";
}

const panelButtons = document.querySelectorAll("[data-panel-target]");
const navButtons = document.querySelectorAll(".nav-button");
const panels = document.querySelectorAll(".info-panel");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const membersList = document.getElementById("membersList");
const loansList = document.getElementById("loansList");
const overdueList = document.getElementById("overdueList");
const logoutButton = document.getElementById("logoutButton");

function renderBooks(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    return [book.title, book.author, book.genre].some((value) =>
      value.toLowerCase().includes(normalizedQuery)
    );
  });

  searchResults.innerHTML = filteredBooks.length
    ? filteredBooks
        .map(
          (book) => `
            <article class="entry-card">
              <span class="pill">${book.status}</span>
              <h3>${book.title}</h3>
              <p>${book.author}</p>
              <p class="info-meta">${book.genre}</p>
            </article>
          `
        )
        .join("")
    : `
        <article class="entry-card">
          <h3>No matches found</h3>
          <p>Try another title, author, or genre.</p>
        </article>
      `;
}

function renderList(container, items, formatter) {
  container.innerHTML = items.map(formatter).join("");
}

function showPanel(panelId) {
  panels.forEach((panel) => {
    const isTarget = panel.id === panelId;
    panel.hidden = !isTarget;
    panel.classList.toggle("is-visible", isTarget);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelTarget === panelId);
  });
}

renderBooks();

renderList(
  membersList,
  members,
  (member) => `
    <article class="entry-card">
      <span class="pill">${member.membership}</span>
      <h3>${member.name}</h3>
      <p>${member.activity}</p>
      <p class="info-meta">Standing: ${member.standing}</p>
    </article>
  `
);

renderList(
  loansList,
  loans,
  (loan) => `
    <article class="entry-card">
      <span class="pill">${loan.status}</span>
      <h3>${loan.title}</h3>
      <p>Borrower: ${loan.borrower}</p>
      <p class="info-meta">Due: ${loan.due}</p>
    </article>
  `
);

renderList(
  overdueList,
  overdueItems,
  (item) => `
    <article class="entry-card">
      <span class="pill">${item.overdueBy}</span>
      <h3>${item.title}</h3>
      <p>Borrower: ${item.borrower}</p>
      <p class="info-meta">Next step: ${item.action}</p>
    </article>
  `
);

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPanel(button.dataset.panelTarget);
  });
});

searchInput.addEventListener("input", (event) => {
  renderBooks(event.target.value);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  window.location.href = "login.html";
});
