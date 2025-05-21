document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("blog-container");

    const newsData = [
        {
            title: "Lumière Wins Artisan Jewelry Award",
            content: "We are honored to be recognized for excellence in design and craftsmanship at the International Jewelry Awards.",
            date: "2025-02-14T10:15",
            image: "./img/award.jpg",
        },
        {
            title: "Join Us at the Paris Pop-Up Event",
            content: "Experience the elegance of Lumière in person. Our Paris pop-up will feature exclusive designs and live customization.",
            date: "2025-03-28T14:30",
            image: "./img/pop-up-event.jpg",
        },
        {
            title: "Spring Sparkle Collection Launch",
            content: "We’re thrilled to unveil our newest line inspired by cherry blossoms and golden sunsets. Available now in stores and online!",
            date: "2025-04-10T09:00",
            image: "./img/new-collection.jpg",
        }
    ];

    function formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function renderNews(news) {
        newsContainer.innerHTML = '';
        news.forEach(item => {
            const card = document.createElement("div");
            card.className = "news-card";
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="news-content">
                    <h3 ${item.important ? 'style="font-weight:bold;"' : ''}>${item.title}</h3>
                    <p class="news-body" style="display: none;">${item.content}</p>
                    <span class="date">${formatDateTime(item.date)}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                document.querySelectorAll('.news-body').forEach(p => p.style.display = 'none');
                card.querySelector('.news-body').style.display = 'block';
            });
            newsContainer.appendChild(card);
        });
    }
    newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderNews(newsData);
});

const scrollBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const triggerHeight = window.innerHeight * (2 / 3);
    
    if (scrolled > triggerHeight) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
