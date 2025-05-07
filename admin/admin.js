// Admin panel JavaScript functionality

// Password toggle for login page
const passwordToggle = document.getElementById('passwordToggle');
if (passwordToggle) {
    const passwordField = document.getElementById('password');
    
    passwordToggle.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!username || !password) {
            showAlert('Please enter both username and password.', 'error');
            return;
        }
        
        // For demo, we'll use hardcoded credentials
        if (username === 'admin' && password === 'password') {
            showAlert('Login successful. Redirecting...', 'success');
            
            // Save to localStorage if remember me is checked
            const rememberMe = document.getElementById('remember').checked;
            if (rememberMe) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
            }
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showAlert('Invalid username or password.', 'error');
        }
    });
}

// Forgot password functionality
const forgotPassword = document.getElementById('forgotPassword');
if (forgotPassword) {
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a real application, this would open a modal or redirect to a password reset page
        showAlert('Password reset functionality would be implemented here.', 'info');
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear localStorage
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

// Check if user is logged in (for protected pages)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
    
    // If logged in and on login page, redirect to dashboard
    if (isLoggedIn && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
    }
}

// Charts for analytics (using Chart.js)
const visitsChart = document.getElementById('visitsChart');
if (visitsChart) {
    const ctx = visitsChart.getContext('2d');
    
    // Sample data
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Website Visits',
                data: [150, 210, 180, 250, 220, 320, 290],
                backgroundColor: 'rgba(156, 109, 255, 0.2)',
                borderColor: '#9c6dff',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#9c6dff',
                pointBorderWidth: 2,
                pointRadius: 4
            }
        ]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Mobile navigation toggle
const mobileToggleBtn = document.createElement('button');
mobileToggleBtn.className = 'mobile-toggle';
mobileToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';

const adminHeader = document.querySelector('.admin-header');
if (adminHeader) {
    adminHeader.prepend(mobileToggleBtn);
    
    mobileToggleBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('active');
    });
}

// Confirmation for delete actions
const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            // Here you would typically make an API call to delete the item
            // For demo purposes we'll just remove the row from the table
            const row = this.closest('tr');
            if (row) {
                row.remove();
                showAlert('Item deleted successfully.', 'success');
            }
        }
    });
});

// Utility function to show alerts/notifications
function showAlert(message, type = 'info') {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `admin-alert ${type}`;
    alertElement.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close"><i class="fas fa-times"></i></button>
    `;
    
    // Append to body
    document.body.appendChild(alertElement);
    
    // Show with animation
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
    
    // Hide after timeout
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = alertElement.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    });
}

// Add CSS for alerts
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .admin-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease-out;
    }
    
    .admin-alert.show {
        transform: translateX(0);
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .alert-content i {
        font-size: 1.2rem;
    }
    
    .alert-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: #666;
    }
    
    .admin-alert.success {
        border-left: 4px solid #28a745;
    }
    
    .admin-alert.success i {
        color: #28a745;
    }
    
    .admin-alert.error {
        border-left: 4px solid #dc3545;
    }
    
    .admin-alert.error i {
        color: #dc3545;
    }
    
    .admin-alert.info {
        border-left: 4px solid #17a2b8;
    }
    
    .admin-alert.info i {
        color: #17a2b8;
    }
`;
document.head.appendChild(alertStyles);

// Run auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Set current year in footer if needed
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add body click listener to close mobile sidebar when clicking outside
    document.body.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.admin-sidebar');
        const toggle = document.querySelector('.mobile-toggle');
        
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !toggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}); 