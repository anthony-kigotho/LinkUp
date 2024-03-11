let usersBtn = document.querySelector('#users-link')
let rightSidebar = document.querySelector('#right-sidebar')
let feedContainer = document.querySelector('#feed-container-body')

usersBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    feedContainer.style.display = "none"
    rightSidebar.style.display = "block"
    rightSidebar.style.width = "100vw"
    rightSidebar.style.marginTop = "20px"
})


// TODO: POST
let postImageURL = '';

//TODO: Preview post image
window.onload = function() {
    let filesInput = document.getElementById("post-img");
    let output = document.getElementById("img-output");
    let clearPostImage = document.querySelector('#clear-post-image')
    
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
        filesInput.addEventListener("change", function(event) {
            
            let files = event.target.files; // FileList object
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                // Only pics
                const imageMimePattern = /^image\/(jpeg|png|)$/i;
                if (file.type.match(imageMimePattern)) {
                    document.querySelector('#post-btn').style.display = 'none' //Hides the button till the image selected is posted to cloudinary
                    document.querySelector('#update-post').style.display = 'none' //Hides the button till the image selected is posted to cloudinary
                    
                    let picReader = new FileReader();
                    picReader.addEventListener("load", function(event) {
                        let picFile = event.target;
                        output.src = picFile.result
                        output.style.display = "block"
                        clearPostImage.style.display = "block"
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
                        postImageURL = res.url
                        if(document.querySelector('#postModalLabel').innerText == "Update Post") {
                            document.querySelector('#update-post').style.display = 'block'                          
                        } else {
                            document.querySelector('#post-btn').style.display = 'block'
                        }
                    })

                } else {
                    console.log('Only images allowed');
                }
            }
        });
    } else {
        console.log("Your browser does not support File API");
    }

    clearPostImage.addEventListener('click', (e)=>{
        e.preventDefault()
        output.src = ''
        output.style.display = 'none';
        filesInput.value = '';
        clearPostImage.style.display = 'none';
        postImageURL = ''

    })

}

let postForm = document.querySelector("#post-form");

let post = {};

const getPostDetails = () => {
    const user_id = loggedUser.user_id
    const post_content = document.querySelector('#post-content').value
    const post_image = postImageURL


    post = {
        user_id: user_id,
        post_content: post_content,
        post_image: post_image
    }
    
}


postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    getPostDetails();
    try {

        const res = await fetch('http://localhost:4500/user/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`

            },
            body: JSON.stringify(post)
        })

        const data = await res.json()


        // let alerts = document.querySelector('.alerts')

        // let html = `<h3 > ${data?.message??'something went wrong'}</h3>`
        // alerts.innerHTML = html;
          
        
    } catch (error) {
        console.log(error)     
    }
    location.reload();
});



// TODO: GET PEOPLE TO FOLLOW
window.addEventListener('load', async () => {
    await fetchPeopleToFollow()
});


let followContainer = document.querySelector('#follow-container')

const fetchPeopleToFollow = async () => {
    try {
        const  res = await fetch(`http://localhost:4500/user/users-to-follow/${loggedUser.user_id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json()
        const users = await data.users

        let html = ``

        users.map((user)=>{
            html += `
            <div class="d-flex flex-row justify-content-between align-items-center-lg mt-3 follow-user" id="${user.user_id}">
                <a href="../user/index.html?id=${user.user_id}" style="text-decoration: none">
                    <img style="width: 40px; height: 40px; border-radius: 50%;" src="${user.user_image}" alt="">
                </a>
                <div class="d-flex flex-column">
                    <p class="fw-bold m-0">${user.display_name}</p>
                    <p class="m-0">@${user.username}</p>
                </div>
                <button class="btn btn-red" id="follow">Follow</button>
            </div>
            `
        })

        followContainer.innerHTML = html

    } catch (error) {
        console.log(error)
    }

}

// TODO: SEARCH USERS
let search = document.querySelector('#search')

search.addEventListener('input', async () => {
    const searchTerm = search.value;
    if(searchTerm == '') {
        return await fetchPeopleToFollow();
    }

    try {
        const response = await fetch(`http://localhost:4500/user/${searchTerm}`);
        const data = await response.json();

        const users = await data.users

        let html = ``

        users.map((user)=>{
            html += `
            <div class="d-flex flex-row justify-content-between align-items-center-lg mt-3" id="${user.user_id}">
                <a href="../user/index.html?id=${user.user_id}" style="text-decoration: none">
                    <img style="width: 40px; height: 40px; border-radius: 50%;" src="${user.user_image}" alt="">
                </a>
                <div class="d-flex flex-column">
                    <p class="fw-bold m-0">${user.display_name}</p>
                    <p class="m-0">@${user.username}</p>
                </div>
                <button class="btn btn-red" id="follow">Follow</button>
            </div>
            `
        })

        followContainer.innerHTML = html

        followListener()
      
    } catch (error) {
      console.error(error);
    }
});

