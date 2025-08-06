$(document).ready(function() {
    'use strict';

    // Initialize all components
    initNavigation();
    initAnimations();
    initCounters();
    initForms();
    initInteractiveElements();
    initPageSpecificFeatures();

    // Navigation functionality
    function initNavigation() {
        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function(event) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 80
                }, 1000, 'easeInOutCubic');
            }
        });

        // Custom easing function
        $.easing.easeInOutCubic = function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };

        // Navbar scroll effects
        $(window).scroll(function() {
            var scrollTop = $(this).scrollTop();
            
            if (scrollTop > 50) {
                $('.navbar').addClass('scrolled');
            } else {
                $('.navbar').removeClass('scrolled');
            }

            // Parallax effect for hero section
            if ($('.hero-section').length) {
                var parallaxSpeed = scrollTop * 0.5;
                $('.hero-shapes').css('transform', 'translateY(' + parallaxSpeed + 'px)');
            }
        });

        // Mobile menu enhancements
        $('.navbar-toggler').on('click', function() {
            $(this).toggleClass('active');
        });

        // Close mobile menu when clicking on links
        $('.navbar-nav .nav-link').on('click', function() {
            if ($(window).width() < 992) {
                $('.navbar-collapse').collapse('hide');
                $('.navbar-toggler').removeClass('active');
            }
        });
    }

    // Animation system
    function initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('visible');
                    
                    // Trigger specific animations based on element type
                    if ($(entry.target).hasClass('stat-card') || $(entry.target).hasClass('stat-item')) {
                        animateCounter($(entry.target));
                    }
                    
                    if ($(entry.target).hasClass('service-card-detailed')) {
                        animateServiceCard($(entry.target));
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        $('.fade-in, .stat-card, .stat-item, .service-card-detailed, .feature-card, .team-card, .value-card').each(function() {
            observer.observe(this);
        });

        // Hero title animation
        if ($('.hero-title').length) {
            setTimeout(function() {
                $('.title-line-1').css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, 300);

            setTimeout(function() {
                $('.title-line-2').css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, 600);

            setTimeout(function() {
                $('.title-line-3').css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, 900);
        }

        // Floating cards animation
        $('.floating-card').each(function(index) {
            $(this).css('animation-delay', (index * 0.5) + 's');
        });
    }

    // Counter animations
    function initCounters() {
        window.animatedCounters = new Set();
    }

    function animateCounter($element) {
        var $counter = $element.find('.stat-number[data-count]');
        if ($counter.length && !window.animatedCounters.has($counter[0])) {
            window.animatedCounters.add($counter[0]);
            
            var countTo = parseInt($counter.attr('data-count'));
            var duration = 2000;
            var startTime = Date.now();
            
            function updateCounter() {
                var elapsed = Date.now() - startTime;
                var progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                var easedProgress = 1 - Math.pow(1 - progress, 3);
                var currentCount = Math.floor(easedProgress * countTo);
                
                $counter.text(currentCount);
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    $counter.text(countTo);
                    // Add special formatting for certain counters
                    if (countTo === 98) {
                        $counter.text('98%');
                    } else if (countTo === 125) {
                        $counter.text('$125M+');
                    } else if (countTo >= 1000) {
                        $counter.text(countTo.toLocaleString());
                    }
                }
            }
            
            updateCounter();
        }
    }

    // Service card animations
    function animateServiceCard($card) {
        setTimeout(function() {
            $card.find('.service-icon-large').addClass('animate-bounce');
            setTimeout(function() {
                $card.find('.service-icon-large').removeClass('animate-bounce');
            }, 1000);
        }, 200);
    }

    // Form handling
    function initForms() {
        // Contact form submission
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            handleFormSubmission($(this));
        });

        // Quote form submission (if exists)
        $('#quoteForm').on('submit', function(e) {
            e.preventDefault();
            handleFormSubmission($(this));
        });

        // Real-time form validation
        $('.form-control').on('blur', function() {
            validateField($(this));
        });

        // Phone number formatting
        $('input[type="tel"]').on('input', function() {
            formatPhoneNumber($(this));
        });
    }

    function handleFormSubmission($form) {
        var $submitBtn = $form.find('button[type="submit"]');
        var $btnText = $submitBtn.find('.btn-text');
        var $btnLoading = $submitBtn.find('.btn-loading');
        
        // Show loading state
        $btnText.addClass('d-none');
        $btnLoading.removeClass('d-none');
        $submitBtn.prop('disabled', true);
        
        // Simulate form processing
        setTimeout(function() {
            // Reset button state
            $btnText.removeClass('d-none');
            $btnLoading.addClass('d-none');
            $submitBtn.prop('disabled', false);
            
            // Show success message
            showSuccessMessage($form);
            
            // Reset form
            $form[0].reset();
            
        }, 2500);
    }

    function showSuccessMessage($form) {
        var successHtml = `
            <div class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                <div class="d-flex align-items-center">
                    <i class="fas fa-check-circle me-3" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Thank you for your inquiry!</strong><br>
                        We've received your information and will contact you within 2 hours with your custom quote.
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $form.after(successHtml);
        
        // Auto-hide after 8 seconds
        setTimeout(function() {
            $('.alert-success').fadeOut(500, function() {
                $(this).remove();
            });
        }, 8000);
        
        // Scroll to success message
        $('html, body').animate({
            scrollTop: $('.alert-success').offset().top - 100
        }, 500);
    }

    function validateField($field) {
        var isValid = true;
        var value = $field.val().trim();
        
        // Remove existing validation classes
        $field.removeClass('is-valid is-invalid');
        
        // Required field validation
        if ($field.prop('required') && !value) {
            isValid = false;
        }
        
        // Email validation
        if ($field.attr('type') === 'email' && value) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Phone validation
        if ($field.attr('type') === 'tel' && value) {
            var phoneRegex = /^$$\d{3}$$ \d{3}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Apply validation classes
        $field.addClass(isValid ? 'is-valid' : 'is-invalid');
        
        return isValid;
    }

    function formatPhoneNumber($input) {
        var value = $input.val().replace(/\D/g, '');
        var formattedValue = '';
        
        if (value.length >= 6) {
            formattedValue = '(' + value.substr(0, 3) + ') ' + value.substr(3, 3) + '-' + value.substr(6, 4);
        } else if (value.length >= 3) {
            formattedValue = '(' + value.substr(0, 3) + ') ' + value.substr(3);
        } else {
            formattedValue = value;
        }
        
        $input.val(formattedValue);
    }

    // Interactive elements
    function initInteractiveElements() {
        // Service card hover effects
        $('.service-card, .service-card-detailed, .feature-card').hover(
            function() {
                $(this).find('i').addClass('fa-bounce');
                $(this).css('transform', 'translateY(-5px)');
            },
            function() {
                $(this).find('i').removeClass('fa-bounce');
                $(this).css('transform', 'translateY(0)');
            }
        );

        // Team card interactions
        $('.team-card').hover(
            function() {
                $(this).find('.team-image img').css('transform', 'scale(1.05)');
                $(this).find('.team-social').css('opacity', '1');
            },
            function() {
                $(this).find('.team-image img').css('transform', 'scale(1)');
                $(this).find('.team-social').css('opacity', '0.7');
            }
        );

        // Package card selection
        $('.package-card').on('click', function() {
            $('.package-card').removeClass('selected');
            $(this).addClass('selected');
        });

        // Tooltip initialization
        $('[data-bs-toggle="tooltip"]').tooltip();

        // Button click effects
        $('.btn').on('click', function(e) {
            var $btn = $(this);
            var $ripple = $('<span class="ripple"></span>');
            var btnOffset = $btn.offset();
            var xPos = e.pageX - btnOffset.left;
            var yPos = e.pageY - btnOffset.top;
            
            $ripple.css({
                'left': xPos + 'px',
                'top': yPos + 'px'
            });
            
            $btn.append($ripple);
            
            setTimeout(function() {
                $ripple.remove();
            }, 600);
        });
    }

    // Page-specific features
    function initPageSpecificFeatures() {
        // Homepage specific
        if ($('body').find('.hero-section').length) {
            initHomepageFeatures();
        }
        
        // Services page specific
        if ($('body').find('.services-grid').length) {
            initServicesPageFeatures();
        }
        
        // About page specific
        if ($('body').find('.team-section').length) {
            initAboutPageFeatures();
        }
        
        // Contact page specific
        if ($('body').find('.contact-form-section').length) {
            initContactPageFeatures();
        }
    }

    function initHomepageFeatures() {
        // Testimonial slider (simple implementation)
        var testimonials = [
            {
                text: "SwiftDispatch Pro increased my weekly revenue by 40%. Their team finds the best loads and handles all the paperwork. I can focus on driving!",
                author: "John Martinez",
                title: "Owner-Operator, 8 years",
                image: "/placeholder.svg?height=60&width=60"
            },
            {
                text: "Best dispatch service I've ever used. Professional, reliable, and they really care about my success. Highly recommended!",
                author: "Sarah Johnson",
                title: "Fleet Owner, 12 years",
                image: "/placeholder.svg?height=60&width=60"
            },
            {
                text: "The 24/7 support is amazing. They're always there when I need them, and their route optimization saves me hours every week.",
                author: "Mike Rodriguez",
                title: "Owner-Operator, 5 years",
                image: "/placeholder.svg?height=60&width=60"
            }
        ];

        var currentTestimonial = 0;
        
        function rotateTestimonials() {
            if ($('.testimonial-card').length) {
                var $card = $('.testimonial-card');
                $card.fadeOut(500, function() {
                    var testimonial = testimonials[currentTestimonial];
                    $card.find('p').text(testimonial.text);
                    $card.find('.author-name').text(testimonial.author);
                    $card.find('.author-title').text(testimonial.title);
                    $card.find('img').attr('src', testimonial.image);
                    
                    $card.fadeIn(500);
                    
                    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                });
            }
        }
        
        // Rotate testimonials every 8 seconds
        setInterval(rotateTestimonials, 8000);
    }

    function initServicesPageFeatures() {
        // Service package comparison
        $('.package-card').on('mouseenter', function() {
            $(this).find('.package-features li').each(function(index) {
                setTimeout(function() {
                    $(this).addClass('highlight');
                }.bind(this), index * 100);
            });
        }).on('mouseleave', function() {
            $(this).find('.package-features li').removeClass('highlight');
        });

        // Service pricing calculator (simple)
        $('#fleetSize').on('change', function() {
            updatePricingEstimate();
        });
    }

    function updatePricingEstimate() {
        var fleetSize = $('#fleetSize').val();
        var estimate = '';
        
        switch(fleetSize) {
            case '1':
                estimate = 'Estimated monthly savings: $800-1,200';
                break;
            case '2-5':
                estimate = 'Estimated monthly savings: $2,000-4,000';
                break;
            case '6-20':
                estimate = 'Estimated monthly savings: $8,000-15,000';
                break;
            case '21-50':
                estimate = 'Estimated monthly savings: $20,000-40,000';
                break;
            case '50+':
                estimate = 'Contact us for enterprise pricing';
                break;
        }
        
        if (estimate && !$('.pricing-estimate').length) {
            $('#fleetSize').after('<div class="pricing-estimate mt-2 text-success"><i class="fas fa-calculator me-2"></i>' + estimate + '</div>');
        } else if (estimate) {
            $('.pricing-estimate').html('<i class="fas fa-calculator me-2"></i>' + estimate);
        }
    }

    function initAboutPageFeatures() {
        // Team member modal or expanded info
        $('.team-card').on('click', function() {
            var $card = $(this);
            $card.toggleClass('expanded');
            
            if ($card.hasClass('expanded')) {
                $card.find('.team-content').append('<div class="team-details mt-3"><p>Additional information about this team member would go here...</p></div>');
            } else {
                $card.find('.team-details').remove();
            }
        });
    }

    function initContactPageFeatures() {
        // Contact method selection
        $('.contact-method-card').on('click', function() {
            $('.contact-method-card').removeClass('active');
            $(this).addClass('active');
        });

        // Form field focus effects
        $('.form-control').on('focus', function() {
            $(this).parent().addClass('focused');
        }).on('blur', function() {
            if (!$(this).val()) {
                $(this).parent().removeClass('focused');
            }
        });

        // Character counter for textarea
        $('#message').on('input', function() {
            var maxLength = 500;
            var currentLength = $(this).val().length;
            var remaining = maxLength - currentLength;
            
            if (!$('.char-counter').length) {
                $(this).after('<div class="char-counter text-muted mt-1"></div>');
            }
            
            $('.char-counter').text(remaining + ' characters remaining');
            
            if (remaining < 50) {
                $('.char-counter').addClass('text-warning').removeClass('text-muted');
            } else {
                $('.char-counter').addClass('text-muted').removeClass('text-warning');
            }
        });
    }

    // Utility functions
    function showNotification(message, type = 'success') {
        var notificationHtml = `
            <div class="notification notification-${type}">
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
        
        $('body').append(notificationHtml);
        
        setTimeout(function() {
            $('.notification').addClass('show');
        }, 100);
        
        setTimeout(function() {
            $('.notification').removeClass('show');
            setTimeout(function() {
                $('.notification').remove();
            }, 300);
        }, 4000);
    }

    // Performance monitoring
    $(window).on('load', function() {
        var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('🚛 SwiftDispatch Pro loaded in ' + loadTime + 'ms');
        
        if (loadTime < 3000) {
            setTimeout(function() {
                showNotification('Page loaded successfully! Ready to help maximize your revenue.', 'success');
            }, 1000);
        }
    });

    // Add custom CSS for animations
    $('<style>').text(`
        .animate-bounce {
            animation: bounce 1s ease-in-out;
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
            }
            40%, 43% {
                transform: translate3d(0,-15px,0);
            }
            70% {
                transform: translate3d(0,-7px,0);
            }
            90% {
                transform: translate3d(0,-2px,0);
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            padding: 1rem 1.5rem;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-success i {
            color: #00d4aa;
        }
        
        .highlight {
            background: rgba(102, 126, 234, 0.1);
            transform: translateX(5px);
            transition: all 0.3s ease;
        }
        
        .package-card.selected {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .contact-method-card.active {
            border-color: var(--primary-color);
            background: rgba(102, 126, 234, 0.05);
        }
        
        .form-group.focused label {
            color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .team-card.expanded {
            transform: scale(1.02);
            z-index: 10;
        }
    `).appendTo('head');

    // Console branding
    console.log('%c🚛 SwiftDispatch Pro - Professional Freight Dispatch Services 🚛', 'color: #667eea; font-size: 18px; font-weight: bold;');
    console.log('%cBuilt with jQuery, Bootstrap, and professional expertise', 'color: #f5576c; font-size: 12px;');
    console.log('%cReady to maximize your trucking revenue!', 'color: #4facfe; font-size: 12px;');
});

