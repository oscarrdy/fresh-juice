// Custom select component
class Select {

  // Constructor
  constructor(element) {
    this.element = element;
    this.options = getFormattedOptions(element.querySelectorAll("option"));
    this.customElement = document.createElement("div");
    this.labelElement = document.createElement("span");
    this.optionsCustomElement = document.createElement("ul");
    setupCustomElement(this);
    element.style.display = "none";
    element.after(this.customElement);
    this.hasTimeout = false;
    this.hasQueue = false;
    this.queue;
    this.queueStart;
  }

  // Gets the selected option as an object
  get selectedOption() {
    return this.options.find(option => option.selected);
  }

  // Gets the index of the selected option
  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  // Sets the given value as the selected option
  selectValue(value) {
    const newSelectedOption = this.options.find(option => option.value === value);
    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.labelElement.innerText = newSelectedOption.label;
    this.optionsCustomElement.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove("selected")
    const newCustomElement = this.optionsCustomElement.querySelector(`[data-value="${newSelectedOption.value}"]`);
    newCustomElement.classList.add("selected");
    newCustomElement.scrollIntoView({ block: "nearest" });
    
    if (!this.element.getAttribute("data-selected-currency")) {
      this.element.dispatchEvent(new Event('change'));
      return;
    }
    if (window.location.pathname !== "/shop") {
      this.element.dispatchEvent(new Event('change'));
      return;
    }

    myShop.startLoadingAnimation();
    const CUR_DELAY = 2500;

    function addTimeout(t) {
      t.hasTimeout = true;
      setTimeout(() => {
        t.hasTimeout = false;
      }, CUR_DELAY);
    }

    function addToQueue(t) {
      if (t.hasQueue) {
        var delay = CUR_DELAY - (new Date(Date.now()) - t.queueStart);
        delay = (delay < 0) ? 0 : delay;
      } else {
        var delay = CUR_DELAY;
        t.queueStart = new Date(Date.now());
      }
      clearTimeout(t.queue);
      t.hasQueue = true;
      t.queue = setTimeout(() => {
        addTimeout(t);
        t.hasQueue = false;
        t.element.dispatchEvent(new Event('change'));
      }, delay);
    }

    function addReq(t) {
      if (t.hasTimeout || t.hasQueue) {
        addToQueue(t);
      } else {
        addTimeout(t);
        t.element.dispatchEvent(new Event('change'));
      }
    }
    addReq(this);
  }
}

// Constructs the custom select element from the given select element
function setupCustomElement(select) {
  select.customElement.classList = select.element.classList;
  if (select.element.getAttribute("data-tool-tip")) {
    select.customElement.setAttribute("data-tool-tip", select.element.getAttribute("data-tool-tip"));
  }
  select.customElement.classList.add("custom-select-container");
  select.customElement.tabIndex = 0;

  select.labelElement.innerText = select.selectedOption.label;
  select.customElement.append(select.labelElement);

  select.options.forEach(option => {
    const optionElement = document.createElement("li");
    optionElement.classList.toggle("selected", option.selected);
    optionElement.innerText = option.label;
    optionElement.dataset.value = option.value;
    optionElement.addEventListener("click", () => {
      select.selectValue(option.value);
      select.customElement.classList.remove("shown");
    });
    select.optionsCustomElement.append(optionElement);
  });
  select.customElement.append(select.optionsCustomElement);

  select.labelElement.addEventListener("click", () => {
    select.customElement.classList.toggle("shown");
  });

  select.customElement.addEventListener("blur", () => {
    select.customElement.classList.remove("shown");
  });

  let debounceTimeout;
  let searchTerm = "";
  select.customElement.addEventListener("keydown", e => {
    switch (e.code) {
      case "Space":
        e.preventDefault();
        select.customElement.classList.toggle("shown");
        break;
      case "ArrowUp": {
        e.preventDefault();
        const prevOption = select.options[select.selectedOptionIndex - 1];
        if (prevOption) {
          select.selectValue(prevOption.value);
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const nextOption = select.options[select.selectedOptionIndex + 1];
        if (nextOption) {
          select.selectValue(nextOption.value);
        }
        break;
      }
      case "Enter":
      case "Escape":
        select.customElement.classList.remove("shown");
        break;
      default: {
        clearTimeout(debounceTimeout);
        searchTerm += e.key;
        debounceTimeout = setTimeout(() => {
          searchTerm = "";
        }, 500);

        const searchedOption = select.options.find(option => {
          return option.label.toLowerCase().startsWith(searchTerm);
        });
        if (searchedOption) {
          select.selectValue(searchedOption.value);
        }
      }
    }
  });
}

// Formats the given option elements into an array of objects
function getFormattedOptions(optionElements) {
  return [...optionElements].map(optionElement => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement,
    }
  });
}



// Select all custom select elements form the document and create a Select object for each
const selectElements = document.querySelectorAll("[data-custom-select]");
selectElements.forEach(selectElement => {
  new Select(selectElement)
});