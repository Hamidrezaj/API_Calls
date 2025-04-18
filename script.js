document.addEventListener('DOMContentLoaded', () => {
  // Select elements
  const fetchBtn = document.getElementById('fetchBtn');
  const xhrBtn = document.getElementById('xhrBtn');
  const output = document.getElementById('output');
  const postForm = document.getElementById('postForm');
  const updateForm = document.getElementById('updateForm');

  // Utility function for dynamic error display
  function displayError(message, type = 'generic') {
    let icon = '❌';
    let color = 'red';

    if (type === 'network') {
      icon = '📱';
      message = 'Network error: Please check your connection.';
    } else if (type === 'client') {
      icon = '⚠️';
      color = 'orange';
    } else if (type === 'server') {
      icon = '❌';
      message = 'Server error: Something went wrong on the server.';
    }

    output.innerHTML = `
    <p style="color:${color}; font-weight:bold;">
      ${icon} ${message}
    </p>
  `;
  }

  // Fetch API GET
  fetchBtn.addEventListener('click', () => {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((res) => {
        if (!res.ok) {
          if (res.status >= 500)
            throw {
              type: 'server',
              message: `Error ${res.status}: Server error.`,
            };
          else
            throw {
              type: 'client',
              message: `Error ${res.status}: Client error.`,
            };
        }
        return res.json();
      })
      .then((data) => {
        output.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
      `;
      })
      .catch((err) => {
        if (err.type) {
          displayError(err.message, err.type);
        } else {
          displayError('Unexpected error occurred.', 'network');
        }
      });
  });

  // XHR GET
  xhrBtn.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        output.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
      `;
      } else {
        displayError(
          `Error ${xhr.status}: Failed to fetch data.`,
          xhr.status >= 500 ? 'server' : 'client'
        );
      }
    };
    xhr.onerror = () => {
      displayError('XHR request failed due to network error.', 'network');
    };
    xhr.send();
  });

  // POST Request
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const body = document.getElementById('postBody').value;

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status >= 500)
            throw {
              type: 'server',
              message: `Error ${res.status}: Server issue.`,
            };
          else
            throw {
              type: 'client',
              message: `Error ${res.status}: Invalid input.`,
            };
        }
        return res.json();
      })
      .then((data) => {
        output.innerHTML = `
        <h4>Post submitted successfully!</h4>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Body:</strong> ${data.body}</p>
      `;
      })
      .catch((err) => {
        if (err.type) displayError(err.message, err.type);
        else displayError('POST failed unexpectedly.', 'network');
      });
  });

  // PUT Request

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('updateId').value;
    const title = document.getElementById('updateTitle').value;
    const body = document.getElementById('updateBody').value;

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `https://jsonplaceholder.typicode.com/posts/${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        output.innerHTML = `
        <h4>Post updated successfully!</h4>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Body:</strong> ${data.body}</p>
      `;
      } else {
        displayError(
          `Error ${xhr.status}: Failed to update post.`,
          xhr.status >= 500 ? 'server' : 'client'
        );
      }
    };

    xhr.onerror = () => {
      displayError('PUT request failed due to network error.', 'network');
    };

    xhr.send(JSON.stringify({ title, body }));
  });
});
