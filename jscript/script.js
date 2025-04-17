document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = item.getAttribute('href').slice(1);
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active-section');
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'flex';
                targetSection.classList.add('active-section');
            }
        });
    });
    
    const primaryBtn = document.querySelector('.primary-btn');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            const scanNavItem = document.querySelector('a[href="#scan"]');
            if (scanNavItem) {
                scanNavItem.click();
            }
        });
    }
    
    function initApp() {
        sections.forEach(section => {
            if (!section.classList.contains('active-section')) {
                section.style.display = 'none';
            }
        });
    }
    
    initApp();
});
