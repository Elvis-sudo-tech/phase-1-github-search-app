document.addEventListener("DOMContentLoaded", () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    // Listen for the form submission
    githubForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const searchQuery = searchInput.value.trim();
      
      if (searchQuery) {
        // Clear previous results
        userList.innerHTML = '';
        reposList.innerHTML = '';
        
        // Fetch user data from GitHub
        fetch(`https://api.github.com/search/users?q=${searchQuery}`)
          .then(response => response.json())
          .then(data => {
            if (data.items && data.items.length > 0) {
              // Display the list of users
              data.items.forEach(user => {
                const userItem = document.createElement('li');
                const userLink = document.createElement('a');
                userLink.href = user.html_url;
                userLink.target = '_blank';
                userLink.textContent = user.login;
                userItem.appendChild(userLink);
                userList.appendChild(userItem);
              });
  
              // Optionally, fetch and display the repositories of the first user
              const firstUser = data.items[0];
              fetch(firstUser.repos_url)
                .then(response => response.json())
                .then(repos => {
                  if (repos && repos.length > 0) {
                    repos.forEach(repo => {
                      const repoItem = document.createElement('li');
                      const repoLink = document.createElement('a');
                      repoLink.href = repo.html_url;
                      repoLink.target = '_blank';
                      repoLink.textContent = repo.name;
                      repoItem.appendChild(repoLink);
                      reposList.appendChild(repoItem);
                    });
                  } else {
                    reposList.innerHTML = '<li>No repositories found.</li>';
                  }
                })
                .catch(error => {
                  reposList.innerHTML = '<li>Error fetching repositories.</li>';
                  console.error('Error fetching repos:', error);
                });
            } else {
              userList.innerHTML = '<li>No users found.</li>';
            }
          })
          .catch(error => {
            userList.innerHTML = '<li>Error fetching users.</li>';
            console.error('Error fetching users:', error);
          });
      }
    });
  });
  