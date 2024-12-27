import { Component } from "https://cdn.devetty.es/ScopeJS/js";
import { resources } from "./config/constants.js";

Component({
  controller: function () {
    const categories = [...new Set(resources.flatMap((resource) => resource.categories))];

    this.filters = {
      search: "",
      categories: {
        ...categories.reduce((acc, category) => ({ ...acc, [category]: false }), {}),
      },
    };

    this.selectCategory = (category) => {
      this.filters.categories = {
        ...this.filters.categories,
        [category]: !this.filters.categories[category],
      };
      this.apply();
    };

    this.search = (event) => {
      this.filters.search = event.target.value;
      this.apply();
    };

    this.filterResources = () => {
      const any_active = Object.values(this.filters.categories).some((value) => value);
      return resources.filter((resource) => {
        if (!this.filters.search) {
          if (!any_active) {
            return true;
          }
          let active = false;
          for (const category of resource.categories) {
            if (this.filters.categories[category]) {
              active = true;
              break;
            }
          }
          return active;
        }

        if (!any_active) {
          return resource.name.toLowerCase().includes(this.filters.search.toLowerCase()) || resource.description.toLowerCase().includes(this.filters.search.toLowerCase());
        }

        let active = false;
        if (resource.name.toLowerCase().includes(this.filters.search.toLowerCase()) || resource.description.toLowerCase().includes(this.filters.search.toLowerCase())) {
          for (const category of resource.categories) {
            if (this.filters.categories[category]) {
              active = true;
              break;
            }
          }
        }

        return active;
      });
    };
  },
  render: function () {
    return /* HTML */ `
      <header class="section-header">
        <div class="container">
          <h1>Hub de Utilidades</h1>
          <p>Las mejores herramientas para optimizar tu flujo de trabajo, al alcance de un clic.</p>

          <form>
            <input oninput="search()" type="search" placeholder="Buscar..." />
          </form>

          <nav>
            <ul>
              ${Object.keys(this.filters.categories)
                .map((category) => /* HTML */ ` <li onclick="selectCategory('${category}')" ${this.filters.categories[category] ? "class='active'" : ""}>${category}</li> `)
                .join("")}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          ${this.filterResources().length === 0 ? /* HTML */ `<p style="text-align: center; padding: 2rem 0">No se encontraron recursos</p>` : ""}

          <ul class="resources">
            ${this.filterResources()
              .map(
                (resource) => /* HTML */ `
                  <li class="resource">
                    <img lazy src="${resource.icon}" alt="${resource.name}" />
                    <div style="max-width: calc(100% - 3rem - 7rem)">
                      <h3>${resource.name}</h3>
                      <p>${resource.description}</p>
                      <ul>
                        ${resource.categories.map((category) => /* HTML */ `<li onclick="selectCategory('${category}')" ${this.filters.categories[category] ? "class='active'" : ""}>${category}</li>`).join("")}
                      </ul>
                    </div>
                    <div style="flex: 1"></div>
                    <a href="${resource.url}" target="_blank"> Ver </a>
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      </main>

      <footer>
        <a href="https://github.com/PabloTheBlink/HUB" target="_blank">
          <img lazy src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" />
        </a>
      </footer>
    `;
  },
}).render(document.body);
