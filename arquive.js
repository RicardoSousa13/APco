// -------------------------------
// 👇 GLOBAL PROJECT STORAGE
// -------------------------------
let allProjects = [];

// -------------------------------
// 👇 FETCH DATA FROM JSON FILE
// -------------------------------
fetch("projects.json")
  .then((response) => response.json())
  .then((data) => {
    allProjects = data.projects;

    // Populate dropdown filters
    populateFilters(allProjects);

    // Initial render: all non-featured projects
    renderProjects(allProjects, false);
  });

// -------------------------------
// 👇 RENDER PROJECTS INTO THE PAGE
// -------------------------------
function renderProjects(projects, showFeaturedOnly = false) {
  const archiveList = document.querySelector(".archive-list");
  archiveList.innerHTML = ""; // Clear previous content

  const visibleProjects = projects.filter((project) => {
    if (showFeaturedOnly) return project.type === "featured";
    return project.type !== "featured";
  });

  visibleProjects.forEach((project, index) => {
    const details = document.createElement("details");
    details.setAttribute("data-type", project.type);
    details.setAttribute("data-year", project.year);
    details.setAttribute("data-local", project.local);
    details.setAttribute("data-category", project.category);
    details.setAttribute("data-featured", project.type === "featured");

    // If featured, add special class and open by default
    if (project.type === "featured") {
      details.classList.add("featured-project");
      details.setAttribute("open", true);
    }

    // Create <summary> block
    const summary = document.createElement("summary");
    summary.className = "sections archive-grid";

    summary.innerHTML = `
  <div class="collab">${project.collab || ""}</div>
  <div class="year">${project.year || ""}</div>
  <div class="title">${project.title || ""}</div>
  <div class="local">${project.local || ""}</div>
  <div class="category">${project.category || ""}</div>
  <div class="status">${project.status || ""}</div>
`;

    details.appendChild(summary);

    // If expandable or featured, add content block
    if (project.type === "expandable" || project.type === "featured") {
      const content = document.createElement("div");
      content.className = "project-content";

      // Create the horizontal image
      const imgHorizontal = document.createElement("img");
      imgHorizontal.src = project.imageHorizontal;
      imgHorizontal.alt = "Horizontal image";

      // Create the vertical image
      const imgVertical = document.createElement("img");
      imgVertical.src = project.imageVertical;
      imgVertical.alt = "Vertical image";

      // Create the info container
      const info = document.createElement("div");
      info.className = "project-info";

      // Create the description paragraph
      const description = document.createElement("p");
      description.innerHTML = project.description;

      // Append the description to the info block
      info.appendChild(description);

      // If featured, add the link inside the info block
      if (project.type === "featured" && project.link) {
        const link = document.createElement("a");
        link.href = project.link;
        link.textContent = "View Project → ";
        link.classList.add("featured-link");
        info.appendChild(link);
      }

      // Append all to content
      content.appendChild(imgHorizontal);
      content.appendChild(imgVertical);
      content.appendChild(info);

      // Finally, append content to the project <details>
      details.appendChild(content);
    }

    archiveList.appendChild(details);
  });

  // Update project count
  document.getElementById(
    "project-counter"
  ).textContent = `${visibleProjects.length} project(s)`;
}

// -------------------------------
// 👇 POPULATE DROPDOWN FILTERS
// -------------------------------
function populateFilters(projects) {
  const collaborations = new Set();
  const locals = new Set();
  const categories = new Set();
  const years = new Set();

  projects.forEach((project) => {
    if (project.type !== "featured") {
      collaborations.add(project.collab);
      locals.add(project.local);
      categories.add(project.category);
      years.add(project.year);
    }
  });

  fillSelect("filter-collaboration", collaborations);
  fillSelect("filter-local", locals);
  fillSelect("filter-category", categories);
  fillSelect("filter-year", years);
}

function fillSelect(id, items) {
  const select = document.getElementById(id);
  [...items].sort().forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

// -------------------------------
// 👇 DROPDOWN FILTER HANDLING
// -------------------------------
function filterAndRender() {
  const selectedCollab = document.getElementById("filter-collaboration").value;
  const selectedLocal = document.getElementById("filter-local").value;
  const selectedCategory = document.getElementById("filter-category").value;
  const selectedYear = document.getElementById("filter-year").value;

  const filtered = allProjects.filter((project) => {
    if (project.type === "featured") return false;

    const matchCollab =
      selectedCollab === "all" || project.collab === selectedCollab;
    const matchLocal =
      selectedLocal === "all" || project.local === selectedLocal;
    const matchCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchYear = selectedYear === "all" || project.year === selectedYear;

    return matchCollab && matchLocal && matchCategory && matchYear;
  });

  renderProjects(filtered, false);
}

// Attach change event listeners to dropdowns
[
  "filter-collaboration",
  "filter-local",
  "filter-category",
  "filter-year",
].forEach((id) => {
  document.getElementById(id).addEventListener("change", filterAndRender);
});

// -------------------------------
// 👇 FEATURED / ALL BUTTONS
// -------------------------------
document
  .querySelector('[data-filter="featured"]')
  .addEventListener("click", () => {
    renderProjects(allProjects, true); // only featured
  });

document.querySelector('[data-filter="all"]').addEventListener("click", () => {
  renderProjects(allProjects, false); // reset to all non-featured
});
