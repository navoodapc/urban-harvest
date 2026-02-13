// ============================================
// DARK MODE FUNCTIONALITY
// ============================================

class DarkModeManager {
  constructor() {
    this.darkMode = false;
    this.init();
  }

  init() {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.darkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    this.applyTheme();
    this.createToggleButton();
    this.setupSystemThemeListener();
  }

  applyTheme() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  toggle() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    this.updateToggleButton();
  }

  createToggleButton() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    const button = document.createElement('button');
    button.id = 'darkModeToggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.className = `ml-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 
                       transition-all duration-300 focus:outline-none 
                       focus:ring-2 focus:ring-white/50`;
    
    this.updateToggleButtonContent(button);
    button.addEventListener('click', () => this.toggle());
    
    nav.appendChild(button);
  }

  updateToggleButton() {
    const button = document.getElementById('darkModeToggle');
    if (button) {
      this.updateToggleButtonContent(button);
    }
  }

  updateToggleButtonContent(button) {
    button.innerHTML = this.darkMode 
      ? '<span class="text-2xl">🌙</span>'
      : '<span class="text-2xl">☀️</span>';
  }

  setupSystemThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.darkMode = e.matches;
          this.applyTheme();
          this.updateToggleButton();
        }
      });
  }
}

// ============================================
// FORM VALIDATION
// ============================================

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    let isValid = true;
    const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.showSuccess();
    }
  }

  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name || input.id;

    // Clear previous errors
    this.clearError(input);

    // Required field check
    if (input.hasAttribute('required') && !value) {
      this.showError(input, 'This field is required');
      return false;
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(input, 'Please enter a valid email address');
        return false;
      }
    }

    // Number validation
    if (type === 'number' && value) {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        this.showError(input, 'Please enter a valid positive number');
        return false;
      }
    }

    // Success state
    this.showFieldSuccess(input);
    return true;
  }

  showError(input, message) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    input.parentElement.appendChild(errorDiv);
  }

  showFieldSuccess(input) {
    input.classList.add('input-success');
    input.classList.remove('input-error');
  }

  clearError(input) {
    input.classList.remove('input-error', 'input-success');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  showSuccess() {
    const existingMessage = this.form.querySelector('.success-message-box');
    if (existingMessage) existingMessage.remove();

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message-box bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-700 dark:text-green-400 p-4 rounded-lg mt-4 scale-in';
    successDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">✅</span>
        <div>
          <p class="font-semibold">Success!</p>
          <p class="text-sm">Thank you for joining Urban Harvest. We'll be in touch soon!</p>
        </div>
      </div>
    `;
    successDiv.setAttribute('role', 'status');
    successDiv.setAttribute('aria-live', 'polite');
    
    this.form.appendChild(successDiv);
    this.form.reset();

    // Remove success message after 5 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
}

// ============================================
// SUSTAINABILITY CALCULATOR
// ============================================

class SustainabilityCalculator {
  constructor() {
    this.initCalculator();
  }

  initCalculator() {
    const calculateBtn = document.getElementById('calculateImpact');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', () => this.calculate());
  }

  calculate() {
    // Get input values
    const plasticBottles = parseFloat(document.getElementById('plasticBottles')?.value) || 0;
    const meatMeals = parseFloat(document.getElementById('meatMeals')?.value) || 0;
    const carMiles = parseFloat(document.getElementById('carMiles')?.value) || 0;
    const electricityKwh = parseFloat(document.getElementById('electricityKwh')?.value) || 0;

    // Validation
    if (plasticBottles < 0 || meatMeals < 0 || carMiles < 0 || electricityKwh < 0) {
      alert('Please enter positive numbers only');
      return;
    }

    // Calculate carbon footprint (kg CO2)
    const bottleCO2 = plasticBottles * 0.082; // 82g per bottle
    const meatCO2 = meatMeals * 2.5; // 2.5kg per meat meal
    const carCO2 = carMiles * 0.411; // 411g per mile
    const electricityCO2 = electricityKwh * 0.385; // 385g per kWh

    const totalCO2 = bottleCO2 + meatCO2 + carCO2 + electricityCO2;

    // Calculate potential savings with sustainable alternatives
    const bottleSavings = plasticBottles * 0.082 * 0.95; // 95% reduction with reusable
    const meatSavings = meatMeals * 2.5 * 0.70; // 70% reduction with plant-based
    const carSavings = carMiles * 0.411 * 0.60; // 60% reduction with public transport
    const electricitySavings = electricityKwh * 0.385 * 0.30; // 30% reduction with efficiency

    const totalSavings = bottleSavings + meatSavings + carSavings + electricitySavings;

    // Calculate trees needed to offset
    const treesNeeded = Math.ceil(totalCO2 / 21.77); // One tree absorbs ~21.77 kg CO2/year
    const treesSaved = Math.ceil(totalSavings / 21.77);

    this.displayResults({
      totalCO2: totalCO2.toFixed(2),
      totalSavings: totalSavings.toFixed(2),
      treesNeeded,
      treesSaved,
      percentageReduction: ((totalSavings / totalCO2) * 100).toFixed(1)
    });
  }

