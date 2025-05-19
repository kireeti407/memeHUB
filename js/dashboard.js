import auth from "../main.js"
import {signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
window.addEventListener("DOMContentLoaded",async()=>{
        let memesData=[]
        let logout=document.getElementById("logout")
        let creatememe=document.getElementById("creatememe")
        let image=document.getElementById("himg")
        let close=document.getElementById("close")
        let All=document.getElementById("All")
        let toggle=document.getElementById("toggleDarkMode")

        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            toggle.textContent = '☀️';
        } 
        else {
            toggle.textContent = '🌙'; 
        }
        toggle.addEventListener("click", () => {
          document.body.classList.toggle('dark');
          const isDark = document.body.classList.contains('dark');
          localStorage.setItem('darkMode', isDark);
          toggle.textContent = isDark ? '☀️' : '🌙';
        });
        image.addEventListener("click",()=>{
          profile.style.display="flex"
        })
        close.addEventListener("click",()=>{
          profile.style.display="none"
        })
      let mymeme=document.getElementById("mymemes")
      mymeme.addEventListener("click",()=>{
        let profile=document.getElementById("profile")
        let meme=memesData.filter((e)=>e.email==localStorage.getItem("email"))
        if(meme.length<=0)alert("OOPS you didn't post any email")
        else{
          display(meme)
          All.style.display="inline"
      }
      profile.style.display="none"
      })
      All.addEventListener("click",()=>{
        display(memesData)
        All.style.display="none"
      })

        creatememe.addEventListener("click",()=>{
            window.location.href="./creatememe.html"
        })

        //fetchdata
        async function fetchdata(){
            try{
                let res=await fetch("https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes.json")
                let data= await res.json()
                memesData=Object.entries(data).map(([id,e])=>{
                    return {id,...e}
                })
                display(memesData)
            }
            catch(err){
                alert("somthing went wrong")
            }
        }

        function sanitizeEmail(email) {
            return email.replace(/\./g, '_').replace(/@/g, '_at_');
        }

            function display(memeData){
              let memediv=document.getElementById("memediv")
              memediv.innerHTML=''
              memeData.forEach((meme)=>{
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
                  <p>
                    <strong>Likes:</strong> <span class="like-count">${Object.keys(meme.like || {}).length}</span> &nbsp;
                    <strong>Dislikes:</strong> <span class="dislike-count">${Object.keys(meme.dislike || {}).length}</span> &nbsp;
                    <strong>Comments:</strong> <span class="comment-count">${Object.keys(meme.comments || {}).length}</span>
                  </p>
                  <p><strong>Date:</strong> ${meme.date}</p>
                  </div>
                `;
                const commentBtn = document.createElement('button');
                  card.appendChild(commentBtn)
                // Actions Section
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions';

                            
                // Like Button
                const likeBtn = document.createElement('button');
                likeBtn.className = 'like-btn';
                likeBtn.id="like"
                likeBtn.textContent = '👍 Like';
                likeBtn.addEventListener('click', async () => {
                  const rawmail = localStorage.getItem("email");
                  const safeEmail = sanitizeEmail(rawmail);
                  
                  meme.like = meme.like || {};
                  meme.dislike = meme.dislike || {};
                  
                  // Remove from dislike if already disliked
                  if (meme.dislike[safeEmail]) {
                      delete meme.dislike[safeEmail];
                  }
                
                  // Like only if not already liked
                  if (!meme.like[safeEmail]) {
                      meme.like[safeEmail] = rawmail;
                  }
                
                  try {
                    await fetch(`https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes/${meme.id}.json`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ like: meme.like, dislike: meme.dislike })
                    });
                  } catch (err) {
                    console.error("PATCH error (like):", err);
                  }
                  document.querySelectorAll('.like-count').forEach(span => {
                    if (card.contains(span)) {
                      span.innerText = Object.keys(meme.like).length;
                    }
                  });
                  document.querySelectorAll('.dislike-count').forEach(span => {
                    if (card.contains(span)) {
                      span.innerText = Object.keys(meme.dislike).length;
                    }
                  });

                });

                
                // Dislike Button
                const dislikeBtn = document.createElement('button');
                dislikeBtn.className = 'dislike-btn';
                dislikeBtn.id="dislike"
                dislikeBtn.textContent = '👎 Dislike';
                dislikeBtn.addEventListener('click', async () => {
                  const rawmail = localStorage.getItem("email");
                  const safeEmail = sanitizeEmail(rawmail);
                              
                  meme.dislike = meme.dislike || {};
                  meme.like = meme.like || {};
                                
                    // Remove from like if already liked
                  if (meme.like[safeEmail]) {
                      delete meme.like[safeEmail];
                  }

                  // Dislike only if not already disliked
                  if (!meme.dislike[safeEmail]) {
                      meme.dislike[safeEmail] = rawmail;
                  }

                  try {
                      await fetch(`https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes/${meme.id}.json`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ like: meme.like, dislike: meme.dislike })
                      });
                  } catch (err) {
                      console.error("PATCH error (dislike):", err);
                  }
                  document.querySelectorAll('.dislike-count').forEach(span => {
                  if (card.contains(span)) {
                    span.innerText = Object.keys(meme.dislike).length;
                  }
                });
                document.querySelectorAll('.like-count').forEach(span => {
                  if (card.contains(span)) {
                    span.innerText = Object.keys(meme.like).length;
                  }
                });
                });

                // Comment Button

                
                
                commentBtn.id="comment"
                commentBtn.className = 'comment-btn';
                commentBtn.textContent = '💬see Comment';
                
                commentBtn.addEventListener('click', async () => {
  const panel = document.getElementById('comments-panel');
  panel.innerHTML = ''; // Clear previous comments
  panel.style.display = 'block';

  const heading = document.createElement('h3');
  heading.textContent = "💬 Comments";
  panel.appendChild(heading);

  try {
    const res = await fetch(`https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes/${meme.id}/comments.json`);
    const comments = await res.json();

    const commentsDiv = document.createElement('div');
    commentsDiv.className = 'fetched-comments';

    if (!comments) {
      commentsDiv.innerHTML = `<p class="no-comment">No comments yet!</p>`;
    } else {
      Object.entries(comments).forEach(([emailKey, commentText]) => {
        const email = emailKey.replace(/_/g, '.');
        const commentBlock = document.createElement('div');
        commentBlock.className = 'comment-block';
        commentBlock.innerHTML = `<strong>${email}</strong><p>${commentText}</p>`;
        commentsDiv.appendChild(commentBlock);
      });

    
    }
    panel.appendChild(commentsDiv);
    

  } catch (err) {
    panel.innerHTML += `<p class="error-comment">Error loading comments.</p>`;
    console.error(err);
  }
});



                
                // Append all buttons
                if(meme.email!=localStorage.getItem("email")){
                  actionsDiv.appendChild(likeBtn);
                  actionsDiv.appendChild(dislikeBtn);
                  card.appendChild(actionsDiv);

                  // ========== COMMENT FUNCTIONALITY START ==========

                  // Create a container for comment UI
                  const commentSection = document.createElement('div');
                  commentSection.className = 'comment-section';
                  commentSection.style.marginTop = '1rem';

                  const rawmail = localStorage.getItem("email");
                  const safeEmail = sanitizeEmail(rawmail);

                  // Create textarea for comment input
                  const commentInput = document.createElement('textarea');
                  commentInput.placeholder = "Write your comment...";
                  commentInput.rows = 2;
                  commentInput.style.width = "100%";
                  commentInput.style.padding = "0.5rem";
                  commentInput.style.borderRadius = "8px";
                  commentInput.style.marginBottom = "0.5rem";
                  commentInput.style.resize = "none";

                  // Create submit button
                  const submitCommentBtn = document.createElement('button');
                  submitCommentBtn.textContent = "Submit";
                  submitCommentBtn.id="submitbtn"
                  submitCommentBtn.className = 'comment-btn';
                  submitCommentBtn.style.marginTop = "0.2rem";

                  // Check if user already commented
                  const alreadyCommented = meme.comments && meme.comments[safeEmail];

                  if (!alreadyCommented) {
                    submitCommentBtn.addEventListener('click', async () => {
                      const commentText = commentInput.value.trim();
                      if (commentText === "") {
                        alert("Comment cannot be empty.");
                        return;
                      }
                    
                      meme.comments = meme.comments || {};
                      meme.comments[safeEmail] = commentText;
                    
                      try {
                        const res = await fetch(`https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes/${meme.id}.json`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ comments: meme.comments })
                        });
                      
                        const data = await res.json();
                        console.log("Comment added:", data);
                      
                        // Hide input after submission
                        commentInput.remove();
                        submitCommentBtn.remove();
                      
                      } catch (error) {
                        console.error("Error submitting comment:", error);
                      }
                    });
                  
                    commentSection.appendChild(commentInput);
                    commentSection.appendChild(submitCommentBtn);
                  }
                  card.appendChild(commentSection);
                  // ========== COMMENT FUNCTIONALITY END ==========
                }
                
                memediv.appendChild(card);
                }
            })

}

        //OnAuth
        await onAuthStateChanged(auth,async (user)=>{
        if(user){
            let res=await fetch("https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Profile.json")
             let data= await res.json()
             let email=Object.entries(data).map(([id,e])=>{
                  return {id,...e}
             })
             let mail=email.find(e=>e.email==user.email)

             localStorage.setItem("email",mail.email)
             localStorage.setItem("name",mail.name)
             namefe.innerText+=" "+mail.name
             let himg=document.getElementById("himg")
             let mainprofile=document.getElementById("mainprofile")
             let nam=document.getElementById("name")
             himg.style.backgroundImage=`url("${mail.img}")`
            mainprofile.style.backgroundImage=`url("${mail.img}")`
            nam.innerText=mail.name

             fetchdata()
        }
        else{
            window.location.href='../index.html'
        }
    })



        //logout
        logout.addEventListener("click",async()=>{
            await signOut(auth)
            window.location.href='../index.html'
        })


      editbtn.addEventListener("click",()=>{
        edit.style.display="block"
      })
      editclose.addEventListener("click",()=>{
        edit.style.display="none"
      })
  
  
    
})
