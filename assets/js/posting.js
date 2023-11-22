let modal = document.getElementById('post-modal');
let commentModal = document.getElementById('comment-modal');
let addButton = document.getElementById('add-post-button');
let postsContainer = document.getElementById('posts-container');
let currentPost = null;


function openPostModal() {
    modal.style.display = 'block';
    // 새로운 글을 작성할 때 이전 내용 초기화
    document.getElementById('post-content').value = '';
}

function closePostModal() {
    modal.style.display = 'none';
}

function openCommentModal(postElement) {
    currentPost = postElement;
    let postContent = postElement.getElementsByClassName('post-content')[0].textContent;
    document.getElementById('post-content-container').innerHTML = '<strong>게시글:</strong> ' + postContent;

    let commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    let existingComments = postElement.getElementsByClassName('comment');
    for (let i = 0; i < existingComments.length; i++) {
        let commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.textContent = existingComments[i].textContent;
        commentsContainer.appendChild(commentElement);
    }

    commentModal.style.display = 'block';
    // 댓글을 새로 작성할 때 이전 내용 초기화
    document.getElementById('comment-content').value = '';
}

function closeCommentModal() {
    commentModal.style.display = 'none';
}

function savePost() {
    let postContent = document.getElementById('post-content').value;

    if (postContent.trim() !== '') {
        let postElement = document.createElement('div');
        postElement.classList.add('post-box');
        postElement.onclick = function () {
            openCommentModal(postElement);
        };

        let postContentElement = document.createElement('div');
        postContentElement.classList.add('post-content');
        postContentElement.textContent = postContent;
        postElement.appendChild(postContentElement);

        let commentsContainer = document.createElement('div');
        commentsContainer.classList.add('comments-container');
        postElement.appendChild(commentsContainer);

        postsContainer.appendChild(postElement);

        // 저장 후 창 닫기
        closePostModal();
    } else {
        alert('포스트 내용을 입력하세요.');
    }
}

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
