document.addEventListener("DOMContentLoaded", function () {
    // ========== CORE NAVIGATION LOGIC ==========
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');
            pages.forEach(page => page.style.display = 'none');
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) targetPage.style.display = 'block';
            navLinks.forEach(nav => nav.classList.remove('active-link'));
            link.classList.add('active-link');
            window.scrollTo(0, 0);
        });
    });

    // ========== HOME PAGE: TABS LOGIC ==========
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });
    }

    // ========== INGREDIENTS PAGE: NEW INTERACTIVE LOGIC ==========
    const ingredientSelectors = document.querySelectorAll('.ingredient-selector-item');
    if (ingredientSelectors.length > 0) {
        const ingredientImages = document.querySelectorAll('.ingredient-image-container img');
        const ingredientTexts = document.querySelectorAll('.ingredient-text-container .ingredient-info');

        ingredientSelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                const targetIngredient = selector.dataset.ingredient;

                // Update active state for the selector list
                ingredientSelectors.forEach(item => item.classList.remove('active'));
                selector.classList.add('active');

                // Update active state for images
                ingredientImages.forEach(img => {
                    img.classList.toggle('active', img.dataset.image === targetIngredient);
                });

                // Update active state for text descriptions
                ingredientTexts.forEach(text => {
                    text.classList.toggle('active', text.dataset.text === targetIngredient);
                });
            });
        });
    }

    // ========== FADE-IN ON SCROLL LOGIC ==========
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.1});
    document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

    // ========== NEW TESTIMONIAL SLIDER LOGIC (FIXED) ==========
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const slidesContainer = slider.querySelector('.slides-container');
        const slides = Array.from(slider.querySelectorAll('.slide')); // Convert to array for easier manipulation
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const dotsContainer = slider.querySelector('.dots-container');
        let currentIndex = 0;
        let slideInterval;

        // --- CRITICAL FIX: Set slidesContainer width based on total slides ---
        slidesContainer.style.width = `${slides.length * 100}%`;

        // --- Added for responsive recalculation (optional but good practice) ---
        function setSlideWidth() {
            slides.forEach(slide => {
                slide.style.width = `${slider.offsetWidth}px`; // Set each slide's width to the slider's visible width
            });
            slidesContainer.style.transform = `translateX(-${currentIndex * slider.offsetWidth}px)`; // Adjust position
        }

        // Initial width setting
        setSlideWidth();
        // Recalculate on window resize
        window.addEventListener('resize', setSlideWidth);
        // --- END CRITICAL FIX ---


        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            // --- CRITICAL FIX: Use slider.offsetWidth for accurate pixel-based transform ---
            slidesContainer.style.transform = `translateX(-${currentIndex * slider.offsetWidth}px)`;
            currentIndex = index;

            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function startInterval() {
            slideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000); // Change slide every 5 seconds
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetInterval();
        });

        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => startInterval());

        // Initial slide display
        goToSlide(currentIndex);
        startInterval();
    }
});