function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar && mainContent) {
        sidebar.classList.toggle('sidebar-closed');
        mainContent.classList.toggle('sidebar-closed');
    }
}

// Initialize sidebar functionality on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure sidebar starts closed if not already set
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar && mainContent && !sidebar.classList.contains('sidebar-closed')) {
        // If sidebar doesn't have sidebar-closed class, add it
        sidebar.classList.add('sidebar-closed');
        mainContent.classList.add('sidebar-closed');
    }

    // Add event listener to sidebar toggle button
    const toggleButton = document.querySelector('.sidebar-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }
});