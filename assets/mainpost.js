 //게시글을 불러와 화면에 표시하는 함수
 async function fetchAndDisplayPosts(){
    try{
      //서버에서 기존 게시글 데이터 불러옴
      const response = await fetch("/getPosts");
      const data = await response.json();
      console.log(data);
      //화면에 게시글을 표시
      displayPosts(data.reverse());

    }catch (error){
      console.error('게시글 불러오기 중 오류 발생');
    }
  }

  
  // 게시글을 HTML 문자열로 변환하여 화면에 표시하는 함수
  function displayPosts(postsData){
    console.log(postsData);
    const threadContainer = document.getElementById('thread-container');
    threadContainer.innerHTML='';

    const limitedPosts = postsData.slice(0, 6);
    console.log(limitedPosts);
    limitedPosts.forEach((postInfo,index)=>{
      const postDate = new Date(postInfo.date);
      const postElement = document.createElement('div');
      postElement.classList.add('post-box');
      postElement.innerHTML=`
      <p><strong>게시일:</strong> ${postDate.toLocaleDateString()}</p>
      <p><strong>가격:</strong> ${postInfo.price}</p>
      <p><strong>내용:</strong> ${postInfo.text}</p>
      `;
      //클릭 이벤트 리스너 추가
      postElement.onclick= function(){
        openModalWithPost(postInfo);
      };

      threadContainer.appendChild(postElement);
    })
   
  }
  //페이지 로드시 자동으로 게시글을 불러와서 표시
  window.onload = fetchAndDisplayPosts;



  //게시글을 저장하고 화면을 갱신하는 함수
  async function savePost(){

    const postDate= document.getElementById('date');
    const postPrice= document.getElementById('price');
    const postContent= document.getElementById('post-content');

    if(postDate && postPrice && postContent){
      const postInfo ={
        postDate: postDate.value,
        postPrice: postPrice.value,
        postContent: postContent.value
      };
      try{
        //서버에 post요청으로 데이터 전송(db저장을 위해)
        console.log(postInfo);
        const response = await fetch('/savePost',{
          
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postInfo)
        });

        if (response.ok) {
          console.log('게시물이 성공적으로 저장되었습니다.');
          //서버에 저장된 게시글 데이터를 다시 가져와서 화면 갱신
          closePostModal();
          await fetchAndDisplayPosts();
          // closePostModal();
          // displayPosts();
        } else {
            const errorData = await response.json();
            alert(errorData.error);
        }
      } catch (error) {
        console.error('게시물 저장 중 오류 발생:', error);
      }
    }else {
        console.error('요소를 찾을 수 없거나 값이 비어 있습니다.');
    }
  }

  //게시글 입력 창 열기
  function openPostModal() {
      let modal = document.getElementById('post-modal');
      modal.style.display = 'block';
      // 새로운 글을 작성할 때 이전 내용 초기화
      document.getElementById('post-content').value = '';
  }

  //게시글 입력 창 끄기
  function closePostModal() {
      // 모달 창의 HTML 엘리먼트를 가져옵니다.
      let modal = document.getElementById('post-modal');

      // 모달 창을 숨기도록 스타일을 변경합니다.
      modal.style.display = 'none';
  }



  

  // 게시글 창 열기 함수
  function openModalWithPost(postInfo) {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const postDate = new Date(postInfo.date);
      console.log('클릭한 게시글의 정보:', postInfo);
      modalContent.innerHTML = `
      
        <table border = "1" id="myTable" class="table" style="overflow: auto;">
          <tr class="price">
          <td style="width: 50px;">날짜</td>
          <td>${postDate.toLocaleDateString()}</td>
          </tr>
          <tr class="price">
          <td style="width: 50px;">금액</td>
          <td>${postInfo.price}</td>
          </tr>
          <tr>
          <td style="width: 50px; height: 280px">내용</td>
          <td>${postInfo.text}</td>
          </tr>
        </table>
        `;

      // 댓글 관련 영역
      modalContent.innerHTML += `
          <div id="comments-section">
            <h3>댓글</h3>
            <textarea id="comment-input" placeholder="댓글을 입력하세요..."></textarea>
            <button onclick="postComment(${postInfo.post_id})">댓글 작성</button>
            <div id="comments-container"></div>
          </div>
        `;
    // 모달을 보이게 합니다.
    modal.style.display = 'block';

    // 추가: 모달 외부를 클릭하면 모달이 닫히도록 설정
    window.onclick = function(event) {
        const modal = document.getElementById('myModal'); // 모달의 ID를 'myModal'로 수정
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
  }


 // 댓글을 서버로 전송하고 페이지에 추가하는 함수
 async function postComment(postId) {
     const commentContent = document.getElementById('comment-input').value;

     console.log("댓글 프론트에서 확인 ", postId);

     if (commentContent.trim() === '') {
         alert('댓글 내용을 입력하세요.');
         return;
     }

     try {
         const response = await fetch('/saveComment', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ postId, commentContent })
         });

         if (response.ok) {
             // 페이지에 댓글 추가

             const commentsContainer = document.getElementById('comments-container');
             commentsContainer.innerHTML += `<p>${commentContent}</p>`;
             document.getElementById('comment-input').value = ''; // 입력 필드 초기화
         } else {
             const errorData = await response.json();
             alert(errorData.error);
         }
     } catch (error) {
         console.error('댓글 저장 중 오류 발생:', error);
     }
 }

  
  