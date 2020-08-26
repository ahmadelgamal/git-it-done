var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
  //format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url. Notice `.then` and `.catch` getting chained to the `fetch` method
  fetch(apiUrl)
    .then(function (response) {
      // If fetch request was successful (returns value in the 200s)
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
        // If fetch request was unsuccessful (returns value in the 400s)
      } else {
        alert("Error: " + response.statusText);
      }
    })
    // If fetch request was unsuccessful (for a reason other than a value in the 400s, i.e. network errors, usually it's a value in the 500s)
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var formSubmitHandler = function (event) {
  // prevents the browser from performing the default action of the event, which in this case is send the form's input data to a URL
  event.preventDefault();
  // get value from input element
  var username = nameInputEl.value.trim(); // the `.trim` removes any accidental leading or trailing `space` from the input.

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

// Event listener for submit button
userFormEl.addEventListener("submit", formSubmitHandler);

var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  console.log(repos);
  console.log(searchTerm);

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};
