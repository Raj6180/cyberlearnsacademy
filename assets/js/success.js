document.addEventListener('DOMContentLoaded', function() {
    // Success Stories Filtering
    const filterButtons = document.querySelectorAll('.story-filter button');
    const storyCards = document.querySelectorAll('.story-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter stories
            storyCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Animate Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-count');
            const count = +stat.innerText;
            const increment = target / speed;
            
            if (count < target) {
                stat.innerText = Math.ceil(count + increment);
                setTimeout(animateStats, 1);
            } else {
                // Handle decimal numbers for salary increase
                if (stat.getAttribute('data-count').includes('.')) {
                    stat.innerText = target.toFixed(1);
                } else {
                    stat.innerText = target;
                }
            }
        });
    }
    
    // Start animation when stats are in view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Success Story Form Submission
    const successForm = document.getElementById('successStoryForm');
    if (successForm) {
        successForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the data to your server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert('Thank you for sharing your success story! We will review your submission and get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Initialize smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});