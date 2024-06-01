import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import ProductDetail from './components/ProductDetail';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/products/:productId" component={ProductDetail} />
      </Switch>
    </Router>
  );
}

export default App;