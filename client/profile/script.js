let token = localStorage.getItem('token')
let loggedUser = JSON.parse(localStorage.getItem('user'))

if(!token) {
    window.location.href = '../landing/index.html';
} else {
    // TODO: Populate user profile with the user currently logged in

    document.querySelector('#profile-image').src = loggedUser.user_image
    document.querySelector('#profile-display-name').innerText = loggedUser.display_name
    document.querySelector('#profile-username').innerText = loggedUser.username
    document.querySelector('#userbio').innerText = loggedUser.bio
    document.querySelector('#joined').innerText = formatDate(loggedUser.created_at)

    const fetchFollowingsCount = async () => {
        try {
            const  res = await fetch(`http://localhost:4500/user/followings/${loggedUser.user_id}`,{
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
            const  res = await fetch(`http://localhost:4500/user/followers/${loggedUser.user_id}`,{
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
        const  res = await fetch(`http://localhost:4500/user/posts/${loggedUser.user_id}`,{
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
                                                <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" data-cy="sub-ellipsis">
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
                                    ${loggedUser.user_id == comment.user_id ?
                                    `<div class="dropup">
                                        <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" data-cy="main-ellipsis">
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
                                        
                                        ${loggedUser.user_id == post.user_id ?
                                            `<div class="dropup">
                                                <a type="button" role="button" id="dropdownMenu" data-bs-toggle="dropdown" data-cy="post-ellipsis">
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
        const  res = await fetch(`http://localhost:4500/user/followings/${loggedUser.user_id}`,{
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
                    <a href="../user/index.html?id=${following.user_id}" style="text-decoration: none">
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
        const  response = await fetch(`http://localhost:4500/user/followers-you-dont-follow/${loggedUser.user_id}`,{
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
        const  res = await fetch(`http://localhost:4500/user/followers-you-follow/${loggedUser.user_id}`,{
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
                    <img style="width: 60px; height: 60px; border-radius: 50%;" src="${user.user_image}" alt="">
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




// TODO: UPDATE USER DETAILS
let profileImageURL = '';

// Populate the profile modal with logged in user details
document.querySelector('#user-image-output').src = loggedUser.user_image
document.querySelector('#display-name').value = loggedUser.display_name
document.querySelector('#email').value = loggedUser.email
document.querySelector('#user-bio').value = loggedUser.bio

// Preview profile image
window.addEventListener('load', async () => {
    
    let filesInput = document.getElementById("profile-img");
    let output = document.getElementById("user-image-output");
    let currentImage = output.src;
    let clearProfileImage = document.querySelector('#clear-profile-image')
    
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        filesInput.addEventListener("change", function(event) {
            
            let files = event.target.files; // FileList object
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                // Only pics
                const imageMimePattern = /^image\/(jpeg|png|)$/i;
                if (file.type.match(imageMimePattern)) {
                    document.querySelector('#save-btn').style.display = 'none' //Hides the button till the image selected is posted to cloudinary
                    
                    let picReader = new FileReader();
                    picReader.addEventListener("load", function(event) {
                        let picFile = event.target;
                        output.src = picFile.result
                        output.style.display = "block"
                        clearProfileImage.style.display = "block"
                    });
                    picReader.readAsDataURL(file);


                    // TODO : Post image to cloudinary
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("upload_preset", "shopie")
                    formData.append("cloud_name", "difoayyrr")

                    fetch('https://api.cloudinary.com/v1_1/difoayyrr/image/upload', {
                        method: "POST",
                        body: formData
                    }).then((res) => res.json()).then(res => {
                        profileImageURL = res.url
                        document.querySelector('#save-btn').style.display = 'block'
                    })
                    

                } else {
                    console.log('Only images allowed');
                }
            }
        });
    } else {
        console.log("Your browser does not support File API");
    }

    clearProfileImage.addEventListener('click', (e)=>{
        e.preventDefault()
        output.src = currentImage;
        filesInput.value = '';
        clearProfileImage.style.display = 'none'
        profileImageURL = ''
    })

});

let updateUserForm = document.querySelector("#update-user-form");
let userImage = document.getElementById("user-image-output")

updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();


    //TODO: Get user details
    const user_image = profileImageURL || loggedUser.user_image
    const display_name = document.querySelector('#display-name').value
    const email = document.querySelector('#email').value
    const user_bio = document.querySelector('#user-bio').value

    console.log(user_image);


    user = {
        user_image: user_image,
        display_name: display_name,
        email: email,
        bio: user_bio
    }

    try {

        const res = await fetch(`http://localhost:4500/user/update/${loggedUser.user_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const data = await res.json()

        if(!data.error) {
            let updatedUser = {
                user_id: loggedUser.user_id,
                user_image: user.user_image,
                display_name: user.display_name,
                username: loggedUser.username,
                email: user.email,
                bio: user.bio,
                created_at: loggedUser.created_at
            }
            // Save the updated user data locally
            localStorage.setItem('user', JSON.stringify(updatedUser))

            location.reload()
        }
          
        
    } catch (error) {
        console.log(error)       
    }
    

});


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

