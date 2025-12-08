export function initMural() {
    const container = document.getElementById('mural-2d');
    if (!container) return;

    const photoPaths = [
        '/polaroids/aprile0084-2024-10-18-04-16-17-utc.jpg',
        '/polaroids/asian-lovely-couple-with-shih-tzu-dog-2024-12-13-18-15-18-utc.jpg',
        '/polaroids/brother-sister-elementary-childhood-kid-playful-co-2025-02-10-09-12-08-utc.jpg',
        '/polaroids/close-up-of-a-woman-with-brown-eyes-and-a-cat-2025-02-12-03-27-43-utc.jpg',
        '/polaroids/couple-in-park-in-the-sunshine-2024-11-03-04-19-13-utc.jpg',
        '/polaroids/cropped-portrait-of-a-cute-little-girl-cuddling-he-2025-04-06-10-53-51-utc.jpg',
        '/polaroids/cute-ginger-cat-in-xmas-jumper-2025-01-29-08-09-43-utc.jpg',
        '/polaroids/cute-kitty-2024-10-17-11-44-26-utc.jpg',
        '/polaroids/female-owner-holding-and-cuddling-border-terrier-p-2024-10-21-04-37-19-utc.jpg',
        '/polaroids/little-boy-and-girl-with-big-lilac-bouquet-2024-09-19-17-44-51-utc.jpg',
        '/polaroids/loving-woman-giving-kisses-to-her-adorable-pet-2025-11-30-18-56-33-utc.jpg',
        '/polaroids/man-and-woman-in-fashionable-clothes-are-hugging-2024-12-04-19-05-11-utc.JPG',
        '/polaroids/silhouette-2024-12-05-15-43-56-utc.jpg',
        '/polaroids/vertical-shot-of-lovely-glad-small-child-wears-red-2025-01-24-02-16-32-utc.jpg'
    ];

    // Shuffle array to make it random each time
    photoPaths.sort(() => Math.random() - 0.5);

    // Grid Layout Logic to Spread Items
    const polaroidWidth = 140;
    const polaroidHeight = 180;
    const cols = 5;
    const rows = 3;
    const cellWidth = container.clientWidth / cols;
    const cellHeight = container.clientHeight / rows;

    for (let i = 0; i < photoPaths.length; i++) {
        createPolaroid(i);
    }

    function createPolaroid(index) {
        const div = document.createElement('div');
        div.classList.add('polaroid-item');

        // Spread logic: Assign per cell then jitter
        const col = index % cols;
        const row = Math.floor(index / cols) % rows; // wrap around rows

        // Random jitter within cell
        const jitterX = (Math.random() - 0.5) * (cellWidth * 0.6);
        const jitterY = (Math.random() - 0.5) * (cellHeight * 0.6);

        let left = (col * cellWidth) + (cellWidth / 2) - (polaroidWidth / 2) + jitterX;
        let top = (row * cellHeight) + (cellHeight / 2) - (polaroidHeight / 2) + jitterY;

        // Ensure initial bounds
        left = Math.max(10, Math.min(container.clientWidth - polaroidWidth - 10, left));
        top = Math.max(10, Math.min(container.clientHeight - polaroidHeight - 10, top));

        const rotation = (Math.random() * 40) - 20; // -20 to +20 deg

        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
        div.style.transform = `rotate(${rotation}deg)`;

        // Pin
        const pin = document.createElement('div');
        pin.classList.add('polaroid-pin');
        div.appendChild(pin);

        // Image
        const img = document.createElement('img');
        const src = photoPaths[index % photoPaths.length];
        img.src = src;
        img.classList.add('polaroid-img');
        div.appendChild(img);

        container.appendChild(div);

        // Drag Logic
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        div.addEventListener('mousedown', (e) => {
            isDragging = true;
            div.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = div.offsetLeft;
            initialTop = div.offsetTop;

            // Randomize rotation slightly on pick up
            div.style.transform = `rotate(${rotation + (Math.random() * 6 - 3)}deg) scale(1.1)`;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // Constraint: Keep roughly inside container but allow border overlap
            // Border is 25px, so allow ~20px overlap
            const overlap = 20;

            const maxLeft = container.clientWidth - div.offsetWidth + overlap;
            const maxTop = container.clientHeight - div.offsetHeight + overlap;

            newLeft = Math.max(-overlap, Math.min(maxLeft, newLeft));
            newTop = Math.max(-overlap, Math.min(maxTop, newTop));

            div.style.left = `${newLeft}px`;
            div.style.top = `${newTop}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                div.classList.remove('dragging');
                // Snap back scale but keep rotation
                div.style.transform = `rotate(${rotation}deg) scale(1)`;
            }
        });
    }

    // Handle Resize to keep them in bounds roughly? 
    // For now purely absolute is fine for "messy desk" vibe.
}
