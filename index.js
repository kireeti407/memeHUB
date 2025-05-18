import auth from "./main.js"
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
window.addEventListener("DOMContentLoaded",async()=>{
    let toggle=document.getElementById("toggleDarkMode")
    localStorage.setItem("email",'')
    let memesData=[]
    if (localStorage.getItem('darkMode') === 'true') {
          document.body.classList.add('dark');
          toggle.textContent = '☀️'; // Show sun in dark mode
      } else {
          toggle.textContent = '🌙'; // Show moon in light mode
      }

      // Toggle on click
      toggle.addEventListener("click", () => {
          document.body.classList.toggle('dark');
          const isDark = document.body.classList.contains('dark');
          localStorage.setItem('darkMode', isDark);
          toggle.textContent = isDark ? '☀️' : '🌙';
      });
      await onAuthStateChanged(auth,(user)=>{
        if(user) window.location.href="./js/Dashboard.html"
      })

      async function fetchdata(){
            try{
                let res=await fetch("https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes.json")
                let data= await res.json()
                memesData=Object.entries(data).map(([id,e])=>{
                    return {id,...e}
                })
                console.log(memesData)
                display()
            }
            catch(err){
                alert("somthing went wrong")
            }
        }

      function display(){
            let memediv=document.getElementById("memediv")
            memesData.forEach((meme)=>{
                const canvas = document.createElement('canvas');
                canvas.width = 500;
                canvas.height = 500;
                const ctx = canvas.getContext('2d');

                const img = new Image();
                img.crossOrigin = 'anonymous'; // to avoid CORS issues
                img.src = meme.img;

                img.onload = function () {
    // Draw image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Text styling
                ctx.font = 'bold 32px Impact';
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.textAlign = 'center';

    // Draw top text
                ctx.fillText(meme.toptext.toUpperCase(), canvas.width / 2, 40);
                ctx.strokeText(meme.toptext.toUpperCase(), canvas.width / 2, 40);

    // Draw bottom text
                ctx.fillText(meme.bottomtext.toUpperCase(), canvas.width / 2, canvas.height - 20);
                ctx.strokeText(meme.bottomtext.toUpperCase(), canvas.width / 2, canvas.height - 20);

    // Convert canvas to image
                const memeImgUrl = canvas.toDataURL('image/png');
                const card = document.createElement('div');
                card.className = 'meme-card';
                card.innerHTML = `
                  <img src="${memeImgUrl}" alt="Meme by ${meme.name}">
                  <div class="info">
                    <p><strong>By:</strong> ${meme.name}</p>
                    <p><strong>Likes:</strong> ${Object.keys(meme.like).length } &nbsp; <strong>Dislikes:</strong> ${Object.keys(meme.dislike).length}</p>
                    <p><strong>Date:</strong> ${meme.date}</p>
                  </div>
                `;

                // Actions Section
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions';
                            
                // Like Button
                const likeBtn = document.createElement('button');
                likeBtn.className = 'like-btn';
                likeBtn.textContent = '👍 Like';
                likeBtn.addEventListener('click', () => {
                  alert("create an account")
                });
                
                // Dislike Button
                const dislikeBtn = document.createElement('button');
                dislikeBtn.className = 'dislike-btn';
                dislikeBtn.textContent = '👎 Dislike';
                dislikeBtn.addEventListener('click', () => {
                  console.log(`Disliked meme: ${meme.id}`);
                  alert("create an account")
                });

                const commentBtn = document.createElement('button');
                commentBtn.className = 'comment-btn';
                commentBtn.textContent = '💬 Comment';
                commentBtn.addEventListener('click', () => {
                  console.log(`Comment clicked for meme: ${meme.id}`);
                  alert("create an account")
                });
                if(meme.email!=localStorage.getItem("email")){
                    actionsDiv.appendChild(likeBtn);
                    actionsDiv.appendChild(dislikeBtn);
                    actionsDiv.appendChild(commentBtn);
                    card.appendChild(actionsDiv);
                }
                memediv.appendChild(card);
                }
            })

        }
      fetchdata()
})
