// Clock functionality
function startTime() {
    const today = new Date();
    const h = today.getHours().toString().padStart(2, '0');
    const m = today.getMinutes().toString().padStart(2, '0');
    const s = today.getSeconds().toString().padStart(2, '0');
    
    document.getElementById("clock").innerHTML = `${h}:${m}:${s}`;
    
    // Update date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = today.toLocaleDateString('ru-RU', options);
    document.getElementById("date").innerHTML = dateStr;
    
    setTimeout(startTime, 1000);
}

// Start when page loads
document.addEventListener('DOMContentLoaded', function() {
    startTime();
});