  displayResults(data) {
    const resultsDiv = document.getElementById('calculatorResults');
    if (!resultsDiv) return;

    resultsDiv.classList.remove('hidden');
    resultsDiv.innerHTML = `
      <div class="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 space-y-4 scale-in">
        <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
          Your Carbon Impact Analysis
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Monthly Footprint</p>
            <p class="text-3xl font-bold text-red-600 dark:text-red-400">${data.totalCO2} kg CO₂</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">≈ ${data.treesNeeded} trees needed to offset</p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Potential Monthly Savings</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">${data.totalSavings} kg CO₂</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">≈ ${data.treesSaved} trees worth of impact</p>
          </div>
        </div>

        <div class="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg border-2 border-green-500">
          <div class="flex items-center gap-3">
            <span class="text-4xl">🌱</span>
            <div>
              <p class="font-semibold text-green-800 dark:text-green-300 text-lg">
                You could reduce your footprint by ${data.percentageReduction}%
              </p>
              <p class="text-sm text-green-700 dark:text-green-400">
                By switching to sustainable alternatives from Urban Harvest
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Recommended Actions:</h4>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-green-600 dark:text-green-400">✓</span>
              <span>Switch to reusable water bottles and containers</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 dark:text-green-400">✓</span>
              <span>Try plant-based meals 3-4 times per week</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 dark:text-green-400">✓</span>
              <span>Use public transport or carpool when possible</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 dark:text-green-400">✓</span>
              <span>Improve home energy efficiency with LED bulbs and smart thermostats</span>
            </li>
          </ul>
        </div>

        <div class="flex gap-3 mt-4">
          <a href="products.html" class="uh-btn-primary text-sm">
            Browse Eco Products
          </a>
          <a href="subscribe.html" class="uh-btn-outline text-sm">
            Join Community
          </a>
        </div>
      </div>
    `;

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ============================================
// TAB COMPONENT
// ============================================

class TabComponent {
  constructor() {
    this.initTabs();
  }

  initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
      button.addEventListener('click', () => this.switchTab(button));
    });
  }

  switchTab(clickedButton) {
    const targetTab = clickedButton.getAttribute('data-tab');
    
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-green-600', 'text-white', 'border-green-600');
      btn.classList.add('border-green-600', 'text-green-700');
    });
    
    clickedButton.classList.add('active', 'bg-green-600', 'text-white');
    clickedButton.classList.remove('text-green-700');

    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });

    const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
    if (targetContent) {
      targetContent.classList.remove('hidden');
      targetContent.classList.add('fade-in');
    }
  }
}

// ============================================
// FILTER COMPONENT (Products Page)
// ============================================

class ProductFilter {
  constructor() {
    this.initFilters();
  }

  initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', () => this.filterProducts(button));
    });

    this.updateProductCount('all');
  }

  filterProducts(clickedButton) {
    const filter = clickedButton.getAttribute('data-filter');
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-green-600', 'text-white');
    });
    
    clickedButton.classList.add('active', 'bg-green-600', 'text-white');

    // Filter products
    const products = document.querySelectorAll('[data-category]');
    let visibleCount = 0;

    products.forEach(product => {
      const category = product.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        product.classList.remove('hidden');
        product.classList.add('fade-in');
        visibleCount++;
      } else {
        product.classList.add('hidden');
      }
    });

    this.updateProductCount(filter, visibleCount);
  }

  updateProductCount(filter, count) {
    const countElement = document.getElementById('productCount');
    if (!countElement) return;

    const total = document.querySelectorAll('[data-category]').length;
    const displayCount = count !== undefined ? count : total;
    
    countElement.textContent = `Showing ${displayCount} of ${total} products`;
  }
}

// ============================================
// TOGGLE IMPACT (Products Page)
// ============================================

class ImpactToggle {
  constructor() {
    this.initToggles();
  }

  initToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-impact');
    if (toggleButtons.length === 0) return;

    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => this.toggle(e.target));
    });
  }

  toggle(button) {
    const impactDiv = button.nextElementSibling;
    if (!impactDiv) return;

    if (impactDiv.classList.contains('hidden')) {
      impactDiv.classList.remove('hidden');
      impactDiv.classList.add('slide-in');
      button.textContent = 'Hide sustainability impact';
    } else {
      impactDiv.classList.add('hidden');
      button.textContent = 'View sustainability impact';
    }
  }
}

// ============================================
// MOBILE MENU
// ============================================

class MobileMenu {
  constructor() {
    this.createMobileMenu();
  }

  createMobileMenu() {
    const nav = document.querySelector('header nav ul');
    if (!nav) return;

    // Only create mobile menu on small screens
    if (window.innerWidth >= 768) return;

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'md:hidden p-2 text-white';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
    
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('hidden');
    });

    nav.parentElement.insertBefore(mobileToggle, nav);
    nav.classList.add('hidden', 'md:flex');
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
  constructor() {
    this.initScrollAnimations();
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new DarkModeManager();
  
  // Form validation
  new FormValidator('subscribeForm');
  new FormValidator('contactForm');
  
  // Calculator
  new SustainabilityCalculator();
  
  // Interactive components
  new TabComponent();
  new ProductFilter();
  new ImpactToggle();
  new MobileMenu();
  
  // Animations
  new ScrollAnimations();

  console.log('🌱 Urban Harvest initialized successfully!');
});

// Accessibility: Skip to main content
document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  document.body.insertBefore(skipLink, document.body.firstChild);
});
