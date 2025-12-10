export function initMural() {
    const container = document.getElementById('mural-2d');
    if (!container) return;

    const photoPaths = [
        '/polaroids_optimized/aprile0084-2024-10-18-04-16-17-utc.jpg',
        '/polaroids_optimized/asian-lovely-couple-with-shih-tzu-dog-2024-12-13-18-15-18-utc.jpg',
        '/polaroids_optimized/brother-sister-elementary-childhood-kid-playful-co-2025-02-10-09-12-08-utc.jpg',
        '/polaroids_optimized/close-up-of-a-woman-with-brown-eyes-and-a-cat-2025-02-12-03-27-43-utc.jpg',
        '/polaroids_optimized/couple-in-park-in-the-sunshine-2024-11-03-04-19-13-utc.jpg',
        '/polaroids_optimized/cropped-portrait-of-a-cute-little-girl-cuddling-he-2025-04-06-10-53-51-utc.jpg',
        '/polaroids_optimized/cute-ginger-cat-in-xmas-jumper-2025-01-29-08-09-43-utc.jpg',
        '/polaroids_optimized/cute-kitty-2024-10-17-11-44-26-utc.jpg',
        '/polaroids_optimized/female-owner-holding-and-cuddling-border-terrier-p-2024-10-21-04-37-19-utc.jpg',
        '/polaroids_optimized/little-boy-and-girl-with-big-lilac-bouquet-2024-09-19-17-44-51-utc.jpg',
        '/polaroids_optimized/loving-woman-giving-kisses-to-her-adorable-pet-2025-11-30-18-56-33-utc.jpg',
        '/polaroids_optimized/man-and-woman-in-fashionable-clothes-are-hugging-2024-12-04-19-05-11-utc.jpg',
        '/polaroids_optimized/silhouette-2024-12-05-15-43-56-utc.jpg',
        '/polaroids_optimized/vertical-shot-of-lovely-glad-small-child-wears-red-2025-01-24-02-16-32-utc.jpg'
    ];

    // Shuffle array to make it random each time
    photoPaths.sort(() => Math.random() - 0.5);

    // Responsive Configuration
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // Adjust polaroid count and size based on screen
    let maxPolaroids, polaroidWidth, polaroidHeight, cols, rows;

    if (isSmallMobile) {
        maxPolaroids = 4;
        polaroidWidth = 90;
        polaroidHeight = 120;
        cols = 2;
        rows = 2;
    } else if (isMobile) {
        maxPolaroids = 6;
        polaroidWidth = 100;
        polaroidHeight = 130;
        cols = 3;
        rows = 2;
    } else {
        maxPolaroids = photoPaths.length;
        polaroidWidth = 140;
        polaroidHeight = 180;
        cols = 5;
        rows = 3;
    }

    const cellWidth = container.clientWidth / cols;
    const cellHeight = container.clientHeight / rows;

    // Limit photos to display
    const photosToShow = photoPaths.slice(0, maxPolaroids);

    for (let i = 0; i < photosToShow.length; i++) {
        createPolaroid(i, photosToShow);
    }

    function createPolaroid(index, photos) {
        const div = document.createElement('div');
        div.classList.add('polaroid-item');

        // Set dynamic size
        div.style.width = `${polaroidWidth}px`;

        // Spread logic: Assign per cell then jitter
        const col = index % cols;
        const row = Math.floor(index / cols) % rows;

        // Random jitter within cell (less jitter on mobile for cleaner look)
        const jitterMultiplier = isMobile ? 0.3 : 0.6;
        const jitterX = (Math.random() - 0.5) * (cellWidth * jitterMultiplier);
        const jitterY = (Math.random() - 0.5) * (cellHeight * jitterMultiplier);

        let left = (col * cellWidth) + (cellWidth / 2) - (polaroidWidth / 2) + jitterX;
        let top = (row * cellHeight) + (cellHeight / 2) - (polaroidHeight / 2) + jitterY;

        // Ensure initial bounds
        left = Math.max(10, Math.min(container.clientWidth - polaroidWidth - 10, left));
        top = Math.max(10, Math.min(container.clientHeight - polaroidHeight - 10, top));

        // Less rotation on mobile for cleaner aesthetic
        const maxRotation = isMobile ? 12 : 20;
        const rotation = (Math.random() * maxRotation * 2) - maxRotation;

        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
        div.style.transform = `rotate(${rotation}deg)`;

        // Pin
        const pin = document.createElement('div');
        pin.classList.add('polaroid-pin');
        div.appendChild(pin);

        // Image
        const img = document.createElement('img');
        img.src = photos[index];
        img.classList.add('polaroid-img');
        img.loading = 'lazy';
        div.appendChild(img);

        container.appendChild(div);

        // Drag Logic (Mouse + Touch)
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        // Mouse Events
        div.addEventListener('mousedown', handleDragStart);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleDragEnd);

        // Touch Events for Mobile
        div.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);

        function handleDragStart(e) {
            isDragging = true;
            div.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = div.offsetLeft;
            initialTop = div.offsetTop;
            div.style.transform = `rotate(${rotation + (Math.random() * 6 - 3)}deg) scale(1.1)`;
        }

        function handleTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            isDragging = true;
            div.classList.add('dragging');
            startX = touch.clientX;
            startY = touch.clientY;
            initialLeft = div.offsetLeft;
            initialTop = div.offsetTop;
            div.style.transform = `rotate(${rotation + (Math.random() * 4 - 2)}deg) scale(1.08)`;
        }

        function handleMouseMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            updatePosition(e.clientX, e.clientY);
        }

        function handleTouchMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            updatePosition(touch.clientX, touch.clientY);
        }

        function updatePosition(clientX, clientY) {
            const dx = clientX - startX;
            const dy = clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            const overlap = isMobile ? 10 : 20;
            const maxLeft = container.clientWidth - div.offsetWidth + overlap;
            const maxTop = container.clientHeight - div.offsetHeight + overlap;

            newLeft = Math.max(-overlap, Math.min(maxLeft, newLeft));
            newTop = Math.max(-overlap, Math.min(maxTop, newTop));

            div.style.left = `${newLeft}px`;
            div.style.top = `${newTop}px`;
        }

        function handleDragEnd() {
            if (isDragging) {
                isDragging = false;
                div.classList.remove('dragging');
                div.style.transform = `rotate(${rotation}deg) scale(1)`;
            }
        }
    }
}
