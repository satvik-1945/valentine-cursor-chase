const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

const memes = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif",
  "https://media.giphy.com/media/QBd2kLB5qDmysEXre9/giphy.gif"
];

let hoverCount = 0;

noBtn.addEventListener("mouseover", () => {
  hoverCount++;
  // run away effect
  const x = Math.random()*300 - 150;
  const y = Math.random()*200 - 100;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;

  if (hoverCount >= 5) {
    eatNoButton();
  }
});

yesBtn.onclick = triggerYesSuccess;

document.addEventListener("mousemove", e => {
  const heart = document.createElement("div");
  heart.innerHTML = "💖";
  heart.style.position = "fixed";
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";
  heart.style.pointerEvents = "none";
  heart.style.fontSize = "16px";
  heart.style.opacity = 1;
  heart.style.transition = "all 0.6s ease-out";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.style.transform = "translateY(-20px)";
    heart.style.opacity = 0;
  }, 10);

  setTimeout(() => heart.remove(), 600);
});

function submitEmail() {
  const email = document.getElementById("email").value.trim();

  if(email.length === 0){
    alert("naughty girl atleast fill something 😤");
    return;
  }
  if (!isValidEmail(email)) {
    alert("You are breaking my heart,please enter a valid email 💔");
    return;
  }

  fetch("/save-email", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email})
  });

  alert("Registered for Valentine Week 💌");
}

function eatNoButton() {

  // move YES near NO position
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const dx = noRect.left - yesRect.left;
  const dy = noRect.top - yesRect.top;

  yesBtn.style.transform = `translate(${dx}px, ${dy}px) scale(2)`;
  yesBtn.style.transition = "all 0.5s ease-in-out";

  yesBtn.animate([
  { transform: "scale(1)" },
  { transform: "scale(2.3)" },
  { transform: "scale(2)" }
], { duration: 400 });

  // shrink NO
  noBtn.classList.add("eaten");

  setTimeout(() => {
    noBtn.style.display = "none";

    triggerYesSuccess(); 

  }, 500);
}

function triggerYesSuccess() {
  document.getElementById("popup").style.display = "block";

  const gif = memes[Math.floor(Math.random()*memes.length)];
  document.getElementById("memeGif").src = gif;

  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.6 }
  });
}