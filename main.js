import { TTScraper } from "tiktok-scraper-ts";
import fs from "fs";
import express from "express";
import cors from "cors";
const TikTokScraper = new TTScraper();

const app = express();

// middleware
app.use(cors());
app.use(express.json())

app.post("/get-video",(req,res) => {
    const userName = req.body.name;
    
    // let rawdata = fs.readFileSync(`./data/${userName}.json`);
    let ids = JSON.parse(req.body).ids
    let arr = [];
    const callApi = async (userName, id) => {
      const fetchVideo = await TikTokScraper.video(`https://www.tiktok.com/@${userName}/video/${id}`, true);
      // The second argument is set to true to fetch the video without the watermark.
      return fetchVideo;
    };
    
    // Gọi hàm callApi sau mỗi 2 giây với từng video ID
    let currentIndex = 0;
    const intervalId = setInterval(async () => {
      if (currentIndex < ids.length) {
        const currentId = ids[currentIndex];
        try {
          const videoData = await callApi(userName, currentId);
          // Xử lý dữ liệu video ở đây (ví dụ: lưu vào file, hiển thị thông tin, v.v.)
          arr.push(videoData);
        } catch (error) {
          console.error(`Error fetching video ${currentId}:`, error);
        }
        currentIndex++;
      } else {
        // Đã duyệt qua tất cả các video ID, dừng interval
        clearInterval(intervalId);
        res.send(arr).json()
        // arr = JSON.stringify(arr)
        // fs.writeFileSync('./result/'+userName+'.json',arr);
        console.error(`Success fetching video !!`);
      }
    }, 2000); // 2000 milliseconds = 2 seconds
})

const PORT= process.env.PORT || 8000;
app.listen(PORT, () => {{
    console.log("Server is running port" ,PORT);
}});
