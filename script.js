// Containers
const categoriesContainer = document.getElementById("categories");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

// Global variables
let checkboxes = [];
let categoryData = {}; // { categoryName: { checkboxes: [], textEl, fillEl } }

// Load checklist data
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    // Group items by category
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    // Create a card for each category
    for (const category in grouped) {
      // Card wrapper
      const card = document.createElement("div");
      card.className = "category-card";

      // Header + toggle button
      const header = document.createElement("h2");
      header.textContent = category;

      const toggle = document.createElement("button");
      toggle.textContent = "▼";
      toggle.className = "toggle-btn";
      header.appendChild(toggle);
      card.appendChild(header);

      // Category progress
      const catProgressText = document.createElement("p");
      catProgressText.textContent = "0% Complete";

      const catProgressBar = document.createElement("div");
      catProgressBar.className = "progress-bar";

      const catProgressFill = document.createElement("div");
      catProgressFill.className = "progress-fill";

      catProgressBar.appendChild(catProgressFill);
      card.appendChild(catProgressText);
      card.appendChild(catProgressBar);

      // Checklist UL
      const ul = document.createElement("ul");

      grouped[category].forEach(item => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = item.id;

        // Restore state from localStorage
        const saved = localStorage.getItem(item.id);
        if (saved === "true") checkbox.checked = true;

        const label = document.createElement("label");
        label.htmlFor = item.id;
        label.textContent = item.name;

        li.appendChild(checkbox);
        li.appendChild(label);
        ul.appendChild(li);

        // Track checkboxes globally & per category
        checkboxes.push(checkbox);
        if (!categoryData[category]) {
          categoryData[category] = { checkboxes: [], textEl: catProgressText, fillEl: catProgressFill };
        }
        categoryData[category].checkboxes.push(checkbox);

        // Update progress on change
        checkbox.addEventListener("change", updateProgress);
      });

      card.appendChild(ul);
      categoriesContainer.appendChild(card);

      // Collapsible toggle
      toggle.addEventListener("click", () => {
        ul.classList.toggle("hidden");
        toggle.textContent = ul.classList.contains("hidden") ? "►" : "▼";
      });
    }

    // Initial progress update
    updateProgress();
  });

// Update both global and category progress bars
function updateProgress() {
  // Global progress
  const total = checkboxes.length;
  const checked = checkboxes.filter(cb => cb.checked).length;
  const percent = Math.round((checked / total) * 100);

  progressText.textContent = percent + "% Complete";
  progressFill.style.width = percent + "%";

  // Category progress
  for (const category in categoryData) {
    const catCbs = categoryData[category].checkboxes;
    const totalCat = catCbs.length;
    const checkedCat = catCbs.filter(cb => cb.checked).length;
    const percentCat = Math.round((checkedCat / totalCat) * 100);

    categoryData[category].textEl.textContent = percentCat + "% Complete";
    categoryData[category].fillEl.style.width = percentCat + "%";
  }

  // Save state to localStorage
  checkboxes.forEach(cb => {
    localStorage.setItem(cb.id, cb.checked);
  });
}
