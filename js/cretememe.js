window.addEventListener("DOMContentLoaded",()=>{
    let dashboard=document.getElementById("dashboard")
    let generateMeme=document.getElementById("generateMeme")
    let publishMeme=document.getElementById("publishMeme")
    let suggestCaptions=document.getElementById("suggestCaptions")

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        document.querySelector("header").classList.add("dark");
    }
    document.getElementById("namefe").textContent = localStorage.getItem("name");
    dashboard.addEventListener("click",()=>{
        window.location.href="./dashboard.html"
    })

    const memeCanvas = document.getElementById("memeCanvas");
    const ctx = memeCanvas.getContext("2d");
    let image = new Image();

    document.getElementById("memeImage").addEventListener("change", (e) => {
        const reader = new FileReader();
        reader.onload = function (event) {
        image.onload = () => {
          ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
          ctx.drawImage(image, 0, 0, memeCanvas.width, memeCanvas.height);
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    });


suggestCaptions.addEventListener("click", async () => {
  const fileInput = document.getElementById("memeImage");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a meme image before requesting AI suggestions.");
    return;
  }

  const fileName = file.name;
  const prompt = `Suggest ONE short and funny meme caption for an image named "${fileName}". Keep it meme-style, witty, and under 15 words. Reply ONLY with the caption.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBX5NkDDtv9kQzLt8HhzWV4EACDnuVwQHI",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const res = await response.json();

    const suggestion =
      res?.candidates?.[0]?.content?.parts?.[0]?.text?.split("\n")[0] ||
      "No suggestion available";

    document.getElementById("topText").value = suggestion;
  } catch (err) {
    alert("AI suggestion failed: " + err.message);
    console.error("Gemini API Error:", err);
  }
});



    generateMeme.addEventListener("click",()=>{
        ctx.drawImage(image, 0, 0, memeCanvas.width, memeCanvas.height);
        ctx.font = "16px Impact";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        let topText = document.getElementById("topText").value;
        let bottomText = document.getElementById("bottomText").value;
        ctx.textAlign = "center";
        ctx.fillText(topText, memeCanvas.width / 2, 40);
        ctx.strokeText(topText, memeCanvas.width / 2, 40);
        ctx.fillText(bottomText, memeCanvas.width / 2, memeCanvas.height - 20);
        ctx.strokeText(bottomText, memeCanvas.width / 2, memeCanvas.height - 20);
    })

    publishMeme.addEventListener("click",async()=>{

            const file = document.getElementById("memeImage").files[0];
            const formData = new FormData();
      
            formData.append("file", file);
            formData.append("upload_preset", "jobportal"); 
      
            let res1=await fetch("https://api.cloudinary.com/v1_1/dg931dlw7/image/upload", {
              method: "POST",
              body: formData
            })
            let data1=await res1.json()
            let toptext=document.getElementById("topText").value
            let bottomtext=document.getElementById("bottomText").value
            let now=new Date()
            if(file && toptext && bottomtext){
                let data={
                   img:data1.secure_url,
                   toptext,
                   bottomtext,
                   email:localStorage.getItem("email"),
                   name:localStorage.getItem("name"),
                   comments:{comment:0},
                   like:{like:0},
                   dislike:{dislike:0},
                   date:now.toLocaleDateString()

                }
                let res=await fetch("https://memehub-335fc-default-rtdb.asia-southeast1.firebasedatabase.app/Memes.json",{
                   method:"POST",
                   header:{"content-Type":"application/json"},
                   body:JSON.stringify(data)
                })  
                window.location.href='./dashboard.html'
            }
            else{
                alert("somthing is missing")
            }
        })
})