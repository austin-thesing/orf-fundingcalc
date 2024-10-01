document.addEventListener("DOMContentLoaded", function () {
  const range = document.getElementById("myRange");
  const rangeValue = document.getElementById("sliderValue");
  const slider = document.getElementById("myRange"); // Removed duplicate declaration
  const sliderValueDisplay = document.getElementById("sliderValue"); // Removed duplicate declaration
  const calculateButton = document.querySelector(".calculate-button");
  const fundingAmountDisplay = document.querySelector(".funding-amount");

  function updateSliderValue(value) {
    let newValue;
    if (value <= 25000) {
      newValue = Math.ceil(value / 1000) * 1000;
    } else if (value <= 100000) {
      newValue = Math.ceil(value / 5000) * 5000;
    } else {
      newValue = Math.ceil(value / 10000) * 10000;
    }
    range.value = newValue;
    // Ensure slider.max is treated as a number for comparison
    const isMaxValue = value >= parseInt(slider.max, 10);
    const displayValue = isMaxValue ? `$${new Intl.NumberFormat().format(newValue)}+` : `$${new Intl.NumberFormat().format(newValue)}`;
    rangeValue.innerHTML = displayValue;
  }

  function calculateOffer(revenue) {
    let offer = Math.min(revenue * 3 * 0.4, 400000);
    return offer;
  }

  function updateSliderFill() {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #fff ${percentage}%, #fff 100%)`;
  }

  function toggleDisplay(selector, shouldShow, displayStyle = "block") {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = shouldShow ? displayStyle : "none";
    }
  }

  slider.oninput = function () {
    updateSliderValue(this.valueAsNumber);
    updateSliderFill();
    // Check if the slider is at its maximum value and append a "+" sign
    const isMaxValue = this.valueAsNumber.toString() === slider.max;
    sliderValueDisplay.textContent = isMaxValue ? `$${Number(this.value).toLocaleString()}+` : `$${Number(this.value).toLocaleString()}`;
  };

  calculateButton.addEventListener("click", () => {
    let revenueValue = Number(range.value);
    let offer = calculateOffer(revenueValue);
    fundingAmountDisplay.textContent = `${offer.toLocaleString()}`;

    // Send event to Google Analytics with custom parameter
    gtag("event", "calculate_offer", {
      event_category: "Engagement",
      event_label: "Calculate Funding",
      selected_amount: revenueValue, // Custom parameter to track the selected amount
    });
  });

  document.addEventListener("click", function (event) {
    if (event.target.hasAttribute("fc-btn")) {
      const action = event.target.getAttribute("fc-btn");
      switch (action) {
        case "view-offer":
          toggleDisplay(".funding-calc_calc-ui", false);
          toggleDisplay(".funding-calc_offercard", true);
          toggleMobileCalcDisplay(false);
          break;
        case "reset-calc":
          event.preventDefault();
          toggleDisplay(".funding-calc_offercard", false);
          toggleDisplay(".funding-calc_calc-ui", true);
          toggleMobileCalcDisplay(true);
          slider.value = 10000;
          slider.dispatchEvent(new Event("input", { bubbles: true }));
          break;
      }
    }
  });

  function toggleMobileCalcDisplay(shouldShow) {
    const mobileCalcElement = document.querySelector(".hide-mobile-calc");
    if (window.innerWidth < 991) {
      mobileCalcElement.style.display = shouldShow ? "block" : "none";
    }
  }

  // Initial fill update
  updateSliderFill();
});