//  TODO: SHOW MORE USERS
let showMoreBtn = document.querySelector('#show-more')

showMoreBtn.addEventListener('click', async()=> {
    let followUsers = followContainer.querySelectorAll(".follow-user");
    let lastFollowUser = followUsers[followUsers.length - 1];
    let lastFollowUserID = lastFollowUser.id
    
    try {
        const response = await fetch(`http://localhost:4500/user/show-more-users/${loggedUser.user_id}/${lastFollowUserID}`);
        const data = await response.json();

        const users = await data.users


        let html = followContainer.innerHTML

        users.map((user)=>{
            html += `
            <div class="d-flex flex-row justify-content-between align-items-center-lg mt-3 follow-user" id="${user.user_id}">
                <a href="../user/index.html?id=${user.user_id}" style="text-decoration: none">
                    <img style="width: 40px; height: 40px; border-radius: 50%;" src="${user.user_image}" alt="">
                </a>
                <div class="d-flex flex-column">
                    <p class="fw-bold m-0">${user.display_name}</p>
                    <p class="m-0">@${user.username}</p>
                </div>
                <button class="btn btn-red" id="follow">Follow</button>
            </div>
            `
        })

        followContainer.innerHTML = html

        followListener()

    } catch (error) {
      console.error(error);
    }
})


// TODO: FOLLOW/UNFOLLOW USER
setTimeout(() => {
    followListener()
}, 3000);

const followListener = ()=> {
    let followBtns = document.querySelectorAll('#follow')

    followBtns.forEach(btn =>{
        btn.addEventListener('click', async(e)=>{
            const follower = {
                follower_user_id: loggedUser.user_id
            }

            const followingID = e.target.parentElement.id || e.target.parentElement.parentElement.parentElement.parentElement.id

            console.log(followingID);

            try {

                const res = await fetch(`http://localhost:4500/user/follow/${followingID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'       
        
                    },
                    body: JSON.stringify(follower)
                })
        
                const data = await res.json()
        
        
                // let alerts = document.querySelector('.alerts')
        
                // let html = `<h3 > ${data?.message??'something went wrong'}</h3>`
                // alerts.innerHTML = html;
                  
                
            } catch (error) {
                console.log(error)     
            }
            location.reload();
        })
    })
}



// TODO: Like post
setTimeout(()=>{
    let likePostBtns = document.querySelectorAll('#like-post')

    likePostBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();

            const user_id = loggedUser.user_id
            const post_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id


            postLike = {
                user_id: user_id
            }
            
            try {

                const res = await fetch(`http://localhost:4500/user/post/like/${post_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify(postLike)
                })
        
                const data = await res.json()

                
            } catch (error) {
                console.log(error)     
            }
            location.reload()

        })
    })
}, 3000)

