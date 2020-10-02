import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QuizzProvider } from './QuizzContext';
import './index.css';
import Header from './Header';
import Quizz from './Quizz';
import Stats from './Stats';
import Bookmarks from './Bookmarks';
import NewQuestionForm from './NewQuestionForm';
import Search from './Search';
import Div100vh from 'react-div-100vh'

function App() {

  const [showFilter, setShowFilter] = useState(false)
  
  return <Div100vh><div className="global">
  <QuizzProvider>
    <Router>
      <Header showFilter={showFilter} setShowFilter={setShowFilter} />
      <Switch>
        <Route exact path="/">
          <div className="global__quizz">
            <Quizz showFilter={showFilter} />
          </div>
        </Route>
        <Route path="/addKanji">
          <NewQuestionForm />
        </Route>
        <Route path="/bookmarks">
          <Bookmarks />
        </Route>
        <Route path="/search/:search">
          <Search />
        </Route>
        <Route path="/stats">
          <Stats />
        </Route>
      </Switch>
  </Router>
  </QuizzProvider>
  </div></Div100vh>
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);