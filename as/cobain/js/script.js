        // Preloader
        window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
        
        // Initialize AOS animation
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Back to top button
        const backToTopButton = document.querySelector('.back-to-top');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarNav = document.querySelector('.navbar-collapse');
                    if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                        navbarToggler.click();
                    }
                }
            });
        });
        
        // Product quantity buttons
        document.querySelectorAll('.input-group button').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentNode.querySelector('input');
                let value = parseInt(input.value);
                
                if (this.textContent === '+' && value < 10) {
                    input.value = value + 1;
                } else if (this.textContent === '-' && value > 1) {
                    input.value = value - 1;
                }
                
                // Update cart total (you would implement this based on your needs)
                updateCartTotal();
            });
        });
        
        // Function to update cart total (placeholder)
        function updateCartTotal() {
            // Implement your cart total update logic here
            console.log('Cart total updated');
        }
        
        // Form submission handlers
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement login logic
            alert('Login functionality will be implemented here');
        });
        
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement registration logic
            alert('Registration functionality will be implemented here');
        });
        
        document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement forgot password logic
            alert('Password reset functionality will be implemented here');
        });
        
        // Countdown timer
        function updateCountdown() {
            const now = new Date();
            const targetDate = new Date();
            targetDate.setDate(now.getDate() + 3); // Set target date to 3 days from now
            
            const totalSeconds = (targetDate - now) / 1000;
            
            const days = Math.floor(totalSeconds / 3600 / 24);
            const hours = Math.floor(totalSeconds / 3600) % 24;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const seconds = Math.floor(totalSeconds) % 60;
            
            document.getElementById('days').textContent = formatTime(days);
            document.getElementById('hours').textContent = formatTime(hours);
            document.getElementById('minutes').textContent = formatTime(minutes);
            document.getElementById('seconds').textContent = formatTime(seconds);
        }
        
        function formatTime(time) {
            return time < 10 ? `0${time}` : time;
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
        
        // Initialize Splide carousel for brands
        new Splide('.splide', {
            type: 'loop',
            perPage: 5,
            autoplay: true,
            interval: 3000,
            speed: 1000,
            pauseOnHover: false,
            arrows: false,
            pagination: false,
            breakpoints: {
                992: {
                    perPage: 4
                },
                768: {
                    perPage: 3
                },
                576: {
                    perPage: 2
                }
            }
        }).mount();
        
        // Product thumbnail click handler
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const mainImage = document.querySelector('.main-image');
                mainImage.src = this.src;
                
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Counter animation
        const counters = document.querySelectorAll('.count');
        const speed = 200;
        
        function animateCounters() {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-count');
                const count = +counter.innerText;
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(animateCounters, 1);
                } else {
                    counter.innerText = target;
                }
            });
        }
        
        // Start counter animation when scrolled to stats section
        const statsSection = document.querySelector('.bg-dark');
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        });
        
        observer.observe(statsSection);
        
        // Chatbot functionality
        document.addEventListener('DOMContentLoaded', function() {
            const chatSendBtn = document.getElementById('chatSendBtn');
            const chatInput = document.getElementById('chatInput');
            
            if (chatSendBtn && chatInput) {
                chatSendBtn.addEventListener('click', sendChatMessage);
                chatInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendChatMessage();
                    }
                });
            }
        });
        
        function sendChatMessage() {
            const chatInput = document.getElementById('chatInput');
            const message = chatInput.value.trim();
            const chatBody = document.querySelector('.chatbot-modal .modal-body');
            
            if (message && chatBody) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user-message mb-3';
                userMessage.innerHTML = `
                    <div class="d-flex align-items-start justify-content-end">
                        <div class="flex-grow-1 me-3 text-end">
                            <div class="chat-bubble user-bubble">
                                <p class="mb-0">${message}</p>
                                <div class="chat-time">Baru saja</div>
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <div class="rounded-circle bg-secondary text-white p-2">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                    </div>
                `;
                chatBody.appendChild(userMessage);
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;
                
                // Simulate bot response
                setTimeout(() => {
                    const botResponse = document.createElement('div');
                    botResponse.className = 'chat-message bot-message mb-3';
                    botResponse.innerHTML = `
                        <div class="d-flex align-items-start">
                            <div class="flex-shrink-0">
                                <div class="rounded-circle bg-primary text-white p-2">
                                    <i class="fas fa-robot"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <div class="chat-bubble bot-bubble">
                                    <p class="mb-0">Terima kasih atas pesan Anda. Tim kami akan segera menghubungi Anda untuk membantu.</p>
                                    <div class="chat-time">Baru saja</div>
                                </div>
                            </div>
                        </div>
                    `;
                    chatBody.appendChild(botResponse);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            }
        }

        // Di script.js
function loadComponent(component, target) {
    fetch(`partials/${component}.html`)
        .then(response => response.text())
        .then(html => {
            document.querySelector(target).innerHTML = html;
        });
}

// Contoh penggunaan:
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('navbar', 'header');
    loadComponent('footer', 'footer');
});

 // Fungsi untuk menampilkan rating bintang
 function renderRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Fungsi untuk menangani klik thumbnail
function setupThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Hapus class active dari semua thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            // Tambahkan class active ke thumbnail yang diklik
            this.classList.add('active');
            // Ubah gambar utama
            mainImage.src = this.src;
        });
    });
}

// Fungsi untuk menangani perubahan quantity
function setupQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn:first-child');
    const plusBtn = document.querySelector('.quantity-btn:last-child');
    const quantityInput = document.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });
}

// Event listener untuk modal show
document.getElementById('quickViewModal').addEventListener('show.bs.modal', function(event) {
    const button = event.relatedTarget; // Tombol yang memicu modal
    const productData = JSON.parse(button.getAttribute('data-product'));
    
    const modalBody = document.querySelector('#quickViewModal .modal-body');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="product-gallery">
                    <img src="${productData.images[0]}" class="main-image img-fluid" alt="Product Image">
                    <div class="thumbnail-container">
                        ${productData.images.map((img, index) => `
                            <img src="${img}" class="thumbnail img-fluid ${index === 0 ? 'active' : ''}" alt="Thumbnail ${index + 1}">
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="product-details">
                    <h2>${productData.title}</h2>
                    <p class="product-brand">By ${productData.brand}</p>
                    <div class="rating mb-3">
                        ${renderRating(productData.rating)}
                        <span class="ms-2">(${productData.reviews} Ulasan)</span>
                    </div>
                    <div class="d-flex align-items-center mb-3">
                        <span class="product-price">${productData.price}</span>
                        <span class="product-old-price">${productData.oldPrice}</span>
                        <span class="product-discount">${productData.discount} OFF</span>
                    </div>
                    <p class="text-muted">${productData.description}</p>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">Ketersediaan:</span>
                            <span class="meta-value text-success">${productData.availability}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Jenis:</span>
                            <span class="meta-value">${productData.type}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Ukuran:</span>
                            <span class="meta-value">${productData.size}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Kategori:</span>
                            <span class="meta-value">${productData.category}</span>
                        </div>
                    </div>
                    
                    <div class="quantity-selector">
                        <span class="me-3">Jumlah:</span>
                        <button class="quantity-btn">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="10">
                        <button class="quantity-btn">+</button>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary"><i class="fas fa-shopping-cart me-2"></i> Tambah ke Keranjang</button>
                        <button class="btn btn-outline-primary"><i class="far fa-heart me-2"></i> Wishlist</button>
                    </div>
                    
                    <div class="share-buttons mt-4">
                        <span class="me-2">Bagikan:</span>
                        <button class="btn btn-sm btn-outline-secondary me-2"><i class="fab fa-facebook-f"></i></button>
                        <button class="btn btn-sm btn-outline-secondary me-2"><i class="fab fa-whatsapp"></i></button>
                        <button class="btn btn-sm btn-outline-secondary me-2"><i class="fab fa-instagram"></i></button>
                        <button class="btn btn-sm btn-outline-secondary"><i class="fab fa-twitter"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup fungsi setelah konten dimuat
    setupThumbnails();
    setupQuantitySelector();
});