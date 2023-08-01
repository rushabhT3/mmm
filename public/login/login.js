async function login(event) {
  try {
    event.preventDefault();
    const loginDetails = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    const response = await axios.post(
      "http://localhost:3000/user/login",
      loginDetails
    );
    // alert(response.data.message);
    event.target.reset();
    localStorage.setItem("token", response.data.token);
    window.location.href = "../dailyExpense/dailyExpense.html";
  } catch (error) {
    console.log(JSON.stringify(error));
    document.body.innerHTML += `<div style="color:red">${error.message}</div>`;
    // window.location.href = "../signUp/signUp.html";
  }
}
