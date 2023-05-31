async function onSignUp(event) {
  try {
    event.preventDefault();

    const signUpDetails = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    // console.log(signUpDetails);

    const response = await axios.post(
      "http://localhost:3000/user/signup",
      signUpDetails
    );
    event.target.reset();
    if (response.status === 201) {
      //window.location.href can also be used to change the URL of the current web page by assigning a new value to it.
      window.location.href = "../login/login.html";
    } else {
      throw new Error("failed to login");
    }
  } catch (error) {
    document.body.innerHTML += `<div style="color:red;">${error} <div>`;
  }
}
