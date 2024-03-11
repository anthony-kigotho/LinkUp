let token = localStorage.getItem('token')
let loggedUser = JSON.parse(localStorage.getItem('user'))

if(!token) {
    window.location.href = '../landing/index.html';
}

// TODO: Fetch posts
window.addEventListener('load', async () => {
    await renderPosts();
});


const renderPosts = async () => {
    try {
        const  res = await fetch(`http://localhost:4500/user/following/posts/${loggedUser.user_id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json()
        const posts = await data.posts


        let html = ``

        posts.map(async(post)=>{
            // TODO: Fetch main comments
            try {
                const  res = await fetch(`http://localhost:4500/user/post/main-comments/${post.post_id}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        
                const data = await res.json()
                const comments = await data.comments

                const mainCommentsCount = comments.length

                let subComment;

                let mainComment = ``;

                let com = ``;

                let subCommentsCount=0;
                        
                comments.map(async(comment)=>{
                    subComment = '';
                    // TODO: Fetch the sub-comments of each main-comment
                    try {
                        const  res = await fetch(`http://localhost:4500/user/post/sub-comments/${comment.comment_id}`,{
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        
                        const data = await res.json()
                        const subComments = await data.comments
                        
                        subCommentsCount = subComments.length
                        
                        
                        subComments.map((comment)=>{
                            subComment += `
                            <div class="sub-comment-item" id="${comment.comment_id}">
                                <div class="col-2 col-xl-1 p-0 mt-2">
                                    <img style="width: 50px; height: 50px; border-radius: 50%;" src="${comment.user_image}" alt="">
                                </div>
                                <div class="col p-1">
                                    <div class="d-flex flex-column">
                                        <div class="d-flex justify-content-between">
                                            <div class="d-flex gap-1">
                                                <p class="mb-0" style="color: #000; font-weight: 800;"> ${comment.display_name}</p>
                                                <p class="m-0"> @${comment.username} <i class="bi bi-dot"></i> ${formatTimestamp(comment.created_at)}</p>
                                            </div>
                                        </div>
                                        <div id="comment-body">
                                             <p class="m-0" id="sub-comment-content">${comment.comment_content}</p>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <a type="button" role="button" style="text-decoration: none;" id="like-sub-comment"><i class="bi bi-suit-heart"></i> ${comment.likes_count}</a>                                         
                                            
                                            ${loggedUser.user_id == comment.user_id ?
                                            `<div class="dropup">
                                                <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" >
                                                    <i class="bi bi-three-dots"></i>
                                                </a>
                                                <div class="dropdown-menu">
                                                    <button class="dropdown-item" type="button"><i class="bi bi-pencil-square"></i> Edit Comment</button>
                                                    <button class="dropdown-item" type="button" id="edit-sub-comment"><i class="bi bi-pencil-square"></i> Edit Comment</button>
                                                    <button class="dropdown-item" type="button" id="delete-sub-comment"><i class="bi bi-trash"></i> Delete Comment</button>
                                                </div>
                                            </div>`
        
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                        })
                           
                        
                    } catch (error) {
                        console.log(error)
                        
                    }
                    
                    mainComment = `
                    <div class="main-comment-item" id="${comment.comment_id}">
                        <div class="col-2 col-xl-1 p-0 mt-2">
                            <img style="width: 50px; height: 50px; border-radius: 50%;" src="${comment.user_image}" alt="">
                        </div>
                        <div class="col p-1">
                            <div class="d-flex flex-column">
                                <div class="d-flex justify-content-between">
                                    <div class="d-flex gap-1">
                                        <p class="mb-0" style="color: #000; font-weight: 800;"> ${comment.display_name}</p>
                                        <p class="m-0"> @${comment.username} <i class="bi bi-dot"></i> ${formatTimestamp(comment.created_at)}</p>
                                    </div>
                                </div>
                                <div id="comment-body">
                                    <p class="m-0" id="main-comment-content"> ${comment.comment_content} </p>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="d-flex gap-5">
                                        <a type="button" role="button" style="text-decoration: none;" id="sub-comment-btn"><i class="bi bi-chat"></i> ${subCommentsCount}</a>
                                        <a type="button" role="button" style="text-decoration: none;" id="like-main-comment"><i class="bi bi-suit-heart"></i> ${comment.likes_count}</a>
                                    </div>
                                    ${loggedUser.user_id == comment.user_id ?
                                    `<div class="dropup">
                                        <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" >
                                            <i class="bi bi-three-dots"></i>
                                        </a>
                                        <div class="dropdown-menu">
                                            <button class="dropdown-item" type="button" id="edit-main-comment"><i class="bi bi-pencil-square"></i> Edit Comment</button>
                                            <button class="dropdown-item" type="button" id="delete-main-comment"><i class="bi bi-trash"></i> Delete Comment</button>
                                        </div>
                                    </div>`

                                    : ''}
                                </div>
                            </div>
                        </div>

                    </div>
                    `;                                 
                     
                    com += `
                    <div>
                        <div class="container-fluid p-0 mt-3 ms-1 row" id="main-comment" style="display: none;">
        
                                ${mainComment}
    
                        </div>
    
                        <div class="container-fluid p-0 ms-3 mt-3 row" id="sub-comment" style="display: none;">
                            ${mainComment ?
                                `<div class="d-flex flex-column flex-sm-row justify-content-between">
                                    <textarea class="p-2" id="sub-comment-input" rows="1" style="width: 70%; border-radius: 30px;" placeholder="Add a comment"></textarea>
                                    <button class="btn-comment mt-2" id="add-sub-comment">Commment</button>
                                    <button class="btn-comment mt-2" id="update-sub-comment" style="display: none; background: green;">Update</button>
                                </div>` 
                                    : ''
                            }
                            
    
                            ${subComment}
                            
                        </div>
                    </div>
                    `;
                    subComment = ``
                })

                // Used timeout to give time for subComment to be generated
                setTimeout(function() {
                    html += `
                        <div class="container-fluid p-0 mt-3 row" id=${post.post_id}>
                            <div class="col-2 col-xl-1 p-0">
                                    <img style="width: 60px; height: 60px; border-radius: 50%;" src="${post.user_image}" alt="">
                            </div>
                            <div class="col p-1">
                                <div class="d-flex flex-column">
                                    <div class="d-flex justify-content-between" id="${post.user_id}">
                                        <div class="d-flex gap-1">
                                            <p class="mb-0" style="color: #000; font-weight: 800;"> ${post.display_name}</p>
                                            <p class="m-0"> @${post.username} <i class="bi bi-dot"></i> ${formatTimestamp(post.created_at)}</p>
                                        </div>
                                        <a role="button" type="button" style="color: #FE1515; text-decoration: none; font-weight: 800;" id="follow">Following</a>
                                    </div>
                                    <div id="post-body">
                                        <p> ${post.post_content}</p>
                                        ${post.post_image ? 
                                        `<img style="width: 80%; height: 350px; border-radius: 5%; object-fit: cover;" src="${post.post_image}" alt="">`
                                        : ''
                                        }
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex gap-5">
                                            <a type="button" role="button" style="text-decoration: none;" id="main-comment-btn"><i class="bi bi-chat"></i> ${mainCommentsCount + subCommentsCount}</a>
                                            <a type="button" role="button" style="text-decoration: none;" id="like-post"><i class="bi bi-suit-heart"></i> ${post.likes_count}</a>
                                        </div>
                                        
                                        ${loggedUser.user_id == post.user_id ?
                                            `<div class="dropup">
                                                <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" >
                                                    <i class="bi bi-three-dots"></i>
                                                </a>
                                                <div class="dropdown-menu">
                                                    <button class="dropdown-item" type="button"><i class="bi bi-pencil-square"></i> Edit Post</button>
                                                    <button class="dropdown-item" type="button" id="delete-post"><i class="bi bi-trash"></i> Delete Post</button>
                                                </div>
                                            </div>`
        
                                            : ''}
                                        
                                    </div>
                                    <div class="mt-2" id="comment-section">
                                        <div class="d-flex flex-column flex-sm-row justify-content-between">
                                            <textarea class="p-2" id="main-comment-input" rows="1" style="width: 70%; border-radius: 30px;" placeholder="Add a comment"></textarea>
                                            <button class="btn-comment mt-2" id="add-main-comment">Commment</button>
                                            <button class="btn-comment mt-2" id="update-main-comment" style="display: none; background: green;">Update</button>
                                        </div>
                                        <div id="comment">
                                            ${com}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            </div>
                        `;


                    let feedContainer = document.querySelector('#feed-container-body')
                    feedContainer.innerHTML = html;

                    let subCommentBtns = document.querySelectorAll('#sub-comment-btn')
                    // let subComments = document.querySelectorAll('#sub-comment')
                    
                    let mainCommentBtns = document.querySelectorAll('#main-comment-btn')

                    
                    let mainComments = document.querySelectorAll('#main-comment')
                    let comments = document.querySelectorAll('#comment')

                    
                    mainCommentBtns.forEach((btn, i) => {
                        btn.addEventListener('click', (e) =>{
                            e.preventDefault();
                            let mainComments = comments[i].querySelectorAll('#main-comment')
                            let subComments = comments[i].querySelectorAll('#sub-comment')
                           

                            mainComments.forEach(mainComment =>{
                                if(mainComment) {
                                    if(mainComment.style.display == "none") {
                                        mainComment.style.display = "block"
                                    } else {
                                        mainComment.style.display = "none"
                                        
                                        subComments.forEach(subComment =>{
                                            if(subComment) {
                                                subComment.style.display = "none"
                                            }
                                        })
                                    }
                                }
                            })

                                                       
                        })
                    })
                    
                    subCommentBtns.forEach((btn, i) => {
                        btn.addEventListener('click', (e) =>{
                            e.preventDefault();
                            let subComment = mainComments[i].parentElement.querySelector('#sub-comment')
                            
                            if(subComment.style.display == "none") {
                                subComment.style.display = "block"
                            } else {
                                subComment.style.display = "none"
                            }
                        })
                    })
                }, 100);

                           
        
            } catch (error) {
                console.log(error)
            }
            
        })

    } catch (error) {
        console.log(error)
    }

}