// TODO: Like main comment
setTimeout(()=>{
    let likeMainCommentsBtns = document.querySelectorAll('#like-main-comment')

    likeMainCommentsBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();

            const user_id = loggedUser.user_id
            const main_comment_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id


            mainCommentLike = {
                user_id: user_id
            }
            
            try {

                const res = await fetch(`http://localhost:4500/user/comment/like/${main_comment_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify(mainCommentLike)
                })
        
                const data = await res.json()

                
            } catch (error) {
                console.log(error)     
            }
            location.reload()

        })
    })
}, 3000)

// TODO: Like sub comment
setTimeout(()=>{
    let likeSubCommentsBtns = document.querySelectorAll('#like-sub-comment')

    likeSubCommentsBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();

            const user_id = loggedUser.user_id
            const sub_comment_id = e.target.parentElement.parentElement.parentElement.parentElement.id

            mainCommentLike = {
                user_id: user_id
            }
            
            try {

                const res = await fetch(`http://localhost:4500/user/comment/like/${sub_comment_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify(mainCommentLike)
                })
        
                const data = await res.json()

                
            } catch (error) {
                console.log(error)     
            }
            location.reload()

        })
    })
}, 3000)



// TODO: DELETE POST
setTimeout(()=>{
    let deletePostsBtns = document.querySelectorAll('#delete-post')

    deletePostsBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();

            const post_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id

            
            try {

                const res = await fetch(`http://localhost:4500/user/post/delete/${post_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        
                const data = await res.json()

                
            } catch (error) {
                console.log(error)     
            }
            location.reload()

        })
    })
}, 3000)


// TODO: Add comments
setTimeout(()=>{
    // TODO: Add main comment
    const addMainComment = document.querySelectorAll('#add-main-comment')
    const mainCommentInput = document.querySelectorAll('#main-comment-input')

    addMainComment.forEach((btn, i) => {
        btn.addEventListener('click', async(e) => {
            e.preventDefault();

            const user_id = loggedUser.user_id
            const post_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id
            const comment_content = mainCommentInput[i].value


            comment = {
                user_id: user_id,
                post_id: post_id,
                comment_content: comment_content
            }
            
            try {

                const res = await fetch('http://localhost:4500/user/post/comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
        
        
                    },
                    body: JSON.stringify(comment)
                })
        
                const data = await res.json()
                
            } catch (error) {
                console.log(error)     
            }
            location.reload();
        })
    })

    // TODO: Add sub-comments
    const addSubComment = document.querySelectorAll('#add-sub-comment')
    const subCommentInput = document.querySelectorAll('#sub-comment-input')
    const mainCommentItem = document.querySelectorAll('.main-comment-item')

    addSubComment.forEach((btn, i) => {
        btn.addEventListener('click', async(e) => {
            e.preventDefault();

            const user_id = loggedUser.user_id
            const post_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id
            const comment_content = subCommentInput[i].value
            const parent_comment_id = mainCommentItem[i].id


            comment = {
                user_id: user_id,
                post_id: post_id,
                comment_content: comment_content,
                parent_comment_id: parent_comment_id
            }
            
            try {

                const res = await fetch('http://localhost:4500/user/post/comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
        
        
                    },
                    body: JSON.stringify(comment)
                })
        
                const data = await res.json()
                
            } catch (error) {
                console.log(error)
                
            }

            location.reload();
        })
    })

}, 3000)


// TODO: DELETE MAIN COMMENT
setTimeout(()=>{
    let deleteMainCommentBtns = document.querySelectorAll('#delete-main-comment')

    deleteMainCommentBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();

            const main_comment_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id

            
            try {

                const res = await fetch(`http://localhost:4500/user/comment/delete/${main_comment_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        
                const data = await res.json()

                
            } catch (error) {
                console.log(error)     
            }
            location.reload()

        })
    })
}, 3000)