// Additional page-specific styles for better visual appeal
$(document).ready(function() {
    // Add additional CSS for page-specific enhancements
    $('<style>').text(`
        /* Page Header Styles */
        .page-header {
            padding: 120px 0 80px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            position: relative;
            overflow: hidden;
        }
        
        .page-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%);
        }
        
        .page-header-content {
            position: relative;
            z-index: 2;
        }
        
        .page-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(102, 126, 234, 0.1);
            color: var(--primary-color);
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 2rem;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .page-title {
            font-family: 'Playfair Display', serif;
            font-size: 3.5rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }
        
        .page-description {
            font-size: 1.2rem;
            color: var(--text-light);
            line-height: 1.7;
            max-width: 500px;
        }
        
        .contact-highlights {
            margin-top: 2rem;
        }
        
        .highlight-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1rem;
            color: var(--text-light);
        }
        
        .highlight-item i {
            color: var(--primary-color);
            width: 20px;
        }
        
        /* Services Grid Styles */
        .services-grid {
            padding: 6rem 0;
            background: white;
        }
        
        .service-card-detailed {
            background: white;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            transition: var(--transition);
            margin-bottom: 2rem;
            border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .service-card-detailed:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary-color);
        }
        
        .service-header {
            padding: 2rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .service-icon-large {
            width: 70px;
            height: 70px;
            background: var(--primary-gradient);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
            flex-shrink: 0;
        }
        
        .service-header-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }
        
        .service-subtitle {
            color: var(--text-light);
            font-size: 0.95rem;
            margin: 0;
        }
        
        .service-image-container {
            height: 200px;
            overflow: hidden;
        }
        
        .service-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: var(--transition);
        }
        
        .service-card-detailed:hover .service-image-container img {
            transform: scale(1.05);
        }
        
        .service-details {
            padding: 2rem;
        }
        
        .service-details p {
            color: var(--text-light);
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }
        
        .service-benefits {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
        }
        
        .service-benefits li {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 0.75rem;
            color: var(--text-light);
        }
        
        .service-benefits i {
            color: var(--success-color);
            font-size: 0.9rem;
        }
        
        .service-pricing {
            display: flex;
            align-items: baseline;
            gap: 8px;
            padding: 1rem;
            background: var(--light-color);
            border-radius: var(--border-radius);
        }
        
        .price-label {
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        .price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        /* Service Packages */
        .service-packages {
            padding: 6rem 0;
            background: var(--light-color);
        }
        
        .package-card {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2.5rem 2rem;
            box-shadow: var(--shadow-lg);
            transition: var(--transition);
            border: 2px solid transparent;
            position: relative;
            height: 100%;
        }
        
        .package-card.featured {
            border-color: var(--primary-color);
            transform: scale(1.05);
        }
        
        .package-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--secondary-gradient);
            color: white;
            padding: 6px 20px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .package-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .package-header h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }
        
        .package-price {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .price-amount {
            font-size: 3rem;
            font-weight: 700;
            color: var(--primary-color);
            font-family: 'Playfair Display', serif;
        }
        
        .price-period {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .package-features {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
        }
        
        .package-features li {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1rem;
            color: var(--text-light);
            transition: var(--transition);
        }
        
        .package-features i {
            color: var(--success-color);
            font-size: 0.9rem;
        }
        
        /* Company Stats */
        .company-stats {
            padding: 6rem 0;
            background: white;
        }
        
        .stat-card {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2.5rem 2rem;
            text-align: center;
            box-shadow: var(--shadow-lg);
            transition: var(--transition);
            border: 1px solid rgba(102, 126, 234, 0.1);
            margin-bottom: 2rem;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary-color);
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            background: var(--primary-gradient);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: white;
            font-size: 1.5rem;
        }
        
        .stat-content .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-color);
            font-family: 'Playfair Display', serif;
            display: block;
        }
        
        .stat-content .stat-label {
            color: var(--text-light);
            font-size: 1rem;
            margin-top: 0.5rem;
        }
        
        /* Contact Methods */
        .contact-methods {
            padding: 6rem 0;
            background: white;
        }
        
        .contact-method-card {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2.5rem;
            box-shadow: var(--shadow-lg);
            transition: var(--transition);
            border: 2px solid transparent;
            cursor: pointer;
            height: 100%;
        }
        
        .contact-method-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary-color);
        }
        
        .method-icon {
            width: 70px;
            height: 70px;
            background: var(--primary-gradient);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: white;
            font-size: 1.8rem;
        }
        
        .contact-method-card h3 {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }
        
        .contact-method-card p {
            text-align: center;
            color: var(--text-light);
            margin-bottom: 2rem;
        }
        
        .method-details {
            margin-bottom: 2rem;
        }
        
        .detail-item {
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .detail-item strong {
            display: block;
            color: var(--text-dark);
            margin-bottom: 0.25rem;
        }
        
        .detail-item a {
            color: var(--primary-color);
            text-decoration: none;
        }
        
        .detail-item a:hover {
            text-decoration: underline;
        }
        
        /* Contact Form */
        .contact-form-section {
            padding: 6rem 0;
            background: var(--light-color);
        }
        
        .contact-form-container {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 3rem;
            box-shadow: var(--shadow-lg);
        }
        
        .form-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .form-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }
        
        .form-header p {
            color: var(--text-light);
            font-size: 1.1rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-dark);
            font-weight: 500;
            transition: var(--transition);
        }
        
        .form-control {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: var(--border-radius);
            font-size: 1rem;
            transition: var(--transition);
            background: white;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-control.is-valid {
            border-color: var(--success-color);
        }
        
        .form-control.is-invalid {
            border-color: var(--accent-color);
        }
        
        /* Contact Sidebar */
        .contact-sidebar {
            padding-left: 2rem;
        }
        
        .sidebar-card {
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            box-shadow: var(--shadow-lg);
            margin-bottom: 2rem;
        }
        
        .sidebar-card h3 {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
        }
        
        .benefits-list {
            list-style: none;
            padding: 0;
        }
        
        .benefits-list li {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1rem;
            color: var(--text-light);
        }
        
        .benefits-list i {
            color: var(--success-color);
            font-size: 0.9rem;
        }
        
        .response-times {
            margin-top: 1rem;
        }
        
        .response-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1rem;
        }
        
        .response-item i {
            color: var(--primary-color);
            width: 20px;
        }
        
        .response-item strong {
            display: block;
            color: var(--text-dark);
            font-size: 0.9rem;
        }
        
        .response-item span {
            color: var(--text-light);
            font-size: 0.8rem;
        }
        
        .testimonial-card {
            background: var(--primary-gradient) !important;
            color: white;
        }
        
        .testimonial-card h3 {
            color: white;
        }
        
        .testimonial-card p {
            font-style: italic;
            line-height: 1.6;
        }
        
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .testimonial-author img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .testimonial-author strong {
            display: block;
            font-size: 1rem;
        }
        
        .testimonial-author span {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .page-title {
                font-size: 2.5rem;
            }
            
            .contact-sidebar {
                padding-left: 0;
                margin-top: 3rem;
            }
            
            .service-header {
                flex-direction: column;
                text-align: center;
            }
            
            .package-card.featured {
                transform: none;
            }
        }
    `).appendTo('head');
});
