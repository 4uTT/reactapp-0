import React, { Component } from 'react'
import './App.css'
import films from './jsons/films'
import tags from './jsons/tags'

class App extends Component {
  state = {
    activeTab: 1,
    filteredFilms: films,
    tags: tags,
    toLoad: 15,
    selectedTags: [],
    favourites:
      (localStorage.getItem('favourites') &&
        localStorage.getItem('favourites').split(',')) ||
      [],
    search: ''
  }

  changeTab = tab => this.setState({ activeTab: tab })

  handleSearch = e => {
    this.setState(
      {
        [e.target.name]: e.target.value,
        toLoad: 15
      },
      () => {
        this.filterByTagsAndQuery()
      }
    )
  }

  manageFavourites = film => {
    if (this.state.favourites.includes(film)) {
      const favourites = this.state.favourites.filter(f => f !== film)
      this.setState({
        favourites
      })
      localStorage.setItem('favourites', favourites)
    } else {
      const favourites = [...this.state.favourites, film]
      this.setState({ favourites })
      localStorage.setItem('favourites', favourites)
    }
  }

  loadMore = () => this.setState({ toLoad: this.state.toLoad + 15 })

  selectTag = tag => {
    if (this.state.selectedTags.includes(tag)) return
    this.setState(
      { selectedTags: [...this.state.selectedTags, tag], toLoad: 15 },
      this.filterByTagsAndQuery
    )
  }

  removeTag = tag =>
    this.setState(
      {
        selectedTags: this.state.selectedTags.filter(t => t !== tag),
        toLoad: 15
      },
      this.filterByTagsAndQuery
    )

  filterByTagsAndQuery = () => {
    if (this.state.selectedTags.length === 0) {
      if (this.state.search.length > 0) {
        this.setState({
          filteredFilms: films.filter(film =>
            film.title.toLowerCase().includes(this.state.search.toLowerCase())
          )
        })
      } else {
        this.setState({
          filteredFilms: films
        })
      }
    } else {
      this.setState({
        filteredFilms: films.filter(
          film =>
            film.tags.some(tag => this.state.selectedTags.includes(tag)) &&
            film.title.toLowerCase().includes(this.state.search.toLowerCase())
        )
      })
    }
  }

  render() {
    const { activeTab, filteredFilms } = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <ul className="tabs flexx" style={{ width: '100%' }}>
              <li
                onClick={() => this.changeTab(1)}
                className="tab"
                style={{ margin: '0 20px' }}
              >
                <a
                  href="/#"
                  className={`btn waves-effect waves-light black-text ${activeTab ===
                    1 && 'active'}`}
                >
                  Фильмы <i className="material-icons right">live_tv</i>
                </a>
              </li>
              <li
                onClick={() => this.changeTab(2)}
                className="tab"
                style={{ margin: '0 20px' }}
              >
                <a
                  className={`btn waves-effect waves-light black-text ${activeTab ===
                    2 && 'active'}`}
                  href="/#"
                >
                  Закладки <i className="material-icons right">bookmark</i>
                </a>
              </li>
            </ul>
          </div>
          <div
            id="t1"
            className="col s12"
            style={activeTab === 1 ? {} : { display: 'none' }}
          >
            <div className="flexx">
              <div className="search-wrapper" style={{ width: '350px' }}>
                <input
                  id="search"
                  placeholder="Поиск"
                  onChange={this.handleSearch}
                  name="search"
                  value={this.state.search}
                  style={{
                    border: '1px solid #eeeeee',
                    padding: '5px',
                    height: '25px'
                  }}
                />
                <div className="search-results" />
              </div>
            </div>
            <div className="container">
              {tags.map((tag, i) => (
                <div
                  key={i}
                  onClick={() => this.selectTag(tag)}
                  className={`${this.state.selectedTags.includes(tag) &&
                    'selected'} chip`}
                >
                  {tag}
                  {this.state.selectedTags.includes(tag) && (
                    <i
                      onClick={() => this.removeTag(tag)}
                      className="close material-icons"
                    >
                      close
                    </i>
                  )}
                </div>
              ))}
            </div>

            <div className="container">
              <div className="flexx">
                <div className="collection" style={{ width: '450px' }}>
                  {filteredFilms.slice(0, this.state.toLoad).map((film, i) => (
                    <a key={i} href="#!" className="collection-item black-text">
                      {film.title}
                      <span className="badge">
                        <form action="#">
                          <span
                            onClick={() => this.manageFavourites(film.title)}
                            className={`material-icons ${this.state.favourites.includes(
                              film.title
                            ) && 'favourite'}`}
                          >
                            star
                          </span>
                        </form>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              {this.state.toLoad < this.state.filteredFilms.length && (
                <div className="flexx">
                  <button
                    onClick={this.loadMore}
                    className="btn waves-effect waves-light amber lighten-1 black-text"
                    style={{ margin: '0 auto' }}
                  >
                    Показать еще
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            id="t2"
            className="col s12"
            style={activeTab === 2 ? {} : { display: 'none' }}
          >
            <div className="container">
              <div className="flexx">
                <div className="collection" style={{ width: '450px' }}>
                  {this.state.favourites.map((film, i) => (
                    <a key={i} href="#!" className="collection-item black-text">
                      {film}
                      <span className="badge">
                        <form action="#">
                          <span
                            onClick={() => this.manageFavourites(film)}
                            className={`material-icons ${this.state.favourites.includes(
                              film
                            ) && 'favourite'}`}
                          >
                            star
                          </span>
                        </form>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
