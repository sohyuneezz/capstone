function toggleContent() {
    const items = document.querySelectorAll("#following-content ul li:not(.close)");
    const button = document.getElementById("toggle-button");

    if (items[0].style.display === "none") {
        items.forEach(item => item.style.display = "list-item");
        button.textContent = "닫힘";
    } else {
        items.forEach(item => item.style.display = "none");
        button.textContent = "열림";
    }
}
