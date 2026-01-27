function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        // Check if mobile or desktop
        const isMobile = window.innerWidth < 769;
        if (isMobile) {
            sidebar.classList.toggle('open');
        } else {
            sidebar.classList.toggle('sidebar-closed');
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.classList.toggle('sidebar-closed');
            }
        }
    }
}

// Initialize sidebar functionality on page load
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebar) {
        const isMobile = window.innerWidth < 769;
        if (isMobile) {
            // On mobile, start closed (no 'open' class)
            sidebar.classList.remove('open');
        } else {
            // On desktop, ensure starts with sidebar-closed if not set
            if (!sidebar.classList.contains('sidebar-closed')) {
                sidebar.classList.add('sidebar-closed');
                if (mainContent) {
                    mainContent.classList.add('sidebar-closed');
                }
            }
        }
    }

    // Add event listener to sidebar toggle button
    const toggleButton = document.querySelector('.sidebar-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }
});