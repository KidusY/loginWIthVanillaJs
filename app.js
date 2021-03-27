
const emailValidation = (email) => {

    let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (email === '' || !email) return { error: true, errorMessage: "Please Enter Email" }

    else if (!emailFormat.test(String(email).toLowerCase())) return { error: true, errorMessage: "Please Enter a Valid Email" }

    else return { error: false, errorMessage: '' }
}
const passwordValidation = (password) => {

    if (password === '' || !password) return { error: true, errorMessage: "Please Enter password" }

    else return { error: false, errorMessage: '' }
}
const nameValidation = (name) => {


    if (name === '' || !name) return { error: true, errorMessage: "Please Enter Your Name" }

    else return { error: false, errorMessage: '' }
}

//logs in the an existing user 
const login = (e) => {
    e.preventDefault();
    document.querySelector('.emailError').innerHTML = ''
    document.querySelector('.passwordError').innerHTML = ''
    const { email, password } = e.target;

    if (emailValidation(email.value).error) {
        document.querySelector('.emailError').innerHTML = emailValidation(email.value).errorMessage;
        return;
    }
    if (passwordValidation(password.value).error) {
        document.querySelector('.passwordError').innerHTML = passwordValidation(password.value).errorMessage;
        return;
    }


    $('.loginBtn').hide();
    $('.spinner-border').show();


    //hits the end point for auth
    axios.post('https://phelbbackend.herokuapp.com/login', { email: email.value, password: password.value })
        .then((res) => {
            $('.loginBtn').show();
            $('.spinner-border').hide();


            if (res.data) {
                window.sessionStorage.setItem('token', res.data.token)
                window.sessionStorage.setItem('name', res.data.name)
                window.sessionStorage.setItem('email', res.data.email)
                window.location.href = "welcomedashboard.html"
            }


        })
        .catch(err => {
            $('.loginBtn').show();
            $('.spinner-border').hide();
            document.querySelector('#loginError').innerHTML = err.response.data.errorMessage

        })

}

//sign up for new users
const signup = (e) => {
    e.preventDefault();
    document.querySelector('.signupError').innerHTML = ''
    document.querySelector('.signUPNameError').innerHTML = ''
    document.querySelector('.signUPEmailError').innerHTML = ''
    document.querySelector('.signUPPasswordError').innerHTML = ''
    const { name, email, password } = e.target

    if (nameValidation(name.value).error) {
        document.querySelector('.signUPNameError').innerHTML = nameValidation(name.value).errorMessage;
        return;
    }
    if (emailValidation(email.value).error) {

        document.querySelector('.signUPEmailError').innerHTML = emailValidation(email.value).errorMessage;
        return;
    }
    if (passwordValidation(password.value).error) {
        document.querySelector('.signUPPasswordError').innerHTML = passwordValidation(password.value).errorMessage;
        return;
    }



    //creates users by hitting the end point
    $('.signUpSpinner').show();
    $('.signUpBtn').hide();
    axios.post('https://phelbbackend.herokuapp.com/users', { name: name.value, email: email.value, password: password.value })
        .then((res) => {
            $('.signUpSpinner').hide();
            $('.signUpBtn').show();
            window.location.href = "index.html"
        })
        .catch(err => {
            $('.signUpSpinner').hide();
            $('.signUpBtn').show();
            document.querySelector('.signupError').innerHTML = err.response.data.errorMessage
        })
}






//if logged in, it will render the proper info on the dash 
if (window.sessionStorage.getItem('token')) {
    const dashboard = $('.dashboard');
    let html = $.parseHTML(

        `
        <div id="dash">
         <h1 class='text-center'>Welcome</h1>
      <h2 id="name" class='text-center'>${window.sessionStorage.getItem('name')} </h2>
      <h3 id="email" class='text-center'>${window.sessionStorage.getItem('email')} </h3>
      <button type="button" class="btn btn-danger position-relative top-50 start-50 translate-middle mt-5" id="logoutBtn">
       Log Out
      </button>
        </div>
       
    
    `
    )

    dashboard.append(html)
}
//protect the dash from unauthorized users
else {
    const dashboard = $('.dashboard');
    let html = $.parseHTML(
        `
         <h1 class="text-center">Unauthorized Access</h1> 
         `
    )

    dashboard.append(html)
}

//error handling when going from one page to another
if (document.querySelector('.login')) {

    document.querySelector('.login').addEventListener('submit', login);
    document.querySelector('.SignUpBtn').addEventListener('click', () => window.location.href = "signup.html");
}

//error handling when going from one page to another
if (document.querySelector('.signup')) {
    document.querySelector('.signup').addEventListener('submit', signup)
    document.querySelector('.backBtn').addEventListener('click', ()=>window.location.href= "index.html")
}









///logout
const logout = () => {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('name');
    window.sessionStorage.removeItem('email');

    if (!window.sessionStorage.getItem('token')) {
        $('#dash').remove();
        window.location.href = "index.html"
    }
}

if (document.querySelector('#logoutBtn')) {
    document.querySelector('#logoutBtn').addEventListener('click', logout)
}
