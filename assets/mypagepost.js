    //페이지 로드시 자동으로 게시글을 불러와서 표시
    window.onload = fetchAndDisplayUserPosts;
  
  // 파일 선택 시 이미지 미리보기
  document.getElementById('fileInput').addEventListener('change', function () {
    const fileInput = this;
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.style.maxWidth = '100%';
            image.style.height = 'auto';
            imagePreview.appendChild(image);
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
});
 
 
 //게시글을 불러와 화면에 표시하는 함수
 async function fetchAndDisplayUserPosts(){

    try{
      //서버에서 기존 게시글 데이터 불러옴(마이페이지니까 사용자 아이디를받아서 같은 아이디를 가진 게시물 불러오기로 바꿔야함)
      const response = await fetch(`/getUserPosts`);
      const data = await response.json();
      if (data.error) {
        // 에러 메시지를 alert로 표시
        alert(data.error);
        window.location.href = '/';
        return;
      }
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
      // console.log(postInfo);
      const postDate = new Date(postInfo.date);
      const postElement = document.createElement('div');
      postElement.classList.add('post-box');
      postElement.innerHTML=`
      <p><strong>작성자:</strong> ${postInfo.nickname}</p>
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




  //게시글을 저장하고 화면을 갱신하는 함수
  async function savePost(){

    const postDate= document.getElementById('date');
    const postPrice= document.getElementById('price');
    const postContent= document.getElementById('post-content');
    const fileInput = document.getElementById('fileInput');
    
    if(postDate && postPrice && postContent){
      const postInfo ={

        postDate: postDate.value,
        postPrice: postPrice.value,
        postContent: postContent.value,
        
      };

       // FormData 객체 생성
      const formData = new FormData();
      formData.append('postDate', postDate.value);
      formData.append('postPrice', postPrice.value);
      formData.append('postContent', postContent.value);



      // 이미지 파일이 선택되었을 때만 FormData에 추가
      if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
      }

      console.log(formData.fileInput);
      try{
        //서버에 post요청으로 데이터 전송(db저장을 위해)
        console.log(postInfo);
        const response = await fetch('/savePost',{
          
          method:'POST',
          body:  formData,
        });

        // 여기서 서버 응답 처리
        const data = await response.json();

        if (data.message) {
          console.log(data.message);
          //서버에 저장된 게시글 데이터를 다시 가져와서 화면 갱신
          closePostModal();
          await fetchAndDisplayUserPosts();

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

   
      // 1. 미리보기 영역 초기화
      document.getElementById("imagePreview").innerHTML = "";
  
      // 2. 입력 필드 초기화
      document.getElementById('date').value = new Date().toISOString().substring(0, 10);;
      document.getElementById("price").value = "";
      document.getElementById("post-content").value = "";
      document.getElementById("fileInput").value = "";
    
  }

  //게시글 입력 창 열기
  function openPostModal() {
      let modal = document.getElementById('post-modal');
      modal.style.display = 'block';
      // 새로운 글을 작성할 때 이전 내용 초기화
      document.getElementById('post-content').value = '';

      //외부 누르면 창 꺼짐
      window.onclick = function(event) {
        const modal = document.getElementById('post-modal'); // 모달의 ID를 'myModal'로 수정
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
  }

  //게시글 입력 창 끄기
  function closePostModal() {
      // 모달 창의 HTML 엘리먼트를 가져옵니다.
      let modal = document.getElementById('post-modal');

      // 1. 미리보기 영역 초기화
      document.getElementById("imagePreview").innerHTML = "";
  
      // 2. 입력 필드 초기화
      document.getElementById('date').value = new Date().toISOString().substring(0, 10);;
      document.getElementById("price").value = "";
      document.getElementById("post-content").value = "";
      document.getElementById("fileInput").value = "";
    

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
      <td>${postInfo.nickname}</td>
      </tr>

      <tr class="price" >     
      <td>${postDate.toLocaleDateString()}</td>
      </tr>

      <tr class="price">
      <td>${postInfo.price}</td>
      </tr>

      <tr>
      <td>${postInfo.text}</td>
      </tr>
      <tr>
      <td>${postInfo.image_path ? `<img src="${postInfo.image_path}" alt="게시물 이미지" style="max-width: 50%; max-height: 40%;">` : ''}</td>
        </tr>
    </table>
    `;

    modal.style.display = 'block';

    // 추가: 모달 외부를 클릭하면 모달이 닫히도록 설정
    window.onclick = function(event) {
        const modal = document.getElementById('myModal'); // 모달의 ID를 'myModal'로 수정
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
  }
  
  