// TODO: DELETE SUB COMMENT
setTimeout(()=>{
    let deleteSubCommentsBtns = document.querySelectorAll('#delete-sub-comment')

    deleteSubCommentsBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();

            const sub_comment_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id

          
            try {

                const res = await fetch(`http://localhost:4500/user/comment/delete/${sub_comment_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        
                const data = await res.json()

                
            } catch (error) {
                console.log(error)     
            }
            location.reload()

        })
    })
}, 3000)


// TODO: EDIT POSTS
setTimeout(() => {
    let editPostsBtns = document.querySelectorAll('#edit-post')
    let postsContent = document.querySelectorAll('#post-text')

    editPostsBtns.forEach((btn, i) =>{
        btn.addEventListener('click', (e)=>{
            const post_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;

            document.querySelector('#postModalLabel').innerHTML = "Update Post"
            document.querySelector('#post-btn').style.display = 'none'
            let updatePostBtn = document.querySelector('#update-post')
            updatePostBtn.style.display = 'block'

            let post_content = postsContent[i];
            let post_image = post_content.parentElement.querySelector('#post-image')


            document.querySelector('#post-content').innerText = post_content.innerText

            if(post_image){
                document.querySelector('#img-output').src = post_image.src
                document.querySelector('#img-output').style.display = 'block'
                document.querySelector('#clear-post-image').style.display = 'block'
            } else {
                document.querySelector('#img-output').src = ''               
            }

            updatePostBtn.addEventListener('click', async(e)=>{
                e.preventDefault();
                const post_content = document.querySelector('#post-content').value
                const post_image = postImageURL || document.querySelector('#img-output').src


                post = {
                    post_content: post_content,
                    post_image: post_image
                }

                console.log(post_id);

                try {
                    const res = await fetch(`http://localhost:4500/user/post/update/${post_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: JSON.stringify(post)
                    })
            
                    const data = await res.json()
            
                      
                    
                } catch (error) {
                    console.log(error)       
                }
                location.reload()
            })
        })
    })
}, 3000);

// TODO: EDIT MAIN COMMENT
setTimeout(()=>{
    let editMainCommentBtns = document.querySelectorAll('#edit-main-comment')

    editMainCommentBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();
            let updateMainCommentBtn = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('#update-main-comment')

            // display update button and hide comment btn
            updateMainCommentBtn.style.display = 'block'
            e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('#add-main-comment').style.display = 'none'


            const main_comment_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id

            const main_comment_content = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('#main-comment-content')
            
            let mainCommentInput = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('#main-comment-input')
            mainCommentInput.value = main_comment_content.innerText;

            
            updateMainCommentBtn.addEventListener('click', async(e)=>{
                e.preventDefault()
                let comment_content = mainCommentInput.value

                let comment = {
                    comment_content: comment_content
                }

                try {
                    const res = await fetch(`http://localhost:4500/user/post/comment/update/${main_comment_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: JSON.stringify(comment)
                    })
            
                    const data = await res.json()
            
                      
                    
                } catch (error) {
                    console.log(error)       
                }
                location.reload()
            })


        })
    })
}, 3000)


// TODO: EDIT SUB COMMENT
setTimeout(()=>{
    let editSubCommentBtns = document.querySelectorAll('#edit-sub-comment')

    editSubCommentBtns.forEach((btn)=>{
        btn.addEventListener('click', async(e)=>{
            e.preventDefault();
            let updateSubCommentBtn = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('#update-sub-comment')

            // display update button and hide comment btn
            updateSubCommentBtn.style.display = 'block'
            e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('#add-sub-comment').style.display = 'none'


            const sub_comment_id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id

            const sub_comment_content = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('#sub-comment-content')
            
            let subCommentInput = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('#sub-comment-input')
            subCommentInput.value = sub_comment_content.innerText;

            
            updateSubCommentBtn.addEventListener('click', async(e)=>{
                e.preventDefault()
                let comment_content = subCommentInput.value

                let comment = {
                    comment_content: comment_content
                }

                try {
                    const res = await fetch(`http://localhost:4500/user/post/comment/update/${sub_comment_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: JSON.stringify(comment)
                    })
            
                    const data = await res.json()
            
                      
                    
                } catch (error) {
                    console.log(error)       
                }
                location.reload()
            })


        })
    })
}, 3000)


function formatTimestamp(timestampStr) {
    // Convert the timestamp string to a Date object
    const timestamp = new Date(timestampStr);

    // Get the current time in Nairobi, Kenya's time zone (EAT - East Africa Time, UTC+3)
    const currentTime = new Date();
    currentTime.setUTCHours(currentTime.getUTCHours() + 3);

    // Calculate the time difference in milliseconds
    const timeDifferenceInMilliseconds = currentTime - timestamp;

    // Calculate seconds, minutes, and hours
    const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }
}


// TODO: Logout
let logoutBtns = document.querySelectorAll('#logout')

logoutBtns.forEach(logoutBtn =>{
    logoutBtn.addEventListener('click', (e)=>{
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        location.reload()
    })

})