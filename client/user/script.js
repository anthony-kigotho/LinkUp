let token = localStorage.getItem('token')

let loggedUser = JSON.parse(localStorage.getItem('user'))

// Get the current URL
let url = new URL(window.location.href);

// Get the value of the 'id' parameter
let userID = url.searchParams.get("id");



if(!token) {
    window.location.href = '../landing/index.html';
} else {
    // TODO: Populate user profile with the user currently logged in
    const populateUserProfile = async () =>{
        try {
            const  res = await fetch(`http://localhost:4500/user/get/${userID}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            const data = await res.json()
            const user = await data.user
    
            document.querySelector('#profile-image').src = user.user_image
            document.querySelector('#profile-display-name').innerText = user.display_name
            document.querySelector('#profile-username').innerText = user.username
            document.querySelector('#userbio').innerText = user.bio
            document.querySelector('#joined').innerText = formatDate(user.created_at)
    
            
        } catch (error) {
            console.log(error)
        }
    }
    populateUserProfile()


    const fetchFollowingsCount = async () => {
        try {
            const  res = await fetch(`http://localhost:4500/user/followings/${userID}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            const data = await res.json()
            const followings = await data.followings
    
            const count = followings.length
            document.querySelector('#followings-count').innerText = count

            
        } catch (error) {
            console.log(error)
        }
    
    }
    fetchFollowingsCount()

    const fetchFollowersCount = async () => {
        try {
            const  res = await fetch(`http://localhost:4500/user/followers/${userID}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            const data = await res.json()
            const followers = await data.followers
    
            const count = followers.length
            document.querySelector('#followers-count').innerText = count

            
        } catch (error) {
            console.log(error)
        }
    
    }
    fetchFollowersCount()

}

let posts = document.querySelector('#posts')
let followers = document.querySelector('#followers')
let following = document.querySelector('#followings')

let postsBtn = document.querySelector('#posts-btn')
let followingBtn = document.querySelector('#following-btn')
let followersBtn = document.querySelector('#followers-btn')



postsBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    postsBtn.style.color = "#FE1515"
    followingBtn.style.color = "#000"
    followersBtn.style.color = "#000"

    posts.style.display = "block"
    following.style.display = "none"
    followers.style.display = "none"
})

followingBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    followingBtn.style.color = "#FE1515"
    postsBtn.style.color = "#000"
    followersBtn.style.color = "#000"

    following.style.display = "block"
    posts.style.display = "none"
    followers.style.display = "none"
})

followersBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    followersBtn.style.color = "#FE1515"
    postsBtn.style.color = "#000"
    followingBtn.style.color = "#000"

    followers.style.display = "block"
    posts.style.display = "none"
    following.style.display = "none"
})


// TODO: Fetch posts
window.addEventListener('load', async () => {
    await renderPosts();
});


const renderPosts = async () => {
    try {
        const  res = await fetch(`http://localhost:4500/user/posts/${userID}`,{
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
                                            
                                            ${userID == loggedUser.user_id ?
                                            `<div class="dropup">
                                                <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" >
                                                    <i class="bi bi-three-dots"></i>
                                                </a>
                                                <div class="dropdown-menu">
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
                                    ${userID == loggedUser.user_id ?
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
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex gap-1">
                                            <p class="mb-0" style="color: #000; font-weight: 800;"> ${post.display_name}</p>
                                            <p class="m-0"> @${post.username} <i class="bi bi-dot"></i> ${formatTimestamp(post.created_at)}</p>
                                        </div>
                                    </div>
                                    <div id="post-body">
                                        <p id="post-text"> ${post.post_content}</p>
                                        ${post.post_image ? 
                                        `<img style="width: 80%; height: 350px; border-radius: 5%; object-fit: cover;" src="${post.post_image}" alt="" id="post-image">`
                                        : ''
                                        }
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex gap-5">
                                            <a type="button" role="button" style="text-decoration: none;" id="main-comment-btn"><i class="bi bi-chat"></i> ${mainCommentsCount + subCommentsCount}</a>
                                            <a type="button" role="button" style="text-decoration: none;" id="like-post"><i class="bi bi-suit-heart"></i> ${post.likes_count}</a>
                                        </div>
                                        
                                        ${userID == loggedUser.user_id ?
                                            `<div class="dropup">
                                                <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" >
                                                    <i class="bi bi-three-dots"></i>
                                                </a>
                                                <div class="dropdown-menu">
                                                    <button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#postModal" id="edit-post"><i class="bi bi-pencil-square"></i> Edit Post</button>
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


                    let postContainer = document.querySelector('#posts')
                    postContainer.innerHTML = html;

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


// TODO: Fetch following
window.addEventListener('load', async () => {
    await fetchFollowings();
});

const fetchFollowings = async () => {
    const followingsContainer = document.querySelector('#followings')
    try {
        const  res = await fetch(`http://localhost:4500/user/followings/${userID}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json()
        const followings = await data.followings

        let html = ``


        followings.map((following)=>{
            html += `
            <div class="container-fluid mt-3 row" id="${following.user_id}">
                <div class="col-2 col-xl-1 p-0">
                    <a href="./index.html?id=${following.user_id}" style="text-decoration: none">
                        <img style="width: 60px; height: 60px; border-radius: 50%;" src="${following.user_image}" alt="">
                    </a>
                </div>
                <div class="col px-3">
                    <div class="d-flex flex-column">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex gap-1">
                                <p class="mb-0" style="color: #000; font-weight: 800;"> ${following.display_name}</p>
                                <p class="m-0"> @${following.username} </p>
                            </div>
                            <a role="button" type="button" style="color: #FE1515; text-decoration: none; font-weight: 800;" id="follow" >Following</a>
                        </div>
                        <div id="bio">
                            <p>${following.bio}</p>
                        </div>
            
                    </div>
                </div>
            </div>
            `
        })

        followingsContainer.innerHTML = html

    } catch (error) {
        console.log(error)
    }

}

// TODO: Fetch followers
window.addEventListener('load', async () => {
    await fetchFollowers();
});

const fetchFollowers = async () => {
    const followersContainer = document.querySelector('#followers')
    let html = ``;

    try {
        const  response = await fetch(`http://localhost:4500/user/followers-you-dont-follow/${userID}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        const users = await data.followers

        if(users) {
            users.map((user)=>{
                html += `
                <div class="container-fluid mt-3 row" id="${user.user_id}">
                    <div class="col-2 col-xl-1 p-0">
                        <a href="./index.html?id=${user.user_id}" style="text-decoration: none">
                            <img style="width: 60px; height: 60px; border-radius: 50%;" src="${user.user_image}" alt="">
                        </a>
                    </div>
                    <div class="col px-3">
                        <div class="d-flex flex-column">
                            <div class="d-flex justify-content-between">
                                <div class="d-flex gap-1">
                                    <p class="mb-0" style="color: #000; font-weight: 800;"> ${user.display_name}</p>
                                    <p class="m-0"> @${user.username} </p>
                                </div>
                                <a type="button" style="color: #FE1515; text-decoration: none; font-weight: 800;" id="follow"> Follow Back</a>
                            </div>
                            <div id="bio">
                                <p>${user.bio??'no bio'}</p>
                            </div>
                
                        </div>
                    </div>
                </div>
                `
            })
        }


    } catch (error) {
        console.log(error)
    }

    try {
        const  res = await fetch(`http://localhost:4500/user/followers-you-follow/${userID}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const results = await res.json()
        const users = await results.followers

        users.map((user)=>{
            html += `
            <div class="container-fluid mt-3 row">
                <div class="col-2 col-xl-1 p-0">
                    <a href="../user/index.html?id=${user.user_id}" style="text-decoration: none">
                        <img style="width: 60px; height: 60px; border-radius: 50%;" src="${user.user_image}" alt="">
                    </a>
                </div>
                <div class="col px-3">
                    <div class="d-flex flex-column">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex gap-1">
                                <p class="mb-0" style="color: #000; font-weight: 800;"> ${user.display_name}</p>
                                <p class="m-0"> @${user.username} </p>
                            </div>
                            <a type="button" style="color: #FE1515; text-decoration: none; font-weight: 800;" id="follow"> Following</a>
                        </div>
                        <div id="bio">
                            <p>${user.bio??'no bio'}</p>
                        </div>
            
                    </div>
                </div>
            </div>
            `
        })
        
    } catch (error) {
        console.log(error)
    }

    followersContainer.innerHTML = html
}


function formatDate(inputDate) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateParts = new Date(inputDate).toISOString().split('T')[0].split('-');
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1]) - 1];
  const day = dateParts[2];

  return `Joined ${month} ${day} ${year}`;
}

