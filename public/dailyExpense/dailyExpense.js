function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  const ispremiumuser = decodeToken.ispremiumuser;
  // console.log({ decodeToken, ispremiumuser });
  if (ispremiumuser) {
    showPremiumuserMessage();
    showLeaderboard();
    showDownloadBtn();
    // showPeriodicBtn();
  }
  let currentPage = 1;

  async function getExpenses(page) {
    const limit = document.querySelector("#limit").value;

    // ? Using {data} instead of response.data
    // ? limit is the items per page
    const { data } = await axios.get(
      `http://15.206.28.85:3000/dailyExpense?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(data);
    document.querySelector("#list").innerHTML = "";

    data.expenses.forEach((element) => {
      onScreenFunction(element);
    });

    document.querySelector("#limit").addEventListener("change", () => {
      getExpenses(currentPage);
    });
    document.querySelector("#currentPage").textContent = data.currentPage;
    document.querySelector("#prevPageBtn").disabled = data.currentPage === 1;
    document.querySelector("#nextPageBtn").disabled =
      data.currentPage === data.totalPages;
  }

  getExpenses(currentPage);

  document.querySelector("#prevPageBtn").addEventListener("click", () => {
    currentPage--;
    getExpenses(currentPage);
  });
  document.querySelector("#nextPageBtn").addEventListener("click", () => {
    currentPage++;
    getExpenses(currentPage);
  });
});

async function dailyExpense(event) {
  event.preventDefault();

  const obj = {
    amount: event.target.amount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };

  const token = localStorage.getItem("token");
  const response = await axios.post("http://15.206.28.85:3000/dailyExpense", obj, {
    headers: { Authorization: token },
  });
  event.target.reset();
  // console.log(response);
  onScreenFunction(response.data);
}

async function onScreenFunction(expense) {
  const token = localStorage.getItem("token");

  const ul2 = document.querySelector("#list");

  const li = document.createElement("li");
  li.innerHTML = `${expense.amount}  ${expense.description}  ${expense.category}`;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";

  const icon = document.createElement("span");
  icon.className = "fas fa-trash";
  icon.style.marginLeft = "5px";

  delBtn.appendChild(icon);

  delBtn.onclick = async () => {
    await axios.delete(`http://15.206.28.85:3000/deleteExpense/${expense.id}`, {
      headers: { Authorization: token },
    });
    ul2.removeChild(li);
  };

  li.appendChild(delBtn);
  ul2.appendChild(li);
}

function showPremiumuserMessage() {
  const button = document.getElementById("rzp-button1");

  const text = document.createTextNode("You are a premium user");

  const crownIcon = document.createElement("i");
  crownIcon.classList.add("fas", "fa-crown");
  crownIcon.style.marginLeft = "5px";

  button.innerHTML = ""; // Clear existing content.
  button.appendChild(text);
  button.appendChild(crownIcon);

  // Remove event listener
  button.onclick = null;
}

// !  leaderboard
function showLeaderboard() {
  const button = document.createElement("button");
  // button.type = "button";
  button.textContent = "Show Leaderboard";
  button.classList.add("nice-button");
  button.addEventListener("click", handleLeaderboardClick);

  const ldrBtn = document.getElementById("leaderboard");
  ldrBtn.appendChild(button);
}

async function handleLeaderboardClick() {
  try {
    const token = localStorage.getItem("token");
    const leaderBoardBEData = await axios.get(
      "http://15.206.28.85:3000/premium/showLeaderBoard",
      { headers: { Authorization: token } }
    );
    const leaderboardHtml = document.getElementById("leaderboard");

    // Check if the leaderboard list already exists
    const leaderboardList = document.getElementById("leaderboardList");
    if (leaderboardList) {
      leaderboardHtml.removeChild(leaderboardList);
    }

    // Create a new leaderboard list
    const newLeaderboardList = document.createElement("ul");
    newLeaderboardList.setAttribute("id", "leaderboardList");
    newLeaderboardList.innerHTML = "<h3>Leader Board</h3>";

    leaderBoardBEData.data.forEach((element, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("leaderboard-item"); // ? CSS modifications

      const name = document.createElement("span"); // ? CSS modifications
      name.classList.add("leaderboard-name"); // ? CSS modifications
      name.textContent = element.name;

      const totalExpense = document.createElement("span"); // ? CSS modifications
      totalExpense.classList.add("leaderboard-total-expense"); // ? CSS modifications
      totalExpense.textContent = `Total Expense: ${element.total_cost || 0}`;

      listItem.appendChild(name);
      listItem.appendChild(totalExpense);
      newLeaderboardList.appendChild(listItem);
    });

    leaderboardHtml.appendChild(newLeaderboardList);
  } catch (error) {
    console.log("Error fetching leaderboard data:", error);
  }
}

