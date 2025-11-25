document.addEventListener("DOMContentLoaded", function () {
    const ranks = [
        { rank: 3, delay: 800,  sound: "sound3", score: 88 },
        { rank: 2, delay: 2200, sound: "sound2", score: 90 },
        { rank: 1, delay: 3600, sound: "sound1", score: 95 }
    ];

    ranks.forEach(item => {
        setTimeout(() => {
            const row = document.querySelector(`tbody tr.top3-${item.rank}`);
            row.classList.add("revealed");
            
            // Đếm điểm
            const cell = row.querySelector("td:last-child");
            let n = 0;
            const timer = setInterval(() => {
                n += Math.ceil(item.score / 35);
                if (n >= item.score) {
                    cell.textContent = item.score;
                    clearInterval(timer);
                } else {
                    cell.textContent = n;
                }
            }, 40);

            // Hạng 1 rung
            if (item.rank === 1) {
                setTimeout(() => row.classList.add("shake"), 800);
            }
        }, item.delay);
    });
});