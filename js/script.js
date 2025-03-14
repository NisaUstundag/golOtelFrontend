// Hover-info öğelerini başlangıçta gizle

document.querySelectorAll(".hover-info").forEach(info => {
  info.style.maxHeight = "0";
  info.style.opacity = "0";
  info.style.overflow = "hidden";
  info.style.transition = "max-height 0.5s ease, opacity 0.5s ease";
});

// Butonlara hover olayları ekle
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("mouseenter", () => toggleHoverInfo(button, true));
  button.addEventListener("mouseleave", () => toggleHoverInfo(button, false));
});

// Hover-info öğesinin gösterilmesi veya gizlenmesi işlemi
function toggleHoverInfo(button, isVisible) {
  const hoverInfo = button.nextElementSibling; // Butonun hemen sonrasındaki öğe
  if (hoverInfo) {
    hoverInfo.style.maxHeight = isVisible ? "500px" : "0";
    hoverInfo.style.opacity = isVisible ? "1" : "0";
  }
}

// Hamburger menüsünü açma/kapatma işlemi
const menuButton = document.querySelector("#menu-btn");
const navbar = document.querySelector(".header .navbar");

if (menuButton && navbar) {
  menuButton.addEventListener("click", () => {
    navbar.classList.toggle("active"); // Menü açma/kapatma işlemi
  });
}
// Arama butonuna tıklanma olayını ekliyoruz
const searchBtn = document.querySelector(".search .btn.btn-primary");
if (searchBtn) {
  searchBtn.addEventListener("click", function(e) {
    e.preventDefault(); // Form gönderimini engelle

    removeHighlights(); // Önceki vurgulamaları temizle

    const query = document.querySelector(".search-input").value.trim();
    if (query === "") return; // Boş arama ise çık

    // Tam kelime eşleşmesi için \b kullanıyoruz
    const regex = new RegExp(`\\b(${query.split(/\s+/).join("|")})\\b`, "gi");
    let found = false;

    const searchContainer = document.querySelector("#mainContent") || document.body;
    highlightText(searchContainer);

    if (!found) {
      const feedback = document.createElement("div");
      feedback.className = "search-feedback";
      feedback.innerText = "Aradığınız kelime bulunamadı.";
      feedback.style.position = "fixed";
      feedback.style.bottom = "10px";
      feedback.style.right = "10px";
      feedback.style.background = "#f00";
      feedback.style.color = "#fff";
      feedback.style.padding = "10px";
      feedback.style.borderRadius = "5px";
      document.body.appendChild(feedback);
      setTimeout(() => {
        feedback.remove();
      }, 3000);
    } else {
      const firstHighlight = document.querySelector('.highlight');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function highlightText(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (regex.test(node.data)) {
          found = true;
          const span = document.createElement("span");
          // Sadece eşleşen kısmı vurguluyoruz
          span.innerHTML = node.data.replace(regex, '<span class="highlight">$1</span>');
          node.parentNode.replaceChild(span, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE &&
                 node.nodeName !== "SCRIPT" &&
                 node.nodeName !== "STYLE" &&
                 !node.closest(".header") &&
                 !node.closest(".footer") &&
                 !node.closest(".search")) {
        for (let i = 0; i < node.childNodes.length; i++) {
          highlightText(node.childNodes[i]);
        }
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("review-modal");
  const openBtn = document.getElementById("add-review-btn");
  const closeBtn = document.querySelector(".close");
  const form = document.getElementById("review-form");

  if (!modal || !openBtn || !closeBtn || !form) {
      console.error("HATA: Gerekli HTML öğelerinden biri bulunamadı!");
      return;
  }

  openBtn.addEventListener("click", function() {
      modal.style.display = "block";
  });

  closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
  });

  form.addEventListener("submit", function(event) {
      event.preventDefault();
      let formData = new FormData(form);

      fetch("rev.php", {
          method: "POST",
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          if (data.status === "success") {
              modal.style.display = "none";
              form.reset();
          }
      })
      .catch(error => {
          console.error("Hata:", error);
          alert("Bir hata oluştu!");
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const reviewForm = document.getElementById("review-form");
  const reviewsContainer = document.querySelector(".reviews-wrapper");
  const modal = document.getElementById("review-modal");
  const addReviewBtn = document.getElementById("add-review-btn");
  const closeBtn = document.querySelector(".close");

  // Modal Açma/Kapama İşlemleri
  addReviewBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Yorum Formu Gönderimi
  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const userImageInput = document.getElementById("userImage");
    let imageUrl = "images/avatar-default.jpg";
    if (userImageInput && userImageInput.files[0]) {
      imageUrl = URL.createObjectURL(userImageInput.files[0]);
    }

    fetch("rev.php", {
      method: "POST",
      body: formData,
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === "success") {
        const firstName = document.getElementById("firstName").value;
        const rating = parseInt(document.getElementById("rating").value);
        const comment = document.getElementById("comment").value;
        let starsHtml = "";
        for (let i = 0; i < 5; i++) {
          starsHtml += i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        const newReview = `
          <div class="box">
            <img src="images/alinti.png" alt="quote">
            <p>${comment}</p>
            <img src="${imageUrl}" alt="avatar" class="user" style="width:50px; height:50px;">
            <h3>${firstName}</h3>
            <div class="stars">${starsHtml}</div>
          </div>
        `;
        // Yeni yorumu en başa ekle
        reviewsContainer.insertAdjacentHTML("afterbegin", newReview);

        // Başarı mesajı
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.innerText = "YORUMUNUZ EKLENDİ!";
        successMessage.style.position = "fixed";
        successMessage.style.bottom = "20px";
        successMessage.style.right = "20px";
        successMessage.style.background = "#4CAF50";
        successMessage.style.color = "#fff";
        successMessage.style.padding = "10px 20px";
        successMessage.style.borderRadius = "5px";
        document.body.appendChild(successMessage);

        setTimeout(() => {
          successMessage.remove();
        }, 3000);

        modal.style.display = "none";
        reviewForm.reset();
      } else {
        alert("Yorum eklenirken hata: " + result.message);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Yorum gönderilirken bir hata oluştu.");
    });
  });

  // Slider Kontrolleri
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let scrollAmount = 0;
  nextBtn.addEventListener("click", () => {
    const box = document.querySelector(".box");
    const boxWidth = box ? box.offsetWidth : 300;
    scrollAmount += boxWidth;
    const maxScroll = reviewsContainer.scrollWidth - reviewsContainer.clientWidth;
    if (scrollAmount > maxScroll) scrollAmount = maxScroll;
    reviewsContainer.style.transform = `translateX(-${scrollAmount}px)`;
  });
  prevBtn.addEventListener("click", () => {
    const box = document.querySelector(".box");
    const boxWidth = box ? box.offsetWidth : 300;
    scrollAmount -= boxWidth;
    if (scrollAmount < 0) scrollAmount = 0;
    reviewsContainer.style.transform = `translateX(-${scrollAmount}px)`;
  });
});
