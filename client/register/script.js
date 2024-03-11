let regForm = document.querySelector("#reg-form");

let user = {

};



regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const displayName = document.querySelector('#display-name').value
    const username = document.querySelector('#username').value
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    const confirmPassword = document.querySelector('#confirm-password').value
    
    if (password !== confirmPassword) {
        let alertContainer = document.querySelector('.alert')
            let alert = `
            <div class="alert alert-danger" role="alert">
                Password don't match
            </div>
            `;

            alertContainer.innerHTML = alert

            setTimeout(()=>{
                alertContainer.innerHTML = ''
            }, 2000)

    }else{

        user = {
            display_name: displayName,
            username: username,
            email: email,
            password: password
        }
        
        try {
    
            const res = await fetch('http://localhost:4500/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
    
    
                },
                body: JSON.stringify(user)
            })
    
            const data = await res.json()
    
            let alertContainer = document.querySelector('.alert')
    
            if(data.error) {
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
                let alert = `
                <div class="alert alert-success" role="alert">
                    ${data.message}
                </div>
                `;
    
                alertContainer.innerHTML = alert
    
                setTimeout(()=>{
                    window.location.href = '../login/index.html';
                }, 2000)
            }
              
            
        } catch (error) {
            console.log(error)
            
        }
    }



});






