const { Router } = require("express");
const router = require("../../login/routes/auth");
const fs = require("fs");


const bodyParser = require('body-parser');
const dbPool = require('../../mysql/index');



router.get("/",function(req,res,next) {
    fs.readFile("/index.njk", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    });

// post 불러오기
router.get('/getPosts',(req,res)=>{
    try{
        // console.log("getPosts 들어옴");
        dbPool.query("postList",(err,results)=>{
            if (err){
                console.error('게시글 불러오기 중 mysql 오류',err);
                res.status(500).json({error:'게시글을 불러오는 동안 오류가 발생'});

            }else{
                res.json(results);
            }
        });
    }catch(error){
        console.error('게시글 불러오기 중 오류 발생',error);
        res.status(500).json({error: '게시글을 불러오는 동안 오류 발생'});
    }
    // const sortedPosts = postsDatabase.slice().reverse();
    // res.status(200).json(sortedPosts);
});

// post 저장하기
router.post("/savePost",async(req,res)=>{
    try{
        const post_id = req.params.post_id;
        
        const postInfo = {
            date: req.body.postDate,
            price: req.body.postPrice,
            content:req.body.postContent,
            kakao_id : req.session.kakao.id
            
        };

        // console.log(postInfo)
        if (postInfo && postInfo.content) {
            const content = postInfo.content.trim();
            
        
            if (content !== '') {
                const formattedDate = new Date(postInfo.date).toISOString().slice(0, 10);
                
                // 게시물 저장 로직
                // console.log("메세지 입력해봐")
                // const sql = `INSERT INTO post (date, price, text) VALUES (?, ?, ?)`;
                console.log('Before query execution');
                try{
                    dbPool.query('postInsert', [formattedDate, postInfo.price, postInfo.content, postInfo.kakao_id]);
                    console.log('저장 완료!');
                    res.status(200).send('게시물이 성공적으로 저장되었습니다.');
                }  catch (err) {
                    console.error('게시물 저장 중 MySQL 오류:', err);
                    res.status(500).json({ error: '게시물을 저장하는 동안 오류가 발생했습니다.' });
                
                    // if (err) {
                    //     console.error('게시물 저장 중 MySQL 오류:', err);
                    //     res.status(500).json({ error: '게시물을 저장하는 동안 오류가 발생했습니다.' });
                    //   } else {
                    //     console.log('게시물이 성공적으로 저장되었습니다.');
                    //     res.status(200).send('게시물이 성공적으로 저장되었습니다.');
                    //   }
                // postsDatabase.push(postInfo);
                // console.log(postsDatabase);

                } 
                console.log('After query execution');
            }
        }
            }catch (error) {
        console.error('Error during savepost:', error);
        // res.status(500).json({ error: 'Internal Server Error' });
            }
    });

// 댓글 저장하기
router.post('/saveComment', async (req, res) => {
    try {
        // 요청 본문에서 postId와 commentContent를 추출
        const { postId, commentContent } = req.body;
        console.log("댓글에서 확인 : ", req.body);
        const userId = req.session.kakao.id;
        // 현재 날짜와 시간
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // 댓글 저장 로직 (예: MySQL 데이터베이스에 저장)
        await dbPool.query("commentInsert", [postId, userId, commentContent, currentDate]);

        res.status(200).json({ message: '댓글이 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('댓글 저장 중 오류 발생:', error);
        res.status(500).json({ error: '댓글을 저장하는 동안 오류 발생' });
    }
});

// 댓글 불러오기
router.get('/getComments', async (req, res) => {
    try {
        const postId = req.query.postId;
        // 데이터베이스에서 postId에 해당하는 댓글 조회
        const comment_post = await dbPool.query("commentList", [postId]);

        // 조회된 댓글 데이터를 JSON 형식으로 클라이언트에 전송
        res.json(comment_post);

    } catch (error) {
        // 오류 발생 시 클라이언트에 오류 메시지 전송
        console.error("댓글 조회 중 오류 발생:", error);
        res.status(500).json({ error: '댓글을 불러오는 동안 오류가 발생했습니다.' });
    }
});


function saveComment() {
    let commentContent = document.getElementById('comment-content').value;

    if (commentContent.trim() !== '') {
        let commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.textContent = commentContent;

        currentPost.getElementsByClassName('comments-container')[0].appendChild(commentElement);

        // 댓글 저장 후 내용 초기화
        document.getElementById('comment-content').value = '';
        updateCommentModal(); // 댓글이 업데이트될 때 해당 모달 창만 업데이트
    } else {
        alert('댓글 내용을 입력하세요.');
    }
}

function updateCommentModal() {
    let commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    let existingComments = currentPost.getElementsByClassName('comment');
    for (let i = 0; i < existingComments.length; i++) {
        let commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.textContent = existingComments[i].textContent;
        commentsContainer.appendChild(commentElement);
    }
}

module.exports=router;