document.addEventListener('DOMContentLoaded', function() {
    // Team member hover effect for mobile
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const socialLinks = this.querySelector('.social-links');
                if (socialLinks) {
                    if (socialLinks.style.bottom === '0px') {
                        socialLinks.style.bottom = '-50px';
                    } else {
                        // Close other open social links first
                        document.querySelectorAll('.social-links').forEach(link => {
                            if (link !== socialLinks) link.style.bottom = '-50px';
                        });
                        socialLinks.style.bottom = '0';
                    }
                }
            }
        });
    });
    
    // Close team member social links when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('.team-member')) {
            document.querySelectorAll('.social-links').forEach(link => {
                link.style.bottom = '-50px';
            });
        }
    });
    
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
    
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
});