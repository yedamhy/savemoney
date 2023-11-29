const { Router } = require("express");
const router = require("../../login/routes/auth");
const fs = require("fs");


const bodyParser = require('body-parser');
const dbPool = require('../../mysql/index');



router.get("/",function(req,res,next) {
    fs.readFile("/index.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    });
    
// 이거 영주가 처음에 개발했을때 만들어 둔건데 혹시 도움될까봐 지우지않을게! 필요없으면 지워도 됩니당
// function openCommentModal(postElement) {
//     currentPost = postElement;
//     let postContent = postElement.getElementsByClassName('post-content')[0].textContent;
//     document.getElementById('post-content-container').innerHTML = '<strong>게시글:</strong> ' + postContent;

//     let commentsContainer = document.getElementById('comments-container');
//     commentsContainer.innerHTML = '';

//     let existingComments = postElement.getElementsByClassName('comment');
//     for (let i = 0; i < existingComments.length; i++) {
//         let commentElement = document.createElement('div');
//         commentElement.classList.add('comment');
//         commentElement.textContent = existingComments[i].textContent;
//         commentsContainer.appendChild(commentElement);
//     }

//     commentModal.style.display = 'block';
//     // 댓글을 새로 작성할 때 이전 내용 초기화
//     document.getElementById('comment-content').value = '';
// }

// function closeCommentModal() {
//     commentModal.style.display = 'none';
// }

router.get('/getPosts',(req,res)=>{
    try{
        console.log("getPosts 들어옴");
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

// 간단한 배열을 데이터베이스로 사용
// const postsDatabase = [];
router.post("/savePost",async(req,res)=>{
    try{
        const post_id = req.params.post_id;
        console.log("저장하기 버튼 함수는 들어옴")
        const postInfo = {
            date: req.body.postDate,
            price: req.body.postPrice,
            content:req.body.postContent
            
        };
        // console.log(postInfo)
        if (postInfo && postInfo.content) {
            const content = postInfo.content.trim();
            
        
            if (content !== '') {
                // 게시물 저장 로직
                // console.log("메세지 입력해봐")
                // const sql = `INSERT INTO post (date, price, text) VALUES (?, ?, ?)`;
                console.log('Before query execution');
                try{
                    dbPool.query('postInsert', [postInfo.date, postInfo.price, postInfo.content]);
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



// function savePost() {
//     let postInfo = {
//         postDate: document.getElementById('date').value,
//         postPrice: document.getElementById('price').value,
//         postContent: document.getElementById('post-content').value
//       };

//     if (postInfo.postContent.trim() !== ''|| postInfo.postPrice.trim()!=='') {
//         // 게시물 댓글 통째로 담기
//         let postElement = document.createElement('div');
//         postElement.classList.add('post-box');
//         postElement.onclick = function () {
//             openCommentModal(postElement);
//         };
//         // 게시물 내용 담기
//         let postContentElement = document.createElement('div');
//         postContentElement.classList.add('post-content');
//         postContentElement.textContent = `Date: ${postInfo.postDate}`;
//         postContentElement.textContent += `, Price: ${postInfo.postPrice}`;
//         postContentElement.textContent += `, Content: ${postInfo.postContent}`;
//         postElement.appendChild(postContentElement);

//         // 댓글 담기
//         let commentsContainer = document.createElement('div');
//         commentsContainer.classList.add('comments-container');
//         postElement.appendChild(commentsContainer);


//         // 상단에 게시글 추가
//         postsContainer.insertBefore(postElement, postsContainer.firstChild);

        
//         // 저장 후 창 닫기
//         closePostModal();

//     } else {
//         alert('가격과 포스트 내용을 입력하세요.');
//     }
// }
// function displayPosts() {
//     const threadContainer = document.getElementById('thread-container');
//     threadContainer.innerHTML = ''; // 이전 게시물 내용을 초기화

//     // 시간 역순으로 정렬하여 최신 글이 위로 오도록 함
//     const sortedPosts = postsDatabase.slice().reverse();

//     sortedPosts.forEach((postInfo, index) => {
//         const postElement = document.createElement('div');
//         postElement.classList.add('post-box');
//         postElement.innerHTML = `
//             <p><strong>게시일:</strong> ${postInfo.postDate}</p>
//             <p><strong>가격:</strong> ${postInfo.postPrice}</p>
//             <p><strong>내용:</strong> ${postInfo.postContent}</p>
//         `;

//         // 새로운 게시물을 맨 위에 추가
//         // threadContainer.insertBefore(postElement, threadContainer.firstChild);
//     });
// }

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