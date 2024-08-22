import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle, setCurrentArticle] = useState(null)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => { navigate('/articles')}

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    setMessage('Goodbye!')
    redirectToLogin()
  }

  const login = (credentials) => {
    const { username, password } = credentials
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.status + ' ' + res.statusText)
      }
      return res.json();
    })
    // On success, we should set the token to local storage in a 'token' key,
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        setMessage(data.message);
        // put the server success message in its proper state, and redirect
        // to the Articles screen. Don't forget to turn off the spinner!
        redirectToArticles();
      }
      setSpinnerOn(false);
    })
    .catch((error) => {
      setSpinnerOn(false);
      setMessage('Login failed. Try again.')
    })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch an authenticated request to the proper endpoint.
    fetch(articlesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      },
    })
    // On success, we should set the articles in their proper state and
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        redirectToLogin();
      } else {
        throw new Error('Failed to fetch articles');
      }
    })
    // put the server success message in its proper state.
    .then((data) => {
      setArticles(data.articles);
      setMessage(data.message);
    })
    // If something goes wrong, check the status of the response:
    .catch((error) => {
      if (error.message === 'Unauthorized') {
        redirectToLogin();
      } else {
        setMessage('Failed to fetch articles. Try again.')
      }
    })
    // Don't forget to turn off the spinner!
    .finally(() => {
      setSpinnerOn(false);
    })
  }

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
    setSpinnerOn(true);
    fetch(articlesUrl, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(article)
    })
    .then((res) => res.json())
    .then(data => {
      setArticles([...articles, data.article]);
      setMessage(data.message);
    })
    .catch((error) => {
      setMessage('Failed to post article. Try again');
    })
    .finally(() => {
      setSpinnerOn(false);
    });
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('');
    setSpinnerOn(true);
    fetch(`${articlesUrl}/${article_id}`, {
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(article),
    })
    .then((res) => res.json())
    .then(data => {
      const updatedArticles = articles.map((a) => a.id === article_id ? article : a);
      setArticles(updatedArticles);
      setMessage(data.message);
    })
    .catch((error) => {
      setMessage('Failed to update article. Try again');
    })
    .finally(() => {
      setSpinnerOn(false);
    });
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true);
    fetch(`${articlesUrl}/${article_id}`, {
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({}),
    })
    .then((res) => res.json())
    .then(data => {
      setArticles(articles.filter((a) => a.article_id !== article_id));
      setMessage(data.message);
    })
    .catch((error) => {
      setMessage('Failed to delete article. Try again');
    })
    .finally(() => {
      setSpinnerOn(false);
    });
  }

  const handleSetCurrentArticle = (id) => {
    setCurrentArticleId(id);
    const article = articles.find((a) => a.id === id)
    setCurrentArticle(article);
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn} on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={handleSetCurrentArticle} setMessage={setMessage} redirectToArticles={redirectToArticles}
              currentArticle={currentArticle}
              />
              <Articles articles={articles} updateArticle={updateArticle} deleteArticle={deleteArticle} getArticles={getArticles} setCurrentArticleId={handleSetCurrentArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
