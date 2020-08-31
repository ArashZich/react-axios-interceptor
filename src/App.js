import React, { useState } from "react";
import axios from "axios";

function App() {
  const [res, setRes] = useState({});

  // AXIOS GLOBALS
  axios.defaults.headers.common["X-Auth-Token"] =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // GET REQUEST
  const getTodos = () => {
    // axios({
    //   method: "get",
    //   url: "https://jsonplaceholder.typicode.com/todos",
    //   params: {
    //     _limit: 5, //set limit for get data
    //   },
    // })
    //   .then((res) => setRes(res))
    //   .catch((err) => console.log(err));

    //OR

    axios
      .get("https://jsonplaceholder.typicode.com/todos", {
        params: { _limit: 5 }, //set limit for get data}
        timeout: 5000,
      })
      .then((res) => setRes(res))
      .catch((err) => console.log(err));
  };

  // POST REQUEST
  const addTodo = () => {
    // axios({
    //   method: "post",
    //   url: "https://jsonplaceholder.typicode.com/todos",
    //   data: {
    //     title: "New Todo",
    //     completed: false,
    //   },
    // })
    //   .then((res) => setRes(res))
    //   .catch((err) => console.log(err));
    axios
      .post("https://jsonplaceholder.typicode.com/todos", {
        title: "New Todo",
        completed: false,
      })
      .then((res) => setRes(res))
      .catch((err) => console.log(err));
  };

  // PUT/PATCH REQUEST
  const updateTodo = () => {
    axios
      .put("https://jsonplaceholder.typicode.com/todos/1", {
        title: "Updated Todo",
        completed: true,
      })
      .then((res) => setRes(res))
      .catch((err) => console.log(err));

    //Patch not worked
    // axios
    //   .patch("https://jsonplaceholder.typicode.com/todos/1", {
    //     title: "Updated Todo",
    //     completed: true,
    //   })
    //   .then((res) => setRes(res))
    //   .catch((err) => console.log(err));
  };

  // DELETE REQUEST
  const removeTodo = () => {
    axios
      .delete("https://jsonplaceholder.typicode.com/todos/1")
      .then((res) => setRes(res))
      .catch((err) => console.log(err));
  };

  // for get all url data and set array
  // SIMULTANEOUS DATA
  const getData = () => {
    axios
      .all([
        axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
        axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
      ])
      .then(axios.spread((todos, posts) => setRes(posts)))
      // .then((res) => {
      //   console.log(res[0]);
      //   console.log(res[1]);
      //   setRes(res[1]);
      // })
      .catch((err) => console.log(err));
  };

  // CUSTOM HEADERS
  const customHeaders = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "sometoken",
      },
    };

    axios
      .post(
        "https://jsonplaceholder.typicode.com/todos",
        {
          title: "New Todo",
          completed: false,
        },
        config
      )
      .then((res) => setRes(res))
      .catch((err) => console.error(err));
  };

  // TRANSFORMING REQUESTS & RESPONSES
  const transformResponse = () => {
    const options = {
      method: "post",
      url: "https://jsonplaceholder.typicode.com/todos",
      data: {
        title: "Hello World",
      },
      transformResponse: axios.defaults.transformResponse.concat((data) => {
        data.title = data.title.toUpperCase();
        return data;
      }),
    };

    axios(options).then((res) => setRes(res));
  };

  // ERROR HANDLING
  const errorHandling = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/todoss", {
        // validateStatus: function(status) {
        //   return status < 500; // Reject only if status is greater or equal to 500
        // }
      })
      .then((res) => setRes(res))
      .catch((err) => {
        if (err.response) {
          // Server responded with a status other than 200 range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);

          if (err.response.status === 404) {
            alert("Error: Page Not Found");
          }
        } else if (err.request) {
          // Request was made but no response
          console.error(err.request);
        } else {
          console.error(err.message);
        }
      });
  };

  // CANCEL TOKEN
  const cancelToken = () => {
    const source = axios.CancelToken.source();

    axios
      .get("https://jsonplaceholder.typicode.com/todos", {
        cancelToken: source.token,
      })
      .then((res) => setRes(res))
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        }
      });

    if (true) {
      source.cancel("Request canceled!");
    }
  };

  // INTERCEPTING REQUESTS & RESPONSES
  axios.interceptors.request.use(
    (config) => {
      console.log(
        `${config.method.toUpperCase()} request sent to ${
          config.url
        } at ${new Date().getTime()}`
      );
      return config;
    },
    (error) => {
      return Promise.reject();
    }
  );

  // AXIOS INSTANCE
  const axiosInstance = axios.create({
    // Other custom settings
    baseURL: "https://jsonplaceholder.typicode.com",
  });
  axiosInstance.get("/comments").then((res) => setRes(res));

  return (
    <div class="container my-5">
      <div class="text-center">
        <h1 class="display-4 text-center mb-3">Axios Crash Course</h1>
        <button onClick={getTodos} class="btn btn-primary my-3" id="get">
          GET
        </button>
        <button onClick={addTodo} class="btn btn-info" id="post">
          POST
        </button>
        <button onClick={updateTodo} class="btn btn-warning" id="update">
          PUT/PATCH
        </button>
        <button onClick={removeTodo} class="btn btn-danger" id="delete">
          DELETE
        </button>
        <button onClick={getData} class="btn btn-secondary" id="sim">
          Sim Requests
        </button>
        <button onClick={customHeaders} class="btn btn-secondary" id="headers">
          Custom Headers
        </button>
        <button
          onClick={transformResponse}
          class="btn btn-secondary"
          id="transform"
        >
          Transform
        </button>
        <button onClick={errorHandling} class="btn btn-secondary" id="error">
          Error Handling
        </button>
        <button onClick={cancelToken} class="btn btn-secondary" id="cancel">
          Cancel
        </button>
      </div>
      <hr />
      <div class="card card-body mb-4">
        <h5>Status: {res.status}</h5>
      </div>

      <div class="card mt-3">
        <div class="card-header">Headers</div>
        <div class="card-body">
          <pre>{JSON.stringify(res.headers, null, 2)}</pre>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-header">Data</div>
        <div class="card-body">
          <pre>{JSON.stringify(res.data, null, 2)}</pre>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-header">Config</div>
        <div class="card-body">
          <pre>{JSON.stringify(res.config, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
