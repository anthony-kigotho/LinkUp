const loginForm = document.querySelector('#login-form')

let user = {}

const getUserDetails = () => {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    user = {
        username: username,
        password: password
    }
    
}

loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault()
    getUserDetails()
    try {

        const res = await fetch('http://localhost:4500/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'


            },
            body: JSON.stringify(user)
        })

        const data = await res.json()

        if(data.error) {
            let alertContainer = document.querySelector('.alert')
            let alert = `
            <div class="alert alert-danger" role="alert">
                ${data.error}
            </div>
            `;

            alertContainer.innerHTML = alert

            setTimeout(()=>{
                alertContainer.innerHTML = ''
            }, 2000)
        } else {
            let user = {
                user_id: data.user.user_id,
                user_image: data.user.user_image,
                display_name: data.user.display_name,
                username: data.user.username,
                email: data.user.email,
                bio: data.user.bio,
                created_at: data.user.created_at
            }
            // Save the token and user data locally
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(user));

            window.location.href = '../home/index.html';
        }

        
          
        
    } catch (error) {
        console.log(error)
        
    }
})