// ! Download
function showDownloadBtn() {
  const button = document.createElement("button");
  button.textContent = "Download Expense";
  button.classList.add("nice-button");
  button.addEventListener("click", handleDownloadClick);

  const downloadBtn = document.getElementById("downloadexpense");
  downloadBtn.appendChild(button);
}

async function handleDownloadClick() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://15.206.28.85:3000/download", {
      headers: { Authorization: token },
    });
    // console.log(response.data.fileURLs);
    if (response.status === 200) {
      //the BE is essentially sending a download link
      var a = document.createElement("a");
      a.href = response.data.fileURLs[response.data.fileURLs.length - 1];
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
    const downloadedFiles = document.getElementById("downloadedFiles");
    response.data.fileURLs.forEach((element, index) => {
      const listItem = document.createElement("li");

      const link = document.createElement("a");
      link.href = element;
      link.textContent = `Download Previous Link ${index + 1}`;
      listItem.appendChild(link);

      downloadedFiles.appendChild(listItem);
    });
  } catch (error) {
    console.log({ handledownloadFE: error });
  }
}

// ! Periodic table
// function showPeriodicBtn() {
//   const button = document.createElement("button");
//   button.textContent = "Show Periodic Analysis";
//   button.classList.add("nice-button");
//   button.addEventListener("click", handlePeriodicClick);

//   const periodicBtn = document.getElementById("periodic");
//   periodicBtn.appendChild(button);
// }

// async function handlePeriodicClick() {
//   const token = localStorage.getItem("token");
//   const response = await axios.get("", { headers: { Authorization: token } });

//   const periodicHtml = document.getElementById("periodic");

//   const table = document.getElementById("table");
//   if (table) {
//     periodicHtml.removeChild(table);
//   }

//   const newTable = document.createElement("table");
//   newTable.setAttribute("id", "table");
// }

document.getElementById("rzp-button1").onclick = async function (e) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://15.206.28.85:3000/purchase/premiummembership",
      { headers: { Authorization: token } }
    );
    console.log(response.data);
    var options = {
      key: response.data.key_id, // Enter the Key ID generated from the Dashboard
      order_id: response.data.order.id, // For one time payment
      description: "Laxmi chit fund",
      image:
        "https://getmemetemplates.com/wp-content/uploads/2020/01/20200114_112012-1-1226x584.jpg",
      prefill: {
        email: "gaurav.kumar@ekkadouble.com",
        contact: +919900000000,
      },
      config: {
        display: {
          blocks: {
            utib: {
              //name for Axis block
              name: "Pay using Axis Bank",
              instruments: [
                {
                  method: "card",
                  issuers: ["UTIB"],
                },
                {
                  method: "netbanking",
                  banks: ["UTIB"],
                },
              ],
            },
            other: {
              //  name for other block
              name: "Other Payment modes",
              instruments: [
                {
                  method: "card",
                  issuers: ["ICIC"],
                },
                {
                  method: "netbanking",
                },
              ],
            },
          },
          hide: [
            {
              method: "upi",
            },
          ],
          sequence: ["block.utib", "block.other"],
          preferences: {
            show_default_blocks: false, // Should Checkout show its default blocks?
          },
        },
      },
      handler: async function (response) {
        const res = await axios.post(
          "http://15.206.28.85:3000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a Premium User now! Congrats:)");
        // console.log({ responseData: res.data, token });
        localStorage.setItem("token", res.data.token);
        console.log(localStorage.getItem("token"));
        // showPremiumuserMessage();
        // showLeaderboard();
      },
      modal: {
        ondismiss: function () {
          if (confirm("Are you sure, you want to close the form?")) {
            txt = "You pressed OK!";
            console.log("Checkout form closed by the user");
          } else {
            txt = "You pressed Cancel!";
            console.log("Complete the Payment");
          }
        },
      },
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  } catch (error) {
    console.log("problem in the dailyExpenseJs");
  }